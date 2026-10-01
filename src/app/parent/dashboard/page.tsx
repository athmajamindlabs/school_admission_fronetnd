'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import StatusBadge from '@/components/StatusBadge';
import type { Student } from '@/types';

export default function ParentDashboard() {
  const { user } = useAuth();
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

  const total = students.length;
  const completed = students.filter((s) => s.status === 'Admission Completed').length;

  return (
    <div>
      <p className="text-brand-dark text-sm font-semibold uppercase tracking-wide">Welcome back</p>
      <h1 className="text-2xl sm:text-3xl break-words font-extrabold text-navy-900 uppercase mt-1">{user?.name}</h1>

      <div className="grid sm:grid-cols-3 gap-4 mt-8">
        <div className="card card-hover p-5">
          <p className="text-gray-500 text-sm">Applications</p>
          <p className="text-2xl sm:text-3xl break-words font-extrabold text-navy-900 mt-1">{total}</p>
        </div>
        <div className="card card-hover p-5">
          <p className="text-gray-500 text-sm">In progress</p>
          <p className="text-2xl sm:text-3xl break-words font-extrabold text-navy-900 mt-1">{total - completed}</p>
        </div>
        <div className="card card-hover p-5">
          <p className="text-gray-500 text-sm">Admission completed</p>
          <p className="text-2xl sm:text-3xl break-words font-extrabold text-navy-900 mt-1">{completed}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mt-10 mb-4">
        <h2 className="text-xl font-bold text-navy-900">Recent applications</h2>
        <Link href="/parent/students/new" className="btn-primary text-sm">
          + New Application
        </Link>
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && students.length === 0 && (
        <div className="card p-8 text-center">
          <p className="text-gray-500">You have no applications yet.</p>
          <Link href="/parent/students/new" className="btn-primary inline-block mt-4">
            Create your first application
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {students.slice(0, 5).map((s) => (
          <Link
            key={s._id}
            href={`/parent/students/${s._id}`}
            className="card card-hover p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-semibold text-navy-900">{s.studentName}</p>
              <p className="text-sm text-gray-500">{s.applyingGrade}</p>
            </div>
            <StatusBadge status={s.status} />
          </Link>
        ))}
      </div>
    </div>
  );
}