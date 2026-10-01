'use client';

import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import axios from 'axios';
import api from '@/lib/api';
import type { ExamSlot } from '@/types';

export default function SlotsPage() {
  const [slots, setSlots] = useState<ExamSlot[]>([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00 AM');
  const [capacity, setCapacity] = useState('10');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const loadSlots = useCallback(async () => {
    const { data } = await api.get<ExamSlot[]>('/exam-slots');
    setSlots(data);
  }, []);

  useEffect(() => {
    loadSlots().catch(() => setError('Could not load slots'));
  }, [loadSlots]);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api.post('/exam-slots', { date, time, capacity: Number(capacity) });
      setDate('');
      await loadSlots();
    } catch (err) {
      const message = axios.isAxiosError(err) ? err.response?.data?.message : null;
      setError(Array.isArray(message) ? message.join(', ') : message || 'Could not create slot');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-brand-dark text-sm font-semibold uppercase tracking-wide">
          Entrance exam
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 uppercase mt-1">
          Exam Slots
        </h1>
      </div>

      <form onSubmit={handleCreate} className="card p-6 space-y-4">
        <h2 className="text-lg font-bold text-navy-900">Create a slot</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <input
            type="date"
            required
            className="input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <input
            required
            placeholder="Time, e.g. 10:00 AM"
            className="input"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <input
            type="number"
            min={1}
            required
            placeholder="Capacity"
            className="input"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={busy} className="btn-primary">
          {busy ? 'Creating...' : 'Create slot'}
        </button>
      </form>

      <div className="card p-6">
        <h2 className="text-lg font-bold text-navy-900 mb-4">Available slots</h2>
        {slots.length === 0 ? (
          <p className="text-gray-500 text-sm">No slots with free seats.</p>
        ) : (
          <div className="space-y-3">
            {slots.map((s) => (
              <div
                key={s._id}
                className="flex flex-wrap items-center justify-between gap-2 border border-gray-200 rounded-xl p-4"
              >
                <p className="font-semibold text-navy-900">
                  {s.date} at {s.time}
                </p>
                <p className="text-sm text-gray-500">
                  {s.bookedCount} / {s.capacity} booked
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}