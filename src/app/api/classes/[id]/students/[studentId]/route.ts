import { NextResponse } from 'next/server';
import { ClassService } from '@/domain/class/backend/ClassService';
import { SqliteClassRepo } from '@/domain/class/backend/SqliteClassRepo';

const classService = new ClassService(new SqliteClassRepo());

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string, studentId: string }> }) {
  try {
    const { id, studentId } = await params;
    classService.removeStudentFromClass(id, studentId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error';
    return NextResponse.json({ message }, { status: 400 });
  }
}
