import { NextRequest, NextResponse } from 'next/server';
import { BillingService } from '@/domain/billing/backend/BillingService';

const billingService = new BillingService();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month');

  if (!month) {
    return NextResponse.json({ message: 'Month parameter is required (format: YYYY-MM)' }, { status: 400 });
  }

  // 월 형식 검증 (YYYY-MM)
  if (!/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json({ message: 'Invalid month format. Use YYYY-MM' }, { status: 400 });
  }

  try {
    const billings = billingService.calculateMonthlyBillings(month);
    
    // 발행된 청구서 정보와 병합
    const invoices = billingService.getInvoices(month);
    const invoiceMap = new Map(invoices.map(inv => [inv.studentId, inv]));
    
    const billingsWithInvoiceStatus = billings.map(billing => ({
      ...billing,
      invoiceIssued: invoiceMap.has(billing.studentId),
      invoiceIssuedAt: invoiceMap.get(billing.studentId)?.issuedAt
    }));
    
    console.log(`💰 청구 내역 계산 (${month}):`, billings.length, '명');
    return NextResponse.json(billingsWithInvoiceStatus);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error';
    console.error('❌ 청구 내역 계산 실패:', error);
    return NextResponse.json({ message }, { status: 500 });
  }
}

