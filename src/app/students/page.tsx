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
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Edit, Trash2, Users, DollarSign, TrendingUp } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Student } from '@/domain/student/types'
import { Class } from '@/domain/class/types'

interface StudentWithClasses extends Student {
  classIds: string[];
}

export default function StudentsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [students, setStudents] = useState<StudentWithClasses[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<StudentWithClasses | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    classIds: [] as string[]
  })

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
      return
    }
    loadStudents()
  }, [session, status, router])

  const loadStudents = async () => {
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

  const handleOpenDialog = (student?: StudentWithClasses) => {
    if (student) {
      setEditingStudent(student)
      setFormData({
        name: student.name,
        phone: student.phoneNumber,
        classIds: student.classIds || []
      })
    } else {
      setEditingStudent(null)
      setFormData({ name: '', phone: '', classIds: [] })
    }
    setDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const phoneRegex = /^010-\d{4}-\d{4}$/
    if (!phoneRegex.test(formData.phone)) {
      alert('전화번호 형식이 올바르지 않습니다.\n010-XXXX-XXXX 형식으로 입력해주세요.')
      return
    }

    try {
      if (editingStudent) {
        const res = await fetch(`/api/students/${editingStudent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            phoneNumber: formData.phone,
            classIds: formData.classIds
          })
        })

        if (!res.ok) {
          const error = await res.json()
          if (error.message === 'Phone number already exists.') {
            alert('이미 등록된 전화번호입니다.\n다른 전화번호를 입력해주세요.')
            return
          }
          throw new Error('수정에 실패했습니다.')
        }
        alert('학생 정보가 수정되었습니다!')
      } else {
        const res = await fetch('/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            phoneNumber: formData.phone,
            classIds: formData.classIds
          })
        })

        if (!res.ok) {
          const error = await res.json()
          if (error.message === 'Phone number already exists.') {
            alert('이미 등록된 전화번호입니다.\n다른 전화번호를 입력해주세요.')
            return
          }
          throw new Error('추가에 실패했습니다.')
        }
        alert('학생이 추가되었습니다!')
      }

      setDialogOpen(false)
      loadStudents()
    } catch (error) {
      console.error('저장 실패:', error)
      alert(error instanceof Error ? error.message : '저장에 실패했습니다.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      const res = await fetch(`/api/students/${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('삭제에 실패했습니다.')
      
      alert('학생이 삭제되었습니다!')
      loadStudents()
    } catch (error) {
      console.error('삭제 실패:', error)
      alert('삭제에 실패했습니다.')
    }
  }

  const toggleClass = (classId: string) => {
    setFormData(prev => ({
      ...prev,
      classIds: prev.classIds.includes(classId)
        ? prev.classIds.filter(id => id !== classId)
        : [...prev.classIds, classId]
    }))
  }

  const getStudentClasses = (student: StudentWithClasses) => {
    return student.classIds
      .map(id => classes.find(c => c.id === id)?.name)
      .filter(Boolean)
      .join(', ') || '없음'
  }

  const calculateStats = () => {
    const totalStudents = students.length
    const totalRevenue = students.reduce((sum, student) => {
      return sum + student.classIds.reduce((classSum, classId) => {
        const classItem = classes.find(c => c.id === classId)
        return classSum + (classItem?.monthlyTuition || 0)
      }, 0)
    }, 0)
    const avgFee = students.length > 0 ? Math.round(totalRevenue / students.length) : 0

    return { totalStudents, totalRevenue, avgFee }
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">학생 관리</h1>
              <p className="text-gray-600">학생 정보를 등록하고 관리하세요</p>
            </div>
            <Button 
              onClick={() => handleOpenDialog()}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              학생 추가
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">전체 학생</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalStudents}명</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">월 예상 수익</p>
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
                  <p className="text-sm font-medium text-gray-600 mb-1">학생당 평균</p>
                  <p className="text-3xl font-bold text-gray-900">{(stats.avgFee / 10000).toFixed(0)}만원</p>
                </div>
                <div className="h-12 w-12 bg-violet-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-violet-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardHeader className="border-b bg-gray-50/50">
            <CardTitle className="text-lg font-semibold">학생 목록</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="font-semibold py-4 px-6">이름</TableHead>
                    <TableHead className="font-semibold py-4 px-6">전화번호</TableHead>
                    <TableHead className="font-semibold py-4 px-6">소속 반</TableHead>
                    <TableHead className="font-semibold py-4 px-6 text-right">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12 text-gray-500">
                        등록된 학생이 없습니다
                      </TableCell>
                    </TableRow>
                  ) : (
                    students.map((student) => (
                      <TableRow key={student.id} className="hover:bg-gray-50/50">
                        <TableCell className="font-medium py-4 px-6">{student.name}</TableCell>
                        <TableCell className="py-4 px-6">{student.phoneNumber}</TableCell>
                        <TableCell className="py-4 px-6">
                          <span className="text-gray-700">{getStudentClasses(student)}</span>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenDialog(student)}
                              className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-600"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              수정
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(student.id)}
                              className="hover:bg-red-50 hover:text-red-600 hover:border-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              삭제
                            </Button>
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

        {/* Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">{editingStudent ? '학생 수정' : '학생 추가'}</DialogTitle>
              <DialogDescription>
                학생 정보를 입력하고 소속 반을 선택하세요
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-5 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">이름</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-11"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">전화번호</Label>
                  <Input
                    id="phone"
                    placeholder="010-1234-5678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-11"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">소속 반</Label>
                  <div className="border rounded-md p-4 space-y-3 bg-gray-50/50">
                    {classes.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-2">등록된 반이 없습니다</p>
                    ) : (
                      classes.map((classItem) => (
                        <div key={classItem.id} className="flex items-center space-x-3">
                          <Checkbox
                            id={classItem.id}
                            checked={formData.classIds.includes(classItem.id)}
                            onCheckedChange={() => toggleClass(classItem.id)}
                          />
                          <Label 
                            htmlFor={classItem.id} 
                            className="cursor-pointer font-normal flex-1"
                          >
                            {classItem.name}
                          </Label>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                  className="flex-1"
                >
                  취소
                </Button>
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                >
                  {editingStudent ? '수정' : '추가'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
