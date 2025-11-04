// 🎨 MOCK DATA - 프로토타입용 임시 데이터

export interface Student {
  id: string
  name: string
  phone: string
  classIds: string[] // 소속 반 ID들
  createdAt: Date
}

export interface AttendanceRecord {
  id: string
  studentId: string
  date: string // YYYY-MM-DD
  status: 'present' | 'absent' | 'excused' // 출석, 결석, 유계결석
  deductionAmount?: number // 유계결석 시 차감 금액
}

export interface MonthlyBilling {
  id: string
  studentId: string
  month: string // YYYY-MM
  baseAmount: number // 정액 수강료
  presentCount: number // 출석 일수
  absentCount: number // 결석 일수
  excusedCount: number // 유계결석 일수
  totalDeduction: number // 총 차감 금액
  finalAmount: number // 최종 청구액
  invoiceIssued: boolean
  invoiceIssuedAt?: Date
}

export interface Class {
  id: string
  name: string
  monthlyFee: number
  monthlyClassDays: { [month: string]: number } // 월별 총 수업일수, 예: { "2024-10": 22 }
}

// Mock 반 데이터
export const mockClasses: Class[] = [
  {
    id: 'class-1',
    name: '초등부 A반',
    monthlyFee: 300000,
    monthlyClassDays: { '2024-10': 22, '2024-11': 20 }
  },
  {
    id: 'class-2',
    name: '중등부 B반',
    monthlyFee: 350000,
    monthlyClassDays: { '2024-10': 18, '2024-11': 16 }
  },
  {
    id: 'class-3',
    name: '고등부 C반',
    monthlyFee: 300000,
    monthlyClassDays: { '2024-10': 20, '2024-11': 18 }
  }
]

// Mock 학생 데이터
export const mockStudents: Student[] = [
  {
    id: 'student-1',
    name: '김민준',
    phone: '010-1234-5678',
    classIds: ['class-1'],
    createdAt: new Date('2024-01-15')
  },
  {
    id: 'student-2',
    name: '이서연',
    phone: '010-2345-6789',
    classIds: ['class-2'],
    createdAt: new Date('2024-01-20')
  },
  {
    id: 'student-3',
    name: '박지호',
    phone: '010-3456-7890',
    classIds: ['class-1', 'class-3'],
    createdAt: new Date('2024-02-01')
  }
]

// Mock 출결 데이터 (2024년 10월)
export const mockAttendanceRecords: AttendanceRecord[] = [
  // 김민준
  { id: 'att-1', studentId: 'student-1', date: '2024-10-01', status: 'present' },
  { id: 'att-2', studentId: 'student-1', date: '2024-10-02', status: 'present' },
  { id: 'att-3', studentId: 'student-1', date: '2024-10-03', status: 'excused', deductionAmount: 15000 },
  { id: 'att-4', studentId: 'student-1', date: '2024-10-04', status: 'present' },
  { id: 'att-5', studentId: 'student-1', date: '2024-10-07', status: 'present' },
  { id: 'att-6', studentId: 'student-1', date: '2024-10-08', status: 'absent' },
  { id: 'att-7', studentId: 'student-1', date: '2024-10-09', status: 'present' },
  { id: 'att-8', studentId: 'student-1', date: '2024-10-10', status: 'excused', deductionAmount: 15000 },
  
  // 이서연
  { id: 'att-9', studentId: 'student-2', date: '2024-10-01', status: 'present' },
  { id: 'att-10', studentId: 'student-2', date: '2024-10-02', status: 'present' },
  { id: 'att-11', studentId: 'student-2', date: '2024-10-03', status: 'present' },
  { id: 'att-12', studentId: 'student-2', date: '2024-10-04', status: 'excused', deductionAmount: 17500 },
  { id: 'att-13', studentId: 'student-2', date: '2024-10-07', status: 'present' },
  
  // 박지호
  { id: 'att-14', studentId: 'student-3', date: '2024-10-01', status: 'present' },
  { id: 'att-15', studentId: 'student-3', date: '2024-10-02', status: 'present' },
  { id: 'att-16', studentId: 'student-3', date: '2024-10-03', status: 'present' },
  { id: 'att-17', studentId: 'student-3', date: '2024-10-04', status: 'present' },
]

// Mock 월별 청구 데이터
export const mockMonthlyBillings: MonthlyBilling[] = [
  {
    id: 'bill-1',
    studentId: 'student-1',
    month: '2024-10',
    baseAmount: 300000,
    presentCount: 6,
    absentCount: 1,
    excusedCount: 2,
    totalDeduction: 30000,
    finalAmount: 270000,
    invoiceIssued: false
  },
  {
    id: 'bill-2',
    studentId: 'student-2',
    month: '2024-10',
    baseAmount: 350000,
    presentCount: 4,
    absentCount: 0,
    excusedCount: 1,
    totalDeduction: 17500,
    finalAmount: 332500,
    invoiceIssued: false
  },
  {
    id: 'bill-3',
    studentId: 'student-3',
    month: '2024-10',
    baseAmount: 300000,
    presentCount: 4,
    absentCount: 0,
    excusedCount: 0,
    totalDeduction: 0,
    finalAmount: 300000,
    invoiceIssued: false
  }
]

// Mock API: 학생 목록 조회
export async function getMockStudents(): Promise<Student[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const saved = localStorage.getItem('students')
      if (saved) {
        resolve(JSON.parse(saved))
      } else {
        localStorage.setItem('students', JSON.stringify(mockStudents))
        resolve(mockStudents)
      }
    }, 300)
  })
}

// Mock API: 반 목록 조회
export async function getMockClasses(): Promise<Class[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const saved = localStorage.getItem('classes')
      if (saved) {
        resolve(JSON.parse(saved))
      } else {
        localStorage.setItem('classes', JSON.stringify(mockClasses))
        resolve(mockClasses)
      }
    }, 300)
  })
}

// Mock API: 반 추가
export async function addMockClass(classData: Omit<Class, 'id'>): Promise<Class> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newClass: Class = {
        ...classData,
        id: `class-${Date.now()}`
      }

      const saved = localStorage.getItem('classes')
      const classes = saved ? JSON.parse(saved) : mockClasses
      classes.push(newClass)
      localStorage.setItem('classes', JSON.stringify(classes))

      resolve(newClass)
    }, 300)
  })
}

// Mock API: 반 수정 (수업일수 업데이트)
export async function updateMockClass(id: string, updates: Partial<Class>): Promise<Class> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const saved = localStorage.getItem('classes')
      const classes = saved ? JSON.parse(saved) : mockClasses
      const index = classes.findIndex((c: Class) => c.id === id)

      if (index === -1) {
        reject(new Error('반을 찾을 수 없습니다'))
        return
      }

      classes[index] = { ...classes[index], ...updates }
      localStorage.setItem('classes', JSON.stringify(classes))
      resolve(classes[index])
    }, 300)
  })
}

// Mock API: 학생 추가
export async function addMockStudent(student: Omit<Student, 'id' | 'createdAt'>): Promise<Student> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newStudent: Student = {
        ...student,
        id: `student-${Date.now()}`,
        createdAt: new Date()
      }

      const saved = localStorage.getItem('students')
      const students = saved ? JSON.parse(saved) : mockStudents
      students.push(newStudent)
      localStorage.setItem('students', JSON.stringify(students))

      resolve(newStudent)
    }, 300)
  })
}

// Mock API: 학생 수정
export async function updateMockStudent(id: string, updates: Partial<Student>): Promise<Student> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const saved = localStorage.getItem('students')
      const students = saved ? JSON.parse(saved) : mockStudents
      const index = students.findIndex((s: Student) => s.id === id)
      
      if (index === -1) {
        reject(new Error('학생을 찾을 수 없습니다'))
        return
      }
      
      students[index] = { ...students[index], ...updates }
      localStorage.setItem('students', JSON.stringify(students))
      resolve(students[index])
    }, 300)
  })
}

// Mock API: 학생 삭제
export async function deleteMockStudent(id: string): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const saved = localStorage.getItem('students')
      const students = saved ? JSON.parse(saved) : mockStudents
      const filtered = students.filter((s: Student) => s.id !== id)
      localStorage.setItem('students', JSON.stringify(filtered))
      resolve()
    }, 300)
  })
}

// Mock API: 출결 기록 조회 (학생별, 월별)
export async function getMockAttendanceRecords(studentId: string, month: string): Promise<AttendanceRecord[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const saved = localStorage.getItem('attendance')
      const records = saved ? JSON.parse(saved) : mockAttendanceRecords
      const filtered = records.filter((r: AttendanceRecord) => 
        r.studentId === studentId && r.date.startsWith(month)
      )
      resolve(filtered)
    }, 300)
  })
}

// Mock API: 출결 기록 저장/수정
export async function saveMockAttendanceRecord(record: Omit<AttendanceRecord, 'id'>): Promise<AttendanceRecord> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const saved = localStorage.getItem('attendance')
      const records = saved ? JSON.parse(saved) : mockAttendanceRecords
      
      // 같은 날짜의 기록이 있으면 업데이트, 없으면 추가
      const existingIndex = records.findIndex((r: AttendanceRecord) => 
        r.studentId === record.studentId && r.date === record.date
      )
      
      let newRecord: AttendanceRecord
      if (existingIndex !== -1) {
        newRecord = { ...records[existingIndex], ...record }
        records[existingIndex] = newRecord
      } else {
        newRecord = { ...record, id: `att-${Date.now()}` }
        records.push(newRecord)
      }
      
      localStorage.setItem('attendance', JSON.stringify(records))
      resolve(newRecord)
    }, 300)
  })
}

// Mock API: 월별 청구 데이터 조회
export async function getMockMonthlyBillings(month: string): Promise<MonthlyBilling[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const saved = localStorage.getItem('billings')
      const billings = saved ? JSON.parse(saved) : mockMonthlyBillings
      const filtered = billings.filter((b: MonthlyBilling) => b.month === month)
      resolve(filtered)
    }, 300)
  })
}

// Mock API: 청구서 발행
export async function issueMockInvoice(billingId: string): Promise<MonthlyBilling> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const saved = localStorage.getItem('billings')
      const billings = saved ? JSON.parse(saved) : mockMonthlyBillings
      const index = billings.findIndex((b: MonthlyBilling) => b.id === billingId)

      if (index === -1) {
        reject(new Error('청구 데이터를 찾을 수 없습니다'))
        return
      }

      billings[index].invoiceIssued = true
      billings[index].invoiceIssuedAt = new Date()
      localStorage.setItem('billings', JSON.stringify(billings))
      resolve(billings[index])
    }, 300)
  })
}

// 🎨 MOCK DATA - 프로토타입용 임시 데이터: 특정 날짜의 전체 출결 기록 조회
export async function getMockAttendanceRecordsForDate(date: string): Promise<AttendanceRecord[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const saved = localStorage.getItem('attendance')
      const records = saved ? JSON.parse(saved) : mockAttendanceRecords
      const filtered = records.filter((r: AttendanceRecord) => r.date === date)
      resolve(filtered)
    }, 300)
  })
}

// 🎨 MOCK DATA - 프로토타입용 임시 데이터: 여러 출결 기록 한 번에 저장/수정
export async function saveMockAttendanceRecords(records: Omit<AttendanceRecord, 'id'>[]): Promise<AttendanceRecord[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const saved = localStorage.getItem('attendance')
      const allRecords = saved ? JSON.parse(saved) : mockAttendanceRecords

      const savedRecords: AttendanceRecord[] = []

      records.forEach(record => {
        // 같은 날짜의 기록이 있으면 업데이트, 없으면 추가
        const existingIndex = allRecords.findIndex((r: AttendanceRecord) =>
          r.studentId === record.studentId && r.date === record.date
        )

        let newRecord: AttendanceRecord
        if (existingIndex !== -1) {
          newRecord = { ...allRecords[existingIndex], ...record }
          allRecords[existingIndex] = newRecord
        } else {
          newRecord = { ...record, id: `att-${Date.now()}-${Math.random()}` }
          allRecords.push(newRecord)
        }

        savedRecords.push(newRecord)
      })

      localStorage.setItem('attendance', JSON.stringify(allRecords))
      resolve(savedRecords)
    }, 500) // 시뮬레이션으로 조금 더 긴 시간
  })
}
