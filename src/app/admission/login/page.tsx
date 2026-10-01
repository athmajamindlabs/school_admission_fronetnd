'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import AuthCard from '@/components/AuthCard';

export default function AdmissionLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data.user.role !== 'admission') {
        setError('This login is for the admission team only.');
        return;
      }
      login(data.accessToken, data.user);
      router.push('/admission/dashboard');
    } catch (err) {
      const message = axios.isAxiosError(err) ? err.response?.data?.message : null;
      setError(Array.isArray(message) ? message.join(', ') : message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard title="Admission Team Login" subtitle="Staff access">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-brand"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-brand"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-brand text-navy-900 font-semibold py-2 hover:bg-brand-dark transition-colors disabled:opacity-60"
        >
          {submitting ? 'Signing in...' : 'Login'}
        </button>
      </form>
      <p className="text-sm text-gray-500 mt-4">
        Parent?{' '}
        <Link href="/login" className="text-navy-700 font-semibold underline">
          Parent login
        </Link>
      </p>
    </AuthCard>
  );
}