'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import axios from 'axios';
import api from '@/lib/api';
import StatusBadge from '@/components/StatusBadge';
import StatusStepper from '@/components/StatusStepper';
import StudentForm from '@/components/StudentForm';
import type { StudentFormValues } from '@/components/StudentForm';
import type { ExamSlot, Student } from '@/types';

const errorText = (err: unknown, fallback: string) => {
  const message = axios.isAxiosError(err) ? err.response?.data?.message : null;
  return Array.isArray(message) ? message.join(', ') : message || fallback;
};

export default function StudentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [slots, setSlots] = useState<ExamSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [actionError, setActionError] = useState('');
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  const loadStudent = useCallback(async () => {
    try {
      const { data } = await api.get<Student>(`/students/${id}`);
      setStudent(data);
      // slots are only needed while the student is waiting to book
      if (data.status === 'Registration Fee Paid') {
        const res = await api.get<ExamSlot[]>('/exam-slots');
        setSlots(res.data);
      }
    } catch (err) {
      setPageError(errorText(err, 'Could not load student'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadStudent();
  }, [loadStudent]);

  // runs one API action, then reloads the student so the status updates
  const runAction = async (action: () => Promise<unknown>) => {
    setActionError('');
    setSaved(false);
    setBusy(true);
    try {
      await action();
      await loadStudent();
      setSaved(true);
    } catch (err) {
      setActionError(errorText(err, 'Something went wrong'));
    } finally {
      setBusy(false);
    }
  };

  const handleUpdate = (values: StudentFormValues) =>
    runAction(() => api.patch(`/students/${id}`, values));
  const handlePay = () => runAction(() => api.post(`/students/${id}/pay`));
  const handleBook = (slotId: string) =>
    runAction(() => api.post(`/exam-slots/${slotId}/book`, { studentId: id }));

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
      <Link href="/parent/students" className="text-sm text-navy-700 hover:underline">
        &larr; Back to students
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl font-extrabold break-words text-navy-900 uppercase">{student.studentName}</h1>
        <StatusBadge status={student.status} />
      </div>

      <div className="card p-6">
        <StatusStepper current={student.status} />
      </div>

      {actionError && <p className="text-red-600 text-sm">{actionError}</p>}
      {saved && !actionError && <p className="text-green-700 text-sm">Saved successfully.</p>}

      {/* Stage 1: editable until the fee is paid */}
      {student.status === 'Application Created' ? (
        <>
          <div className="card p-6">
            <h2 className="text-lg font-bold text-navy-900 mb-4">Edit details</h2>
            <StudentForm
              initialValues={{
                studentName: student.studentName,
                dateOfBirth: student.dateOfBirth.slice(0, 10),
                gender: student.gender,
                previousSchool: student.previousSchool,
                applyingGrade: student.applyingGrade,
              }}
              submitLabel="Save changes"
              submitting={busy}
              error=""
              onSubmit={handleUpdate}
            />
          </div>

          <div className="card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-navy-900">Registration fee</h2>
              <p className="text-sm text-gray-500">
                Mock payment. Details become read-only after paying.
              </p>
            </div>
            <button onClick={handlePay} disabled={busy} className="btn-primary">
              {busy ? 'Processing...' : 'Pay Registration Fee'}
            </button>
          </div>
        </>
      ) : (
        <div className="card p-6">
          <h2 className="text-lg font-bold text-navy-900 mb-4">Student details (read-only)</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {info('Name', student.studentName)}
            {info('Date of birth', student.dateOfBirth.slice(0, 10))}
            {info('Gender', student.gender)}
            {info('Previous school', student.previousSchool)}
            {info('Applying grade', student.applyingGrade)}
            {student.feePaidAt && info('Fee paid on', student.feePaidAt.slice(0, 10))}
          </div>
        </div>
      )}

      {/* Stage 2: choose an exam slot */}
      {student.status === 'Registration Fee Paid' && (
        <div className="card p-6">
          <h2 className="text-lg font-bold text-navy-900 mb-4">Book an entrance exam slot</h2>
          {slots.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No slots are available yet. Please check again later.
            </p>
          ) : (
            <div className="space-y-3">
              {slots.map((slot) => (
                <div
                  key={slot._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-gray-200 rounded-xl p-4"
                >
                  <div>
                    <p className="font-semibold text-navy-900">
                      {slot.date} at {slot.time}
                    </p>
                    <p className="text-xs text-gray-500">
                      {slot.capacity - slot.bookedCount} seats left
                    </p>
                  </div>
                  <button
                    onClick={() => handleBook(slot._id)}
                    disabled={busy}
                    className="btn-primary text-sm"
                  >
                    Book
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Stage 3: booked slot */}
      {student.examSlot && student.status !== 'Registration Fee Paid' && (
        <div className="card p-6">
          <h2 className="text-lg font-bold text-navy-900 mb-2">Entrance exam</h2>
          <p className="text-navy-900">
            {student.examSlot.date} at {student.examSlot.time}
          </p>
          {student.status === 'Slot Booked' && (
            <p className="text-sm text-gray-500 mt-1">Waiting for the exam result.</p>
          )}
        </div>
      )}

      {/* Stage 4 and 5: result */}
      {student.examScore !== undefined && (
        <div className="card p-6 grid sm:grid-cols-2 gap-4">
          {info('Exam score', `${student.examScore} / 100`)}
          {student.assignedCourse && info('Assigned course', student.assignedCourse)}
        </div>
      )}
    </div>
  );
}