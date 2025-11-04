import { NextRequest, NextResponse } from 'next/server';
import { AttendanceService } from '@/domain/attendance/backend/AttendanceService';
import { SqliteAttendanceRepo } from '@/domain/attendance/backend/SqliteAttendanceRepo';

const attendanceService = new AttendanceService(new SqliteAttendanceRepo());

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (!date) {
    return NextResponse.json({ message: 'Date parameter is required' }, { status: 400 });
  }

  try {
    const attendanceData = attendanceService.getAttendancesByDate(date);
    console.log(`📅 출결 조회 (${date}):`, JSON.stringify(attendanceData, null, 2));
    return NextResponse.json(attendanceData);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error';
    console.error('❌ 출결 조회 실패:', error);
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('📝 출결 저장 요청:', JSON.stringify(body, null, 2));
    await attendanceService.saveAttendances(body);
    console.log('✅ 출결 저장 완료');
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error';
    console.error('❌ 출결 저장 실패:', message, error);
    return NextResponse.json({ message }, { status: 400 });
  }
}
