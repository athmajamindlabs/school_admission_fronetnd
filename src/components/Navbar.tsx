'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const parentLinks = [
  { href: '/parent/dashboard', label: 'Dashboard' },
  { href: '/parent/students', label: 'My Students' },
];

const admissionLinks = [
  { href: '/admission/dashboard', label: 'Dashboard' },
  { href: '/admission/applications', label: 'Applications' },
  { href: '/admission/slots', label: 'Exam Slots' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false); // mobile menu open or closed

  if (!user) return null;
  const links = user.role === 'admission' ? admissionLinks : parentLinks;

  const handleLogout = () => {
    logout();
    router.replace(user.role === 'admission' ? '/admission/login' : '/login');
  };

  const linkClass = (href: string) =>
    `px-3 py-2 rounded-full transition-colors hover:bg-white/10 hover:text-brand ${
      pathname.startsWith(href) ? 'text-brand font-semibold bg-white/10' : ''
    }`;

  return (
    <header className="bg-navy-900 text-white">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <span className="text-lg sm:text-xl font-extrabold text-brand">SCHOOL ADMISSION</span>

        {/* desktop menu */}
        <nav className="hidden md:flex items-center gap-2 text-sm">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              {link.label}
            </Link>
          ))}
          <span className="text-gray-300 mx-2">{user.name}</span>
          <button onClick={handleLogout} className="btn-primary text-sm">
            Logout
          </button>
        </nav>

        {/* mobile menu button */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          className="md:hidden text-2xl px-3 py-1 hover:bg-white/10"
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* mobile menu */}
      {open && (
        <nav className="md:hidden px-4 pb-4 flex flex-col gap-1 text-sm animate-fade-up">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={linkClass(link.href)}
            >
              {link.label}
            </Link>
          ))}
          <p className="px-3 py-2 text-gray-300">{user.name}</p>
          <button onClick={handleLogout} className="btn-primary text-sm self-start">
            Logout
          </button>
        </nav>
      )}
    </header>
  );
}