import { IInvoiceRepo } from './InvoiceRepo.interface';
import { Invoice, CreateInvoiceData } from '../types';
import { getDatabase } from '@/lib/shared/database/sqlite';
import Database from 'better-sqlite3';

export class SqliteInvoiceRepo implements IInvoiceRepo {
  private db: Database.Database;

  constructor() {
    this.db = getDatabase();
  }

  createInvoice(data: CreateInvoiceData): Invoice {
    // 중복 발행 방지 체크
    const existing = this.findInvoiceByStudentAndMonth(data.studentId, data.month);
    if (existing) {
      throw new Error('이미 발행된 청구서입니다.');
    }

    const stmt = this.db.prepare(`
      INSERT INTO invoices (student_id, student_name, month, base_amount, total_deduction, final_amount, invoice_text)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      RETURNING id
    `);

    const info = stmt.get(
      data.studentId,
      data.studentName,
      data.month,
      data.baseAmount,
      data.totalDeduction,
      data.finalAmount,
      data.invoiceText
    ) as { id: string };

    const newInvoice = this.findInvoiceById(info.id);
    if (!newInvoice) throw new Error('Failed to create invoice');
    return newInvoice;
  }

  findInvoiceById(id: string): Invoice | null {
    const stmt = this.db.prepare('SELECT * FROM invoices WHERE id = ?');
    const row = stmt.get(id) as any;
    if (!row) return null;

    return {
      id: row.id,
      studentId: row.student_id,
      studentName: row.student_name,
      month: row.month,
      baseAmount: row.base_amount,
      totalDeduction: row.total_deduction,
      finalAmount: row.final_amount,
      invoiceText: row.invoice_text,
      issuedAt: new Date(row.issued_at)
    };
  }

  findInvoiceByStudentAndMonth(studentId: string, month: string): Invoice | null {
    const stmt = this.db.prepare('SELECT * FROM invoices WHERE student_id = ? AND month = ?');
    const row = stmt.get(studentId, month) as any;
    if (!row) return null;

    return {
      id: row.id,
      studentId: row.student_id,
      studentName: row.student_name,
      month: row.month,
      baseAmount: row.base_amount,
      totalDeduction: row.total_deduction,
      finalAmount: row.final_amount,
      invoiceText: row.invoice_text,
      issuedAt: new Date(row.issued_at)
    };
  }

  findInvoicesByMonth(month: string): Invoice[] {
    const stmt = this.db.prepare('SELECT * FROM invoices WHERE month = ? ORDER BY student_name');
    const rows = stmt.all(month) as any[];

    return rows.map(row => ({
      id: row.id,
      studentId: row.student_id,
      studentName: row.student_name,
      month: row.month,
      baseAmount: row.base_amount,
      totalDeduction: row.total_deduction,
      finalAmount: row.final_amount,
      invoiceText: row.invoice_text,
      issuedAt: new Date(row.issued_at)
    }));
  }
}

