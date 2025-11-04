'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MonthlyInfoManagement } from '@/components/class/MonthlyInfoManagement';
import { StudentManagement } from '@/components/class/StudentManagement';
import { Class, Student } from '@/domain/class/types';

interface ClassDetail extends Class {
  students: Student[];
}

export default function ClassDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [classDetail, setClassDetail] = useState<ClassDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      async function fetchClassDetail() {
        try {
          const res = await fetch(`/api/classes/${id}`);
          if (res.ok) {
            const data = await res.json();
            setClassDetail(data);
          }
        } finally {
          setIsLoading(false);
        }
      }
      fetchClassDetail();
    }
  }, [id]);

  if (isLoading) {
    return <p>로딩 중...</p>;
  }

  if (!classDetail) {
    return <p>반 정보를 찾을 수 없습니다.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{classDetail.name}</h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>월별 수업일수</CardTitle>
        </CardHeader>
        <CardContent>
          <MonthlyInfoManagement classId={id} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>소속 학생</CardTitle>
        </CardHeader>
        <CardContent>
          {/* TODO: 학생 관리 UI 구현 */}
        </CardContent>
      </Card>
    </div>
  );
}
