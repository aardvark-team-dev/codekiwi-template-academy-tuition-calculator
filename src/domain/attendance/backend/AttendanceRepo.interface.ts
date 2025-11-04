import { Attendance, SaveAttendanceData } from '../types';

export interface IAttendanceRepo {
  saveAttendances(data: SaveAttendanceData[]): void;
  findAttendancesByDate(date: string): Attendance[];
  findAttendancesByStudent(studentId: string, year: number, month: number): Attendance[];
}
