import { NextResponse } from 'next/server';
import { ClassService } from '@/domain/class/backend/ClassService';
import { SqliteClassRepo } from '@/domain/class/backend/SqliteClassRepo';

const classService = new ClassService(new SqliteClassRepo());

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newClass = classService.createClass(body);
    return NextResponse.json(newClass, { status: 201 });
  } catch (error) {
    console.error('POST /api/classes Error:', error);
    const message = error instanceof Error ? error.message : 'Error';
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const classes = classService.getAllClasses();
    return NextResponse.json(classes);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
