'use client';

import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import axios from 'axios';
import api from '@/lib/api';
import StatusBadge from '@/components/StatusBadge';
import StatusStepper from '@/components/StatusStepper';
import type { Student } from '@/types';

const courses = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4'];

const errorText = (err: unknown, fallback: string) => {
  const message = axios.isAxiosError(err) ? err.response?.data?.message : null;
  return Array.isArray(message) ? message.join(', ') : message || fallback;
};

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [actionError, setActionError] = useState('');
  const [busy, setBusy] = useState(false);
  const [score, setScore] = useState('');
  const [course, setCourse] = useState(courses[0]);

  const loadStudent = useCallback(async () => {
    try {
      const { data } = await api.get<Student>(`/admissions/${id}`);
      setStudent(data);
    } catch (err) {
      setPageError(errorText(err, 'Could not load application'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadStudent();
  }, [loadStudent]);

  // runs one API call, then reloads so the status updates
  const runAction = async (action: () => Promise<unknown>) => {
    setActionError('');
    setBusy(true);
    try {
      await action();
      await loadStudent();
    } catch (err) {
      setActionError(errorText(err, 'Something went wrong'));
    } finally {
      setBusy(false);
    }
  };

  const handleScore = (e: FormEvent) => {
    e.preventDefault();
    runAction(() => api.patch(`/admissions/${id}/score`, { score: Number(score) }));
  };

  const handleCourse = (e: FormEvent) => {
    e.preventDefault();
    runAction(() => api.patch(`/admissions/${id}/course`, { course }));
  };

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (pageError || !student) return <p className="text-red-600">{pageError || 'Not found'}</p>;

  const info = (label: string, value: string) => (
    <div>
      <p className="text-xs text-gray-500 uppercase">{label}</p>
      <p className="font-semibold text-navy-900">{value}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <Link href="/admission/applications" className="text-sm text-navy-700 hover:underline">
        &larr; Back to applications
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 uppercase break-words">
          {student.studentName}
        </h1>
        <StatusBadge status={student.status} />
      </div>

      <div className="card p-6">
        <StatusStepper current={student.status} />
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-bold text-navy-900 mb-4">Application details</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {info('Date of birth', student.dateOfBirth.slice(0, 10))}
          {info('Gender', student.gender)}
          {info('Previous school', student.previousSchool)}
          {info('Applying grade', student.applyingGrade)}
          {info('Parent', student.parent?.name ?? '-')}
          {info('Parent email', student.parent?.email ?? '-')}
          {student.examSlot && info('Exam slot', `${student.examSlot.date} at ${student.examSlot.time}`)}
        </div>
      </div>

      {actionError && <p className="text-red-600 text-sm">{actionError}</p>}

      {/* waiting for the parent */}
      {(student.status === 'Application Created' ||
        student.status === 'Registration Fee Paid') && (
        <div className="card p-6 text-gray-500 text-sm">
          Waiting for the parent to pay the fee and book an exam slot.
        </div>
      )}

      {/* step: enter score */}
      {student.status === 'Slot Booked' && (
        <form onSubmit={handleScore} className="card p-6 space-y-4">
          <h2 className="text-lg font-bold text-navy-900">Enter exam score</h2>
          <input
            type="number"
            min={0}
            max={100}
            step={1}
            required
            placeholder="Score from 0 to 100"
            className="input sm:max-w-xs"
            value={score}
            onChange={(e) => setScore(e.target.value)}
          />
          <div>
            <button type="submit" disabled={busy} className="btn-primary">
              {busy ? 'Saving...' : 'Save score'}
            </button>
          </div>
        </form>
      )}

      {/* step: assign course */}
      {student.status === 'Exam Completed' && (
        <form onSubmit={handleCourse} className="card p-6 space-y-4">
          <h2 className="text-lg font-bold text-navy-900">Assign course</h2>
          <p className="text-sm text-gray-500">Exam score: {student.examScore} / 100</p>
          <select
            className="input sm:max-w-xs"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          >
            {courses.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <div>
            <button type="submit" disabled={busy} className="btn-primary">
              {busy ? 'Saving...' : 'Assign course'}
            </button>
          </div>
        </form>
      )}

      {/* result */}
      {student.status === 'Admission Completed' && (
        <div className="card p-6 grid sm:grid-cols-2 gap-4">
          {info('Exam score', `${student.examScore} / 100`)}
          {info('Assigned course', student.assignedCourse ?? '-')}
        </div>
      )}
    </div>
  );
}