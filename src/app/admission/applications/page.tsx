'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import StatusBadge from '@/components/StatusBadge';
import type { Student } from '@/types';

const filters = [
  'Application Created',
  'Registration Fee Paid',
  'Slot Booked',
  'Exam Completed',
  'Admission Completed',
];

function ApplicationsList() {
  const router = useRouter();
  const status = useSearchParams().get('status') || '';
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .get<Student[]>('/admissions', { params: status ? { status } : {} })
      .then((res) => setStudents(res.data))
      .catch(() => setError('Could not load applications'))
      .finally(() => setLoading(false));
  }, [status]);

  const changeFilter = (value: string) =>
    router.push(value ? `/admission/applications?status=${encodeURIComponent(value)}` : '/admission/applications');

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <p className="text-brand-dark text-sm font-semibold uppercase tracking-wide">
            {status === 'Admission Completed' ? 'Completed admissions' : 'All applications'}
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 uppercase mt-1">
            Applications
          </h1>
        </div>
        <select
          className="input sm:w-64"
          value={status}
          onChange={(e) => changeFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          {filters.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && students.length === 0 && (
        <div className="card p-8 text-center text-gray-500">No applications found.</div>
      )}

      {/* phones: cards */}
      <div className="space-y-3 md:hidden">
        {students.map((s) => (
          <Link
            key={s._id}
            href={`/admission/applications/${s._id}`}
            className="card card-hover p-4 block"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-bold text-navy-900">{s.studentName}</p>
              <StatusBadge status={s.status} />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {s.applyingGrade} · {s.parent?.name}
            </p>
          </Link>
        ))}
      </div>

      {/* larger screens: table */}
      {students.length > 0 && (
        <div className="card hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Grade</th>
                <th className="px-4 py-3">Parent</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-navy-900">{s.studentName}</td>
                  <td className="px-4 py-3">{s.applyingGrade}</td>
                  <td className="px-4 py-3">
                    {s.parent?.name}
                    <span className="block text-xs text-gray-400">{s.parent?.email}</span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admission/applications/${s._id}`}
                      className="btn-primary text-xs"
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function ApplicationsPage() {
  return (
    <Suspense fallback={<p className="text-gray-500">Loading...</p>}>
      <ApplicationsList />
    </Suspense>
  );
}