'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MonthlyClassInfo } from '@/domain/class/types';

interface Props {
  classId: string;
}

export function MonthlyInfoManagement({ classId }: Props) {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [totalLessons, setTotalLessons] = useState(0);
  const [monthlyInfo, setMonthlyInfo] = useState<MonthlyClassInfo | null>(null);

  const fetchMonthlyInfo = useCallback(async () => {
    const res = await fetch(`/api/classes/${classId}/monthly-info?year=${year}&month=${month}`);
    if (res.status === 200) {
      const data = await res.json();
      setMonthlyInfo(data);
      setTotalLessons(data?.totalLessons || 0);
    } else {
      setMonthlyInfo(null);
      setTotalLessons(0);
    }
  }, [classId, year, month]);

  async function handleSave() {
    try {
      const res = await fetch(`/api/classes/${classId}/monthly-info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year, month, totalLessons }),
      });
      
      if (!res.ok) {
        throw new Error('저장에 실패했습니다.');
      }
      
      await fetchMonthlyInfo();
      alert('저장되었습니다!');
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장에 실패했습니다. 다시 시도해주세요.');
    }
  }

  useEffect(() => {
    fetchMonthlyInfo();
  }, [fetchMonthlyInfo]);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <Input type="number" value={year} onChange={(e) => setYear(parseInt(e.target.value) || new Date().getFullYear())} />
        <Input type="number" value={month} onChange={(e) => setMonth(parseInt(e.target.value) || new Date().getMonth() + 1)} />
      </div>
      <Input type="number" placeholder="총 수업일수" value={totalLessons || ''} onChange={(e) => setTotalLessons(parseInt(e.target.value) || 0)} />
      <Button onClick={handleSave} className="mt-2">저장</Button>
    </div>
  );
}
