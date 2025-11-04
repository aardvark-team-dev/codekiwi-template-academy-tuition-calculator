import { NextResponse } from 'next/server';
import { StudentService } from '@/domain/student/backend/StudentService';
import { SqliteStudentRepo } from '@/domain/student/backend/SqliteStudentRepo';
import { ClassService } from '@/domain/class/backend/ClassService';
import { SqliteClassRepo } from '@/domain/class/backend/SqliteClassRepo';

const studentService = new StudentService(new SqliteStudentRepo());
const classService = new ClassService(new SqliteClassRepo());

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const student = studentService.getStudentById(id);
    if (!student) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }
    
    // 소속 반 정보 추가
    const classes = classService.getClassesByStudentId(id);
    const studentWithClasses = {
      ...student,
      classIds: classes.map(c => c.id)
    };
    
    return NextResponse.json(studentWithClasses);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { classIds, ...studentData } = body;
    
    // 학생 정보 업데이트
    const updatedStudent = studentService.updateStudent(id, studentData);
    
    // 반 소속 업데이트
    if (classIds !== undefined && Array.isArray(classIds)) {
      // 기존 반에서 모두 제거
      const currentClasses = classService.getClassesByStudentId(id);
      currentClasses.forEach(classItem => {
        classService.removeStudentFromClass(classItem.id, id);
      });
      
      // 새로운 반에 추가
      classIds.forEach((classId: string) => {
        try {
          classService.addStudentToClass(classId, id);
        } catch (error) {
          // 이미 존재하는 경우 무시
        }
      });
    }
    
    // 업데이트된 반 정보와 함께 반환
    const classes = classService.getClassesByStudentId(id);
    return NextResponse.json({
      ...updatedStudent,
      classIds: classes.map(c => c.id)
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error';
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    studentService.deleteStudent(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
