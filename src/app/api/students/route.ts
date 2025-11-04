import { NextResponse } from 'next/server';
import { StudentService } from '@/domain/student/backend/StudentService';
import { SqliteStudentRepo } from '@/domain/student/backend/SqliteStudentRepo';
import { ClassService } from '@/domain/class/backend/ClassService';
import { SqliteClassRepo } from '@/domain/class/backend/SqliteClassRepo';

const studentService = new StudentService(new SqliteStudentRepo());
const classService = new ClassService(new SqliteClassRepo());

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('📝 학생 생성 요청:', body);
    const { classIds, ...studentData } = body;
    
    // 학생 생성
    const newStudent = studentService.createStudent(studentData);
    console.log('✅ 학생 생성 완료:', newStudent);
    
    // 반에 학생 추가
    if (classIds && Array.isArray(classIds)) {
      classIds.forEach((classId: string) => {
        try {
          classService.addStudentToClass(classId, newStudent.id);
        } catch (error) {
          // 이미 존재하는 경우 무시
        }
      });
    }
    
    return NextResponse.json({ ...newStudent, classIds: classIds || [] }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error';
    console.error('❌ 학생 생성 실패:', message, error);
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const students = studentService.getAllStudents();
    
    // 각 학생의 소속 반 정보 추가
    const studentsWithClasses = students.map(student => {
      const classes = classService.getClassesByStudentId(student.id);
      return {
        ...student,
        classIds: classes.map(c => c.id)
      };
    });
    
    return NextResponse.json(studentsWithClasses);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
