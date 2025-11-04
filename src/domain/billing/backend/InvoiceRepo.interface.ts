import { Invoice, CreateInvoiceData } from '../types';

export interface IInvoiceRepo {
  /**
   * 청구서 발행
   */
  createInvoice(data: CreateInvoiceData): Invoice;

  /**
   * 학생ID와 월로 청구서 조회
   */
  findInvoiceByStudentAndMonth(studentId: string, month: string): Invoice | null;

  /**
   * 특정 월의 모든 청구서 조회
   */
  findInvoicesByMonth(month: string): Invoice[];
}

