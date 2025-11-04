'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Student } from '@/domain/class/types';

interface Props {
  classId: string;
  assignedStudents: Student[];
  onStudentAssigned: () => void;
}

export function StudentManagement({ classId, assignedStudents, onStudentAssigned }: Props) {
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAllStudents() {
      const res = await fetch('/api/students');
      if (res.ok) {
        const data = await res.json();
        setAllStudents(data);
      }
    }
    fetchAllStudents();
  }, []);

  async function handleAssign() {
    if (!selectedStudentId) return;
    await fetch(`/api/classes/${classId}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: selectedStudentId }),
    });
    onStudentAssigned();
  }

  async function handleRemove(studentId: string) {
    await fetch(`/api/classes/${classId}/students/${studentId}`, {
      method: 'DELETE',
    });
    onStudentAssigned();
  }

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <Select onValueChange={setSelectedStudentId}>
          <SelectTrigger>
            <SelectValue placeholder="학생 선택" />
          </SelectTrigger>
          <SelectContent>
            {allStudents
              .filter(s => !assignedStudents.some(as => as.id === s.id))
              .map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button onClick={handleAssign}>추가</Button>
      </div>
      <ul>
        {assignedStudents.map(s => (
          <li key={s.id} className="flex justify-between items-center">
            {s.name}
            <Button variant="destructive" size="sm" onClick={() => handleRemove(s.id)}>제거</Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
