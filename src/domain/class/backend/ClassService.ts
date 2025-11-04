import { CreateClassData, SetMonthlyInfoData } from '../types';
import { IClassRepo } from './ClassRepo.interface';

export class ClassService {
  constructor(private repo: IClassRepo) {}

  createClass(data: CreateClassData) {
    return this.repo.createClass(data);
  }

  getClassById(id: string) {
    return this.repo.findClassById(id);
  }

  getAllClasses() {
    return this.repo.findAllClasses();
  }

  addStudentToClass(classId: string, studentId: string) {
    if (this.repo.isStudentInClass(classId, studentId)) {
      throw new Error('Student is already in this class.');
    }
    this.repo.addStudentToClass(classId, studentId);
  }

  removeStudentFromClass(classId: string, studentId: string) {
    this.repo.removeStudentFromClass(classId, studentId);
  }

  getStudentsInClass(classId: string) {
    return this.repo.findStudentsInClass(classId);
  }

  setMonthlyInfo(data: SetMonthlyInfoData) {
    return this.repo.setMonthlyInfo(data);
  }

  getMonthlyInfo(classId: string, year: number, month: number) {
    return this.repo.getMonthlyInfo(classId, year, month);
  }

  getClassesByStudentId(studentId: string) {
    return this.repo.findClassesByStudentId(studentId);
  }
}
