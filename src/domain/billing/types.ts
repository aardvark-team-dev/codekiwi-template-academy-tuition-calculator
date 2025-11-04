/**
 * Billing Domain Types
 */

export interface MonthlyBilling {
  studentId: string;
  studentName: string;
  month: string; // YYYY-MM
  baseAmount: number; // 정액 수강료 (모든 반의 월 수강료 합계)
  presentCount: number;
  absentCount: number;
  excusedCount: number;
  totalDeduction: number; // 유계결석 차감액 총합
  finalAmount: number; // 최종 청구액
  attendanceDetails: AttendanceDetail[]; // 유계결석 상세
}

export interface AttendanceDetail {
  date: string;
  classId: string;
  className: string;
  status: string;
  deductionAmount: number;
}

export interface Invoice {
  id: string;
  studentId: string;
  studentName: string;
  month: string; // YYYY-MM
  baseAmount: number;
  totalDeduction: number;
  finalAmount: number;
  invoiceText: string;
  issuedAt: Date;
}

export interface CreateInvoiceData {
  studentId: string;
  studentName: string;
  month: string;
  baseAmount: number;
  totalDeduction: number;
  finalAmount: number;
  invoiceText: string;
}

