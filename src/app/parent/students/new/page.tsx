'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import api from '@/lib/api';
import StudentForm from '@/components/StudentForm';
import type { StudentFormValues } from '@/components/StudentForm';

export default function CreateStudentPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async (values: StudentFormValues) => {
    setError('');
    setSubmitting(true);
    try {
      await api.post('/students', values);
      router.push('/parent/students');
    } catch (err) {
      // the backend sends validation messages as an array
      const message = axios.isAxiosError(err) ? err.response?.data?.message : null;
      setError(Array.isArray(message) ? message.join(', ') : message || 'Could not create student');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl">
      <Link href="/parent/students" className="text-sm text-navy-700 hover:underline">
        &larr; Back to students
      </Link>
      <p className="text-brand-dark text-sm font-semibold uppercase tracking-wide mt-4">
        New application
      </p>
      <h1 className="text-3xl font-extrabold text-navy-900 uppercase mt-1 mb-6">Create Student</h1>

      <div className="card p-6">
        <StudentForm
          submitLabel="Create Application"
          submitting={submitting}
          error={error}
          onSubmit={handleCreate}
        />
      </div>
    </div>
  );
}