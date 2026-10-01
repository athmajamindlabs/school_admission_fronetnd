import type { ReactNode } from 'react';
import RoleGuard from '@/components/RoleGuard';
import Navbar from '@/components/Navbar';

export default function ParentLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard role="parent">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-6 sm:py-8 animate-fade-up">{children}</main>
    </RoleGuard>
  );
}