import { Student, CreateStudentData, UpdateStudentData } from '../types';

export interface IStudentRepo {
  createStudent(data: CreateStudentData): Student;
  findStudentById(id: string): Student | null;
  findStudentByPhone(phone: string): Student | null;
  findAllStudents(): Student[];
  updateStudent(id: string, data: UpdateStudentData): Student | null;
  deleteStudent(id: string): boolean;
}
