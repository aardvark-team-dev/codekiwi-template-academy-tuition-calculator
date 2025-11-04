import { NextRequest, NextResponse } from 'next/server';
import { BillingService } from '@/domain/billing/backend/BillingService';

const billingService = new BillingService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, month, invoiceText } = body;

    if (!studentId || !month || !invoiceText) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // 청구 내역 계산
    const billings = billingService.calculateMonthlyBillings(month);
    const billing = billings.find(b => b.studentId === studentId);

    if (!billing) {
      return NextResponse.json({ message: 'Billing not found' }, { status: 404 });
    }

    // 청구서 발행
    const invoice = billingService.issueInvoice(billing, invoiceText);
    console.log(`📄 청구서 발행:`, invoice.studentName, invoice.month);

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error';
    console.error('❌ 청구서 발행 실패:', error);
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');

  if (!month) {
    return NextResponse.json({ message: 'Month parameter is required' }, { status: 400 });
  }

  try {
    const invoices = billingService.getInvoices(month);
    console.log(`📄 청구서 목록 조회 (${month}):`, invoices.length, '건');
    return NextResponse.json(invoices);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error';
    console.error('❌ 청구서 목록 조회 실패:', error);
    return NextResponse.json({ message }, { status: 500 });
  }
}

