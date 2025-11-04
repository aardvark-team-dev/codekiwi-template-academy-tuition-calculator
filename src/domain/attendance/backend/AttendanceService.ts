import { SaveAttendanceData, AttendanceStatus } from '../types';
import { IAttendanceRepo } from './AttendanceRepo.interface';
import { ClassService } from '@/domain/class/backend/ClassService';
import { SqliteClassRepo } from '@/domain/class/backend/SqliteClassRepo';

export class AttendanceService {
  private classService = new ClassService(new SqliteClassRepo());

  constructor(private repo: IAttendanceRepo) {}

  async saveAttendances(data: SaveAttendanceData[]) {
    const processedData = await Promise.all(data.map(async (att) => {
      if (att.status === AttendanceStatus.EXCUSED_ABSENT && att.deductionAmount === undefined) {
        const classInfo = this.classService.getClassById(att.classId);
        const date = new Date(att.date);
        const monthlyInfo = this.classService.getMonthlyInfo(att.classId, date.getFullYear(), date.getMonth() + 1);
        if (classInfo && monthlyInfo && monthlyInfo.totalLessons > 0) {
          att.deductionAmount = Math.round(classInfo.monthlyTuition / monthlyInfo.totalLessons);
        }
      }
      return att;
    }));
    this.repo.saveAttendances(processedData);
  }

  getAttendancesByDate(date: string) {
    // This needs to be more complex: get classes, then students, then their attendance status for the date.
    const classes = this.classService.getAllClasses();
    const attendances = this.repo.findAttendancesByDate(date);

    return classes.map(c => {
      const students = this.classService.getStudentsInClass(c.id);
      const studentWithAttendance = students.map(s => {
        const attendanceRecord = attendances.find(a => a.studentId === s.id && a.classId === c.id);
        return {
          ...s,
          status: attendanceRecord?.status || null,
          deductionAmount: attendanceRecord?.deductionAmount,
        };
      });
      return { ...c, students: studentWithAttendance };
    });
  }

  getAttendancesByStudent(studentId: string, year: number, month: number) {
    return this.repo.findAttendancesByStudent(studentId, year, month);
  }
}
