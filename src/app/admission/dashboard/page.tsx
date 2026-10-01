'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import type { ApplicationStatus, Student } from '@/types';

const stages: ApplicationStatus[] = [
  'Application Created',
  'Registration Fee Paid',
  'Slot Booked',
  'Exam Completed',
  'Admission Completed',
];

export default function AdmissionDashboard() {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get<Student[]>('/admissions')
      .then((res) => setStudents(res.data))
      .catch(() => setError('Could not load applications'))
      .finally(() => setLoading(false));
  }, []);

  const countFor = (status: ApplicationStatus) =>
    students.filter((s) => s.status === status).length;

  return (
    <div>
      <p className="text-brand-dark text-sm font-semibold uppercase tracking-wide">
        Admission team
      </p>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 uppercase mt-1">
        Welcome, {user?.name}
      </h1>

      {loading && <p className="text-gray-500 mt-6">Loading...</p>}
      {error && <p className="text-red-600 mt-6">{error}</p>}

      {!loading && !error && (
        <>
          <div className="card p-5 mt-8 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total applications</p>
              <p className="text-3xl font-extrabold text-navy-900">{students.length}</p>
            </div>
            <Link href="/admission/applications" className="btn-primary text-sm">
              View all
            </Link>
          </div>

          <h2 className="text-xl font-bold text-navy-900 mt-8 mb-4">By stage</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stages.map((stage) => (
              <Link
                key={stage}
                href={`/admission/applications?status=${encodeURIComponent(stage)}`}
                className="card card-hover p-5 block"
              >
                <p className="text-gray-500 text-sm">{stage}</p>
                <p className="text-3xl font-extrabold text-navy-900 mt-1">{countFor(stage)}</p>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}