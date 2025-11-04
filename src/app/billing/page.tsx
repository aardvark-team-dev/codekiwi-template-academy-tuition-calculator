'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Calendar, CreditCard, DollarSign, TrendingDown, FileText, CheckCircle, Send } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'

interface AttendanceDetail {
  date: string
  classId: string
  className: string
  status: string
  deductionAmount: number
}

interface MonthlyBilling {
  studentId: string
  studentName: string
  month: string
  baseAmount: number
  presentCount: number
  absentCount: number
  excusedCount: number
  totalDeduction: number
  finalAmount: number
  attendanceDetails: AttendanceDetail[]
  invoiceIssued?: boolean
  invoiceIssuedAt?: Date
}

export default function BillingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [billings, setBillings] = useState<MonthlyBilling[]>([])
  const [currentMonth, setCurrentMonth] = useState(format(new Date(), 'yyyy-MM'))
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedBilling, setSelectedBilling] = useState<MonthlyBilling | null>(null)
  const [invoiceText, setInvoiceText] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
      return
    }
    loadData()
  }, [session, status, router, currentMonth])

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/billing?month=${currentMonth}`)
      if (res.ok) {
        const data = await res.json()
        setBillings(data)
      }
    } catch (error) {
      console.error('데이터 로드 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetail = (billing: MonthlyBilling) => {
    setSelectedBilling(billing)
    generateInvoiceText(billing)
    setDialogOpen(true)
  }

  const generateInvoiceText = (billing: MonthlyBilling) => {
    const deductionDetails = billing.attendanceDetails.map(detail => 
      `- ${detail.date} (${detail.className}): ${detail.deductionAmount.toLocaleString()}원`
    ).join('\n')

    const text = `[${billing.studentName}님 ${billing.month} 수강료 안내]

📋 정액 수강료: ${billing.baseAmount.toLocaleString()}원

✅ 출석: ${billing.presentCount}회
❌ 결석: ${billing.absentCount}회
📝 유계결석: ${billing.excusedCount}회

${billing.excusedCount > 0 ? `📉 유계결석 차감 내역:\n${deductionDetails}\n\n💰 총 차감액: -${billing.totalDeduction.toLocaleString()}원\n` : ''}
✨ 최종 청구액: ${billing.finalAmount.toLocaleString()}원

감사합니다.`

    setInvoiceText(text)
  }

  const handleIssueInvoice = async () => {
    if (!selectedBilling) return

    try {
      const res = await fetch('/api/billing/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: selectedBilling.studentId,
          month: selectedBilling.month,
          invoiceText
        })
      })

      if (!res.ok) {
        const error = await res.json()
        if (error.message === '이미 발행된 청구서입니다.') {
          alert('이미 발행된 청구서입니다.\n발행 이력은 청구 내역 목록에서 확인하실 수 있습니다.')
          return
        }
        throw new Error(error.message || '청구서 발행에 실패했습니다.')
      }

      alert('청구서가 발행되었습니다!')
      setDialogOpen(false)
      loadData()
    } catch (error) {
      console.error('청구서 발행 실패:', error)
      alert(error instanceof Error ? error.message : '청구서 발행에 실패했습니다.')
    }
  }

  const calculateStats = () => {
    const totalBase = billings.reduce((sum, b) => sum + b.baseAmount, 0)
    const totalDeduction = billings.reduce((sum, b) => sum + b.totalDeduction, 0)
    const totalFinal = billings.reduce((sum, b) => sum + b.finalAmount, 0)
    const issuedCount = billings.filter(b => b.invoiceIssued).length

    return { totalBase, totalDeduction, totalFinal, issuedCount }
  }

  const stats = calculateStats()

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">청구 관리</h1>
              <p className="text-gray-600">월별 청구 내역을 확인하고 청구서를 발행하세요</p>
            </div>
            <div className="flex items-center gap-4">
              <input 
                type="month" 
                value={currentMonth}
                onChange={(e) => setCurrentMonth(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Link href="/attendance">
                <Button variant="outline" size="lg">
                  <Calendar className="w-5 h-5 mr-2" />
                  출결 수정하러 가기
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">정액 수강료</p>
                  <p className="text-2xl font-bold text-gray-900">{(stats.totalBase / 10000).toFixed(0)}만원</p>
                </div>
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">총 차감액</p>
                  <p className="text-2xl font-bold text-orange-600">-{(stats.totalDeduction / 10000).toFixed(0)}만원</p>
                </div>
                <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="h-5 w-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">최종 청구액</p>
                  <p className="text-2xl font-bold text-emerald-600">{(stats.totalFinal / 10000).toFixed(0)}만원</p>
                </div>
                <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-violet-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">발행 건수</p>
                  <p className="text-2xl font-bold text-violet-600">{stats.issuedCount}건</p>
                </div>
                <div className="h-10 w-10 bg-violet-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-violet-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Billing Table */}
        <Card>
          <CardHeader className="border-b bg-gray-50/50">
            <CardTitle className="text-lg font-semibold">{currentMonth} 청구 내역</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {billings.length === 0 ? (
              <div className="text-center py-16">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-4">청구 데이터가 없습니다</p>
                <Link href="/attendance">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Calendar className="w-4 h-4 mr-2" />
                    출결 입력하러 가기
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50">
                      <TableHead className="font-semibold py-4 px-6">학생명</TableHead>
                      <TableHead className="font-semibold py-4 px-6 text-center">출석</TableHead>
                      <TableHead className="font-semibold py-4 px-6 text-center">결석</TableHead>
                      <TableHead className="font-semibold py-4 px-6 text-center">유계결석</TableHead>
                      <TableHead className="font-semibold py-4 px-6 text-right">정액 수강료</TableHead>
                      <TableHead className="font-semibold py-4 px-6 text-right">차감액</TableHead>
                      <TableHead className="font-semibold py-4 px-6 text-right">최종 청구액</TableHead>
                      <TableHead className="font-semibold py-4 px-6 text-center">상태</TableHead>
                      <TableHead className="font-semibold py-4 px-6 text-center">관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {billings.map((billing) => (
                      <TableRow key={billing.studentId} className="hover:bg-gray-50/50">
                        <TableCell className="font-medium py-4 px-6">{billing.studentName}</TableCell>
                        <TableCell className="text-center py-4 px-6">{billing.presentCount}</TableCell>
                        <TableCell className="text-center py-4 px-6">{billing.absentCount}</TableCell>
                        <TableCell className="text-center py-4 px-6">{billing.excusedCount}</TableCell>
                        <TableCell className="text-right py-4 px-6">{billing.baseAmount.toLocaleString()}원</TableCell>
                        <TableCell className="text-right py-4 px-6 text-orange-600 font-medium">
                          -{billing.totalDeduction.toLocaleString()}원
                        </TableCell>
                        <TableCell className="text-right py-4 px-6 font-bold text-gray-900">
                          {billing.finalAmount.toLocaleString()}원
                        </TableCell>
                        <TableCell className="text-center py-4 px-6">
                          {billing.invoiceIssued ? (
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                              발행완료
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                              미발행
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-center py-4 px-6">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetail(billing)}
                            className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-600"
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            상세보기
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detail Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {selectedBilling && selectedBilling.studentName} - 상세 내역
              </DialogTitle>
              <DialogDescription>
                {selectedBilling?.month} 출결 기록 및 청구 내역
              </DialogDescription>
            </DialogHeader>
            
            {selectedBilling && (
              <div className="space-y-6">
                {/* 청구서 텍스트 */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">청구서 내용</Label>
                  <Textarea
                    value={invoiceText}
                    onChange={(e) => setInvoiceText(e.target.value)}
                    rows={15}
                    className="font-mono text-sm"
                  />
                </div>

                {/* 발행 버튼 */}
                <div className="flex gap-3 justify-end pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    닫기
                  </Button>
                  <Button
                    onClick={handleIssueInvoice}
                    disabled={(selectedBilling as any)?.invoiceIssued}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {(selectedBilling as any)?.invoiceIssued ? '발행완료' : '청구서 발행'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

