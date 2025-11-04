/**
 * Attendance Domain Types
 */

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  EXCUSED_ABSENT = 'EXCUSED_ABSENT',
}

export interface Attendance {
  id: string;
  studentId: string;
  classId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  deductionAmount: number;
  createdAt: Date;
}

export interface SaveAttendanceData {
  studentId: string;
  classId: string;
  date: string;
  status: AttendanceStatus;
  deductionAmount?: number;
}
