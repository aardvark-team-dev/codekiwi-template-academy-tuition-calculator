import { getDatabase } from '@/lib/shared/database/sqlite';
import { Class, CreateClassData, Student, MonthlyClassInfo, SetMonthlyInfoData } from '../types';
import { IClassRepo } from './ClassRepo.interface';

export class SqliteClassRepo implements IClassRepo {
  private db = getDatabase();

  createClass(data: CreateClassData): Class {
    const stmt = this.db.prepare('INSERT INTO classes (name, monthly_tuition) VALUES (?, ?) RETURNING id');
    const info = stmt.get(data.name, data.monthlyTuition) as { id: string };
    const newClass = this.findClassById(info.id);
    if (!newClass) throw new Error('Failed to create class');
    return newClass;
  }

  findClassById(id: string): Class | null {
    const row = this.db.prepare('SELECT * FROM classes WHERE id = ?').get(id) as any;
    return row ? { ...row, monthlyTuition: row.monthly_tuition } : null;
  }

  findAllClasses(): Class[] {
    const rows = this.db.prepare('SELECT * FROM classes').all() as any[];
    return rows.map(row => ({ ...row, monthlyTuition: row.monthly_tuition }));
  }

  addStudentToClass(classId: string, studentId: string): void {
    this.db.prepare('INSERT INTO class_students (class_id, student_id) VALUES (?, ?)').run(classId, studentId);
  }

  removeStudentFromClass(classId: string, studentId: string): void {
    this.db.prepare('DELETE FROM class_students WHERE class_id = ? AND student_id = ?').run(classId, studentId);
  }

  findStudentsInClass(classId: string): Student[] {
    const rows = this.db.prepare('SELECT s.* FROM students s JOIN class_students cs ON s.id = cs.student_id WHERE cs.class_id = ?').all(classId) as any[];
    return rows.map(row => ({ ...row, phoneNumber: row.phone_number }));
  }

  setMonthlyInfo(data: SetMonthlyInfoData): MonthlyClassInfo {
    const { classId, year, month, totalLessons } = data;
    const existing = this.getMonthlyInfo(classId, year, month);
    if (existing) {
      const stmt = this.db.prepare('UPDATE monthly_class_info SET total_lessons = ? WHERE id = ?');
      stmt.run(totalLessons, existing.id);
    } else {
      this.db.prepare('INSERT INTO monthly_class_info (class_id, year, month, total_lessons) VALUES (?, ?, ?, ?)').run(classId, year, month, totalLessons);
    }
    return this.getMonthlyInfo(classId, year, month)!;
  }

  getMonthlyInfo(classId: string, year: number, month: number): MonthlyClassInfo | null {
    const row = this.db.prepare('SELECT * FROM monthly_class_info WHERE class_id = ? AND year = ? AND month = ?').get(classId, year, month) as any;
    return row ? { ...row, totalLessons: row.total_lessons } : null;
  }

  isStudentInClass(classId: string, studentId: string): boolean {
    const row = this.db.prepare('SELECT 1 FROM class_students WHERE class_id = ? AND student_id = ?').get(classId, studentId);
    return !!row;
  }

  findClassesByStudentId(studentId: string): Class[] {
    const rows = this.db.prepare('SELECT c.* FROM classes c JOIN class_students cs ON c.id = cs.class_id WHERE cs.student_id = ?').all(studentId) as any[];
    return rows.map(row => ({ ...row, monthlyTuition: row.monthly_tuition }));
  }
}
