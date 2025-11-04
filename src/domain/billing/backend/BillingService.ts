import { MonthlyBilling, AttendanceDetail, Invoice, CreateInvoiceData } from '../types';
import { AttendanceService } from '@/domain/attendance/backend/AttendanceService';
import { SqliteAttendanceRepo } from '@/domain/attendance/backend/SqliteAttendanceRepo';
import { ClassService } from '@/domain/class/backend/ClassService';
import { SqliteClassRepo } from '@/domain/class/backend/SqliteClassRepo';
import { StudentService } from '@/domain/student/backend/StudentService';
import { SqliteStudentRepo } from '@/domain/student/backend/SqliteStudentRepo';
import { AttendanceStatus } from '@/domain/attendance/types';
import { IInvoiceRepo } from './InvoiceRepo.interface';
import { SqliteInvoiceRepo } from './SqliteInvoiceRepo';

export class BillingService {
  private attendanceService = new AttendanceService(new SqliteAttendanceRepo());
  private classService = new ClassService(new SqliteClassRepo());
  private studentService = new StudentService(new SqliteStudentRepo());
  private invoiceRepo: IInvoiceRepo = new SqliteInvoiceRepo();

  /**
   * 특정 월의 전체 학생 청구 내역을 실시간으로 계산
   */
  calculateMonthlyBillings(month: string): MonthlyBilling[] {
    // month: "YYYY-MM" 형식
    const [year, monthNum] = month.split('-').map(Number);
    
    // 모든 학생 조회
    const students = this.studentService.getAllStudents();
    
    // 학생별 청구 내역 계산
    return students.map(student => {
      // 학생이 소속된 반 목록 조회
      const studentClasses = this.classService.getClassesByStudentId(student.id);
      
      // 정액 수강료 계산 (모든 반의 월 수강료 합계)
      const baseAmount = studentClasses.reduce((sum, classItem) => sum + classItem.monthlyTuition, 0);
      
      // 해당 월의 출결 기록 조회
      const attendanceRecords = this.attendanceService.getAttendancesByStudent(student.id, year, monthNum);
      
      // 출석/결석/유계결석 횟수 계산
      let presentCount = 0;
      let absentCount = 0;
      let excusedCount = 0;
      const attendanceDetails: AttendanceDetail[] = [];
      
      attendanceRecords.forEach(record => {
        if (record.status === AttendanceStatus.PRESENT) {
          presentCount++;
        } else if (record.status === AttendanceStatus.ABSENT) {
          absentCount++;
        } else if (record.status === AttendanceStatus.EXCUSED_ABSENT) {
          excusedCount++;
          
          // 유계결석 상세 정보 추가
          const classItem = studentClasses.find(c => c.id === record.classId);
          attendanceDetails.push({
            date: record.date,
            classId: record.classId,
            className: classItem?.name || '알 수 없음',
            status: 'EXCUSED_ABSENT',
            deductionAmount: record.deductionAmount
          });
        }
      });
      
      // 유계결석 차감액 총합 계산
      const totalDeduction = attendanceDetails.reduce((sum, detail) => sum + detail.deductionAmount, 0);
      
      // 최종 청구액 = 정액 수강료 - 유계결석 차감액
      const finalAmount = baseAmount - totalDeduction;
      
      return {
        studentId: student.id,
        studentName: student.name,
        month,
        baseAmount,
        presentCount,
        absentCount,
        excusedCount,
        totalDeduction,
        finalAmount,
        attendanceDetails
      };
    });
  }

  /**
   * 청구서 발행
   */
  issueInvoice(billing: MonthlyBilling, invoiceText: string): Invoice {
    const data: CreateInvoiceData = {
      studentId: billing.studentId,
      studentName: billing.studentName,
      month: billing.month,
      baseAmount: billing.baseAmount,
      totalDeduction: billing.totalDeduction,
      finalAmount: billing.finalAmount,
      invoiceText
    };

    return this.invoiceRepo.createInvoice(data);
  }

  /**
   * 특정 월의 발행된 청구서 목록 조회
   */
  getInvoices(month: string): Invoice[] {
    return this.invoiceRepo.findInvoicesByMonth(month);
  }

  /**
   * 학생과 월로 청구서 조회
   */
  getInvoiceByStudentAndMonth(studentId: string, month: string): Invoice | null {
    return this.invoiceRepo.findInvoiceByStudentAndMonth(studentId, month);
  }
}

