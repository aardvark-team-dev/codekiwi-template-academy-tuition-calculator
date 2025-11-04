'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { Plus, Edit, Users, BookOpen, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Class } from '@/domain/class/types'

export default function ClassesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    monthlyTuition: '',
  })

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
      return
    }
    loadClasses()
  }, [session, status, router])

  const loadClasses = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/classes')
      if (res.ok) {
        const data = await res.json()
        setClasses(data)
      }
    } catch (error) {
      console.error('데이터 로드 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          monthlyTuition: parseInt(formData.monthlyTuition),
        })
      })

      if (!res.ok) throw new Error('추가에 실패했습니다.')
      
      alert('반이 추가되었습니다!')
      setAddDialogOpen(false)
      setFormData({ name: '', monthlyTuition: '' })
      loadClasses()
    } catch (error) {
      console.error('추가 실패:', error)
      alert('추가에 실패했습니다.')
    }
  }

  const calculateStats = () => {
    const totalClasses = classes.length
    const avgTuition = classes.length > 0 
      ? Math.round(classes.reduce((sum, c) => sum + c.monthlyTuition, 0) / classes.length)
      : 0
    const totalRevenue = classes.reduce((sum, c) => sum + c.monthlyTuition, 0)

    return { totalClasses, avgTuition, totalRevenue }
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">반 관리</h1>
              <p className="text-gray-600">반 정보를 등록하고 관리하세요</p>
            </div>
            <Button 
              onClick={() => setAddDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              반 추가
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">전체 반</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalClasses}개</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">총 수강료</p>
                  <p className="text-3xl font-bold text-gray-900">{(stats.totalRevenue / 10000).toFixed(0)}만원</p>
                </div>
                <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-violet-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">평균 수강료</p>
                  <p className="text-3xl font-bold text-gray-900">{(stats.avgTuition / 10000).toFixed(0)}만원</p>
                </div>
                <div className="h-12 w-12 bg-violet-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-violet-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardHeader className="border-b bg-gray-50/50">
            <CardTitle className="text-lg font-semibold">반 목록</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="font-semibold py-4 px-6">반 이름</TableHead>
                    <TableHead className="font-semibold py-4 px-6">월 수강료</TableHead>
                    <TableHead className="font-semibold py-4 px-6 text-right">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-12 text-gray-500">
                        등록된 반이 없습니다
                      </TableCell>
                    </TableRow>
                  ) : (
                    classes.map((classItem) => (
                      <TableRow key={classItem.id} className="hover:bg-gray-50/50">
                        <TableCell className="font-medium py-4 px-6">{classItem.name}</TableCell>
                        <TableCell className="py-4 px-6">
                          <span className="font-semibold text-gray-900">
                            {classItem.monthlyTuition.toLocaleString()}원
                          </span>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <div className="flex gap-2 justify-end">
                            <Link href={`/classes/${classItem.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-600"
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                상세보기
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Add Dialog */}
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">반 추가</DialogTitle>
              <DialogDescription>
                새로운 반 정보를 입력하세요
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-5 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">반 이름</Label>
                  <Input
                    id="name"
                    placeholder="예: 중등부 A반"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-11"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tuition" className="text-sm font-medium">월 수강료</Label>
                  <Input
                    id="tuition"
                    type="number"
                    placeholder="예: 300000"
                    value={formData.monthlyTuition}
                    onChange={(e) => setFormData({ ...formData, monthlyTuition: e.target.value })}
                    className="h-11"
                    required
                  />
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setAddDialogOpen(false)}
                  className="flex-1"
                >
                  취소
                </Button>
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                >
                  추가
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
