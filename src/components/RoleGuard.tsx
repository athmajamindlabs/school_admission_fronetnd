'use client';

import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import type { Role } from '@/types';

export default function RoleGuard({ role, children }: { role: Role; children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // wait until the saved session is read
    if (!user) {
      router.replace(role === 'admission' ? '/admission/login' : '/login');
    } else if (user.role !== role) {
      router.replace(user.role === 'admission' ? '/admission/dashboard' : '/parent/dashboard');
    }
  }, [user, loading, role, router]);

  if (loading || !user || user.role !== role) {
    return <p className="p-8 text-gray-500">Loading...</p>;
  }
  return <>{children}</>;
}