import { NextRequest, NextResponse } from 'next/server';
import { ClassService } from '@/domain/class/backend/ClassService';
import { SqliteClassRepo } from '@/domain/class/backend/SqliteClassRepo';

const classService = new ClassService(new SqliteClassRepo());

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const year = searchParams.get('year');
  const month = searchParams.get('month');

  if (!year || !month) {
    return NextResponse.json({ message: 'Year and month are required' }, { status: 400 });
  }

  try {
    const monthlyInfo = classService.getMonthlyInfo(id, parseInt(year), parseInt(month));
    if (!monthlyInfo) {
      return new NextResponse(null, { status: 204 }); // No content
    }
    return NextResponse.json(monthlyInfo);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const data = { ...body, classId: id };
    const monthlyInfo = classService.setMonthlyInfo(data);
    return NextResponse.json(monthlyInfo);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error';
    return NextResponse.json({ message }, { status: 400 });
  }
}
