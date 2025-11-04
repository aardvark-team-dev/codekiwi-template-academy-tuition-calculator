import { getDatabase } from '@/lib/shared/database/sqlite';
import { Student, CreateStudentData, UpdateStudentData } from '../types';
import { IStudentRepo } from './StudentRepo.interface';

export class SqliteStudentRepo implements IStudentRepo {
  private db = getDatabase();

  createStudent(data: CreateStudentData): Student {
    const stmt = this.db.prepare('INSERT INTO students (name, phone_number) VALUES (?, ?) RETURNING id');
    const info = stmt.get(data.name, data.phoneNumber) as { id: string };
    const newStudent = this.findStudentById(info.id);
    if (!newStudent) throw new Error('Failed to create student');
    return newStudent;
  }

  findStudentById(id: string): Student | null {
    const row = this.db.prepare('SELECT * FROM students WHERE id = ?').get(id) as any;
    return row ? { ...row, phoneNumber: row.phone_number } : null;
  }

  findStudentByPhone(phone: string): Student | null {
    const row = this.db.prepare('SELECT * FROM students WHERE phone_number = ?').get(phone) as any;
    return row ? { ...row, phoneNumber: row.phone_number } : null;
  }

  findAllStudents(): Student[] {
    const rows = this.db.prepare('SELECT * FROM students').all() as any[];
    return rows.map(row => ({ ...row, phoneNumber: row.phone_number }));
  }

  updateStudent(id: string, data: UpdateStudentData): Student | null {
    const { name, phoneNumber } = data;
    if (name) {
      this.db.prepare('UPDATE students SET name = ? WHERE id = ?').run(name, id);
    }
    if (phoneNumber) {
      this.db.prepare('UPDATE students SET phone_number = ? WHERE id = ?').run(phoneNumber, id);
    }
    return this.findStudentById(id);
  }

  deleteStudent(id: string): boolean {
    const info = this.db.prepare('DELETE FROM students WHERE id = ?').run(id);
    return info.changes > 0;
  }
}
