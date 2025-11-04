'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Calendar as CalendarIcon, Save, Info } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface Student {
  id: string
  name: string
  phoneNumber: string
  classIds: string[]
  createdAt: Date
}

interface Class {
  id: string
  name: string
  monthlyTuition: number
  createdAt: Date
}

interface AttendanceRecord {
  id: string
  studentId: string
  date: string
  status: 'present' | 'absent' | 'excused'
  deductionAmount?: number
}

interface AttendanceState {
  status: 'present' | 'absent' | 'excused'
  deductionAmount?: number
}

export default function AttendancePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [students, setStudents] = useState<Student[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [attendanceMap, setAttendanceMap] = useState<Map<string, AttendanceState>>(new Map())

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
      return
    }
    loadData()
  }, [session, status, router])

  const loadData = async () => {
    setLoading(true)
    try {
      const [studentsRes, classesRes] = await Promise.all([
        fetch('/api/students'),
        fetch('/api/classes')
      ])
      
      if (studentsRes.ok && classesRes.ok) {
        const studentsData = await studentsRes.json()
        const classesData = await classesRes.json()
        setStudents(studentsData)
        setClasses(classesData)
      }
    } catch (error) {
      console.error('데이터 로드 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (students.length > 0) {
      loadAttendanceForDate()
    }
  }, [selectedDate, students])

  const loadAttendanceForDate = async () => {
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd')
      const res = await fetch(`/api/attendance?date=${dateStr}`)
      
      if (res.ok) {
        const data = await res.json()
        const statusMap: Record<string, 'present' | 'absent' | 'excused'> = {
          'PRESENT': 'present',
          'ABSENT': 'absent',
          'EXCUSED_ABSENT': 'excused'
        }
        
        const newMap = new Map()
        data.forEach((classItem: any) => {
          classItem.students.forEach((student: any) => {
            if (student.status) {
              newMap.set(student.id, {
                status: statusMap[student.status] || 'present',
                deductionAmount: student.deductionAmount
              })
            }
          })
        })
        setAttendanceMap(newMap)
      }
    } catch (error) {
      console.error('출결 기록 로드 실패:', error)
    }
  }

  const calculateDeductionAmount = async (student: Student, selectedMonth: string): Promise<number> => {
    let totalFee = 0
    let totalClassDays = 0
    
    for (const classId of student.classIds) {
      const classItem = classes.find(c => c.id === classId)
      if (classItem) {
        totalFee += classItem.monthlyTuition
        const [year, month] = selectedMonth.split('-').map(Number)
        try {
          const res = await fetch(`/api/classes/${classId}/monthly-info?year=${year}&month=${month}`)
          if (res.ok) {
            const monthlyInfo = await res.json()
            totalClassDays = Math.max(totalClassDays, monthlyInfo.totalLessons || 20)
          } else {
            totalClassDays = 20
          }
        } catch (error) {
          totalClassDays = 20
        }
      }
    }

    if (totalClassDays === 0) {
      totalClassDays = 20
    }
    return Math.round(totalFee / totalClassDays)
  }

  const handleStatusChange = async (studentId: string, status: 'present' | 'absent' | 'excused') => {
    if (status === 'excused') {
      const student = students.find(s => s.id === studentId)
      if (student) {
        const selectedMonth = format(selectedDate, 'yyyy-MM')
        const autoDeduction = await calculateDeductionAmount(student, selectedMonth)
        setAttendanceMap(prev => {
          const newMap = new Map(prev)
          const current = newMap.get(studentId) || { status: 'present' as const }
          newMap.set(studentId, { ...current, status, deductionAmount: autoDeduction })
          return newMap
        })
      } else {
        setAttendanceMap(prev => {
          const newMap = new Map(prev)
          const current = newMap.get(studentId) || { status: 'present' as const }
          newMap.set(studentId, { ...current, status })
          return newMap
        })
      }
    } else {
      setAttendanceMap(prev => {
        const newMap = new Map(prev)
        const current = newMap.get(studentId) || { status: 'present' as const }
        newMap.set(studentId, { ...current, status, deductionAmount: undefined })
        return newMap
      })
    }
  }

  const handleDeductionChange = (studentId: string, amount: number) => {
    setAttendanceMap(prev => {
      const newMap = new Map(prev)
      const current = newMap.get(studentId) || { status: 'present' as const }
      newMap.set(studentId, { ...current, deductionAmount: amount })
      return newMap
    })
  }

  const handleBulkSave = async () => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd')
    const records: any[] = []
    const statusMap: Record<string, string> = {
      'present': 'PRESENT',
      'absent': 'ABSENT',
      'excused': 'EXCUSED_ABSENT'
    }

    attendanceMap.forEach((value, studentId) => {
      const student = students.find(s => s.id === studentId)
      if (student && student.classIds) {
        student.classIds.forEach(classId => {
          records.push({
            studentId,
            classId,
            date: dateStr,
            status: statusMap[value.status],
            deductionAmount: value.status === 'excused' ? (value.deductionAmount || 0) : 0
          })
        })
      }
    })

    if (records.length === 0) {
      alert('저장할 출결 정보가 없습니다.')
      return
    }

    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(records)
      })
      
      if (!res.ok) {
        throw new Error('저장에 실패했습니다.')
      }
      
      alert('출결 정보가 저장되었습니다!')
      await loadAttendanceForDate()
    } catch (error) {
      console.error('출결 저장 실패:', error)
      alert('저장에 실패했습니다.')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-600 text-xl">로딩 중...</div>
      </div>
    )
  }

  const groupedStudents: Record<string, Student[]> = {}
  classes.forEach(classItem => {
    groupedStudents[classItem.id] = students.filter(s => s.classIds.includes(classItem.id))
  })

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">출결 관리</h1>
              <p className="text-gray-600">날짜별 학생 출결 상태를 관리하세요</p>
            </div>
            <Button 
              onClick={handleBulkSave}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              size="lg"
            >
              <Save className="w-5 h-5 mr-2" />
              전체 저장
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="border-b bg-gray-50/50">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                날짜 선택
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                locale={ko}
                className="rounded-md border"
              />
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900 mb-2">선택한 날짜</p>
                <p className="text-lg font-bold text-blue-600">
                  {format(selectedDate, 'yyyy년 MM월 dd일 (EEE)', { locale: ko })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Attendance List */}
          <Card className="lg:col-span-2">
            <CardHeader className="border-b bg-gray-50/50">
              <CardTitle className="text-lg font-semibold">출결 상태 입력</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {classes.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>등록된 반이 없습니다</p>
                </div>
              ) : (
                <Accordion type="multiple" className="space-y-4">
                  {classes.map((classItem) => {
                    const classStudents = groupedStudents[classItem.id] || []
                    if (classStudents.length === 0) return null

                    return (
                      <AccordionItem 
                        key={classItem.id} 
                        value={classItem.id}
                        className="border rounded-lg px-4"
                      >
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center justify-between w-full pr-4">
                            <span className="font-semibold text-gray-900">{classItem.name}</span>
                            <span className="text-sm text-gray-500">
                              학생 {classStudents.length}명
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 pt-4">
                            {classStudents.map((student) => {
                              const record = attendanceMap.get(student.id)
                              const status = record?.status || 'present'

                              return (
                                <div 
                                  key={student.id}
                                  className="p-4 bg-gray-50 rounded-lg border space-y-3"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="font-medium text-gray-900">{student.name}</div>
                                    <RadioGroup
                                      value={status}
                                      onValueChange={(value) => 
                                        handleStatusChange(student.id, value as 'present' | 'absent' | 'excused')
                                      }
                                      className="flex gap-3"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="present" id={`${student.id}-present`} />
                                        <Label 
                                          htmlFor={`${student.id}-present`}
                                          className="cursor-pointer font-normal"
                                        >
                                          출석
                                        </Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="absent" id={`${student.id}-absent`} />
                                        <Label 
                                          htmlFor={`${student.id}-absent`}
                                          className="cursor-pointer font-normal"
                                        >
                                          결석
                                        </Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="excused" id={`${student.id}-excused`} />
                                        <Label 
                                          htmlFor={`${student.id}-excused`}
                                          className="cursor-pointer font-normal"
                                        >
                                          유계결석
                                        </Label>
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Info className="w-4 h-4 text-gray-400 cursor-help" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>유계결석 선택 시 차감액이 자동 계산됩니다</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      </div>
                                    </RadioGroup>
                                  </div>

                                  {status === 'excused' && (
                                    <div className="flex items-center justify-end gap-2 pt-2 border-t">
                                      <Label htmlFor={`${student.id}-deduction`} className="text-sm text-gray-600 whitespace-nowrap">
                                        차감액
                                      </Label>
                                      <Input
                                        id={`${student.id}-deduction`}
                                        type="number"
                                        value={record?.deductionAmount || 0}
                                        onChange={(e) => handleDeductionChange(student.id, Number(e.target.value))}
                                        className="w-32 text-right"
                                        placeholder="0"
                                      />
                                      <span className="text-sm text-gray-600">원</span>
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
