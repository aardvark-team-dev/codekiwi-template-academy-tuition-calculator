/**
 * Student Domain Types
 */

export interface Student {
  id: string;
  name: string;
  phoneNumber: string;
  createdAt: Date;
}

export interface CreateStudentData {
  name: string;
  phoneNumber: string;
}

export interface UpdateStudentData {
  name?: string;
  phoneNumber?: string;
}
