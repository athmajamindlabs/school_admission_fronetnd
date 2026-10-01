'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import RoleGuard from '@/components/RoleGuard';
import Navbar from '@/components/Navbar';

export default function AdmissionLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // the login page must stay public
  if (pathname === '/admission/login') return <>{children}</>;

  return (
    <RoleGuard role="admission">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-6 sm:py-8 animate-fade-up">{children}</main>
    </RoleGuard>
  );
}