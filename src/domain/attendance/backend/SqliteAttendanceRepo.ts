import { getDatabase } from '@/lib/shared/database/sqlite';
import { Attendance, SaveAttendanceData } from '../types';
import { IAttendanceRepo } from './AttendanceRepo.interface';

export class SqliteAttendanceRepo implements IAttendanceRepo {
  private db = getDatabase();

  saveAttendances(data: SaveAttendanceData[]): void {
    const stmt = this.db.prepare(`
      INSERT INTO attendances (student_id, class_id, date, status, deduction_amount)
      VALUES (@studentId, @classId, @date, @status, @deductionAmount)
      ON CONFLICT(student_id, class_id, date) DO UPDATE SET
        status = excluded.status,
        deduction_amount = excluded.deduction_amount
    `);

    const transaction = this.db.transaction((attendances: SaveAttendanceData[]) => {
      for (const att of attendances) {
        stmt.run({
          studentId: att.studentId,
          classId: att.classId,
          date: att.date,
          status: att.status,
          deductionAmount: att.deductionAmount || 0,
        });
      }
    });

    transaction(data);
  }

  findAttendancesByDate(date: string): Attendance[] {
    const rows = this.db.prepare('SELECT * FROM attendances WHERE date = ?').all(date) as any[];
    return rows.map(row => ({ ...row, studentId: row.student_id, classId: row.class_id, deductionAmount: row.deduction_amount }));
  }

  findAttendancesByStudent(studentId: string, year: number, month: number): Attendance[] {
    const datePrefix = `${year}-${month.toString().padStart(2, '0')}`;
    const rows = this.db.prepare('SELECT * FROM attendances WHERE student_id = ? AND date LIKE ?').all(studentId, `${datePrefix}-%`) as any[];
    return rows.map(row => ({ ...row, studentId: row.student_id, classId: row.class_id, deductionAmount: row.deduction_amount }));
  }
}
