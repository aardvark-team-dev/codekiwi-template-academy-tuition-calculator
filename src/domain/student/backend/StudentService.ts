import { CreateStudentData, UpdateStudentData } from '../types';
import { IStudentRepo } from './StudentRepo.interface';

const PHONE_REGEX = /^010-\d{4}-\d{4}$/;

export class StudentService {
  constructor(private repo: IStudentRepo) {}

  createStudent(data: CreateStudentData) {
    if (!PHONE_REGEX.test(data.phoneNumber)) {
      throw new Error('Invalid phone number format. Use 010-XXXX-XXXX.');
    }
    if (this.repo.findStudentByPhone(data.phoneNumber)) {
      throw new Error('Phone number already exists.');
    }
    return this.repo.createStudent(data);
  }

  getStudentById(id: string) {
    return this.repo.findStudentById(id);
  }

  getAllStudents() {
    return this.repo.findAllStudents();
  }

  updateStudent(id: string, data: UpdateStudentData) {
    if (data.phoneNumber && !PHONE_REGEX.test(data.phoneNumber)) {
      throw new Error('Invalid phone number format. Use 010-XXXX-XXXX.');
    }
    const existing = data.phoneNumber ? this.repo.findStudentByPhone(data.phoneNumber) : null;
    if (existing && existing.id !== id) {
      throw new Error('Phone number already exists.');
    }
    return this.repo.updateStudent(id, data);
  }

  deleteStudent(id: string) {
    return this.repo.deleteStudent(id);
  }
}
