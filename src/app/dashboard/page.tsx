'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Users, BookOpen, CalendarCheck, CreditCard, TrendingUp, DollarSign, CheckCircle, Clock, Plus } from 'lucide-react'

interface Student {
  id: string;
  name: string;
  phoneNumber: string;
  classIds: string[];
}

interface Class {
  id: string;
  name: string;
  monthlyTuition: number;
}

interface MonthlyBilling {
  studentId: string;
  studentName: string;
  month: string;
  baseAmount: number;
  presentCount: number;
  absentCount: number;
  excusedCount: number;
  totalDeduction: number;
  finalAmount: number;
  invoiceIssued: boolean;
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [students, setStudents] = useState<Student[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [billings, setBillings] = useState<MonthlyBilling[]>([])

  const currentMonth = format(new Date(), 'yyyy-MM')

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
      return
    }
    loadDashboardData()
  }, [session, status, router])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const [studentsRes, classesRes, billingsRes] = await Promise.all([
        fetch('/api/students'),
        fetch('/api/classes'),
        fetch(`/api/billing?month=${currentMonth}`)
      ])

      const studentsData = await studentsRes.json()
      const classesData = await classesRes.json()
      const billingsData = await billingsRes.json()

      setStudents(studentsData)
      setClasses(classesData)
      setBillings(billingsData)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalStudents = students.length
  const totalClasses = classes.length
  const totalExpectedRevenue = billings.reduce((sum, b) => sum + b.baseAmount, 0)
  const totalFinalRevenue = billings.reduce((sum, b) => sum + b.finalAmount, 0)
  const totalDeductions = billings.reduce((sum, b) => sum + b.totalDeduction, 0)
  const invoiceIssued = billings.filter(b => b.invoiceIssued).length

  const totalPresent = billings.reduce((sum, b) => sum + b.presentCount, 0)
  const totalAbsent = billings.reduce((sum, b) => sum + b.absentCount, 0)
  const totalExcused = billings.reduce((sum, b) => sum + b.excusedCount, 0)
  const totalAttendanceRecords = totalPresent + totalAbsent + totalExcused
  const attendanceRate = totalAttendanceRecords > 0 ? (totalPresent / totalAttendanceRecords) * 100 : 0

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-600 text-xl">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">대시보드</h1>
          <p className="text-gray-600">학원 운영 현황을 한눈에 확인하세요</p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">총 학생 수</p>
                  <p className="text-3xl font-bold text-gray-900">{totalStudents}명</p>
                  <p className="text-xs text-gray-500 mt-1">현재 등록된 학생</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">총 반 수</p>
                  <p className="text-3xl font-bold text-gray-900">{totalClasses}개</p>
                  <p className="text-xs text-gray-500 mt-1">개설된 전체 반</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">예상 월 수익</p>
                  <p className="text-3xl font-bold text-gray-900">{(totalExpectedRevenue / 10000).toFixed(0)}만원</p>
                  <p className="text-xs text-gray-500 mt-1">차감 전 총 수강료</p>
                </div>
                <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">최종 월 수익</p>
                  <p className="text-3xl font-bold text-gray-900">{(totalFinalRevenue / 10000).toFixed(0)}만원</p>
                  <p className="text-xs text-gray-500 mt-1">차감 후 최종 청구액</p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader className="border-b bg-gray-50/50">
            <CardTitle className="text-lg font-semibold">빠른 작업</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/students" className="block">
                <Button className="w-full h-20 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md">
                  <div className="flex flex-col items-center gap-2">
                    <Users className="w-6 h-6" />
                    <span className="font-medium">학생 관리</span>
                  </div>
                </Button>
              </Link>
              <Link href="/classes" className="block">
                <Button className="w-full h-20 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-md">
                  <div className="flex flex-col items-center gap-2">
                    <BookOpen className="w-6 h-6" />
                    <span className="font-medium">반 관리</span>
                  </div>
                </Button>
              </Link>
              <Link href="/attendance" className="block">
                <Button className="w-full h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md">
                  <div className="flex flex-col items-center gap-2">
                    <CalendarCheck className="w-6 h-6" />
                    <span className="font-medium">출결 입력</span>
                  </div>
                </Button>
              </Link>
              <Link href="/billing" className="block">
                <Button className="w-full h-20 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md">
                  <div className="flex flex-col items-center gap-2">
                    <CreditCard className="w-6 h-6" />
                    <span className="font-medium">청구 관리</span>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Summary */}
          <Card>
            <CardHeader className="border-b bg-gray-50/50">
              <CardTitle className="text-lg font-semibold">{currentMonth} 월별 요약</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-700">총 출석률</span>
                  </div>
                  <span className="text-xl font-bold text-blue-600">{attendanceRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-orange-600" />
                    </div>
                    <span className="font-medium text-gray-700">총 유계결석 차감액</span>
                  </div>
                  <span className="text-xl font-bold text-orange-600">-{(totalDeductions / 10000).toFixed(0)}만원</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                    </div>
                    <span className="font-medium text-gray-700">발행된 청구서</span>
                  </div>
                  <span className="text-xl font-bold text-emerald-600">{invoiceIssued}건</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="border-b bg-gray-50/50">
              <CardTitle className="text-lg font-semibold">최근 활동</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">학생 관리</p>
                    <p className="text-sm text-gray-600 truncate">총 {totalStudents}명의 학생이 등록되어 있습니다</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">반 운영</p>
                    <p className="text-sm text-gray-600 truncate">총 {totalClasses}개의 반이 운영중입니다</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">청구서 발행</p>
                    <p className="text-sm text-gray-600 truncate">{currentMonth} 기준 {invoiceIssued}건 발행 완료</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
