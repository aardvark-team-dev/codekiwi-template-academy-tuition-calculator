/**
 * Class Domain Types
 */

// ============================================================================
// Entities
// ============================================================================

export interface Class {
  id: string;
  name: string;
  monthlyTuition: number;
  createdAt: Date;
}

export interface Student {
  id: string;
  name: string;
  phoneNumber: string;
  createdAt: Date;
}

export interface ClassStudent {
  classId: string;
  studentId: string;
  createdAt: Date;
}

export interface MonthlyClassInfo {
  id: string;
  classId: string;
  year: number;
  month: number;
  totalLessons: number;
  createdAt: Date;
}

// ============================================================================
// DTOs
// ============================================================================

export interface CreateClassData {
  name: string;
  monthlyTuition: number;
}

export interface AddStudentToClassData {
  classId: string;
  studentId: string;
}

export interface SetMonthlyInfoData {
  classId: string;
  year: number;
  month: number;
  totalLessons: number;
}
