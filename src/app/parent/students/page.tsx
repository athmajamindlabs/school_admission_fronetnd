'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import StatusBadge from '@/components/StatusBadge';
import type { Student } from '@/types';

export default function StudentListPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get<Student[]>('/students')
      .then((res) => setStudents(res.data))
      .catch(() => setError('Could not load your students'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <p className="text-brand-dark text-sm font-semibold uppercase tracking-wide">
            Your applications
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 uppercase mt-1">My Students</h1>
        </div>
        <Link href="/parent/students/new" className="btn-primary text-sm">
          + New Application
        </Link>
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && students.length === 0 && (
        <div className="card p-8 text-center">
          <p className="text-gray-500">No students yet.</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {students.map((s) => (
          <Link
            key={s._id}
            href={`/parent/students/${s._id}`}
            className="card card-hover p-5 block"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-bold text-navy-900">{s.studentName}</h2>
              <StatusBadge status={s.status} />
            </div>
            <p className="text-sm text-gray-500 mt-2">Applying for {s.applyingGrade}</p>
            <p className="text-sm text-gray-500">From {s.previousSchool}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}