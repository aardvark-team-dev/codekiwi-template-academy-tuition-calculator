import { Class, CreateClassData, Student, MonthlyClassInfo, SetMonthlyInfoData } from '../types';

export interface IClassRepo {
  createClass(data: CreateClassData): Class;
  findClassById(id: string): Class | null;
  findAllClasses(): Class[];
  addStudentToClass(classId: string, studentId: string): void;
  removeStudentFromClass(classId: string, studentId: string): void;
  findStudentsInClass(classId: string): Student[];
  setMonthlyInfo(data: SetMonthlyInfoData): MonthlyClassInfo;
  getMonthlyInfo(classId: string, year: number, month: number): MonthlyClassInfo | null;
  isStudentInClass(classId: string, studentId: string): boolean;
  findClassesByStudentId(studentId: string): Class[];
}
