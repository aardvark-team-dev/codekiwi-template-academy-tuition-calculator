import { NextResponse } from 'next/server';
import { ClassService } from '@/domain/class/backend/ClassService';
import { SqliteClassRepo } from '@/domain/class/backend/SqliteClassRepo';

const classService = new ClassService(new SqliteClassRepo());

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const classInfo = classService.getClassById(id);
    if (!classInfo) {
      return NextResponse.json({ message: 'Class not found' }, { status: 404 });
    }
    const students = classService.getStudentsInClass(id);
    return NextResponse.json({ ...classInfo, students });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
