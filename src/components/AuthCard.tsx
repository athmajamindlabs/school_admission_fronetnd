import type { ReactNode } from 'react';

export default function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* top bar */}
      <div className="bg-navy-900 text-white text-xs px-6 py-2 border-b border-white/10">
        <div className="max-w-6xl mx-auto">INFO: Admissions are open for the new academic year</div>
      </div>

      {/* logo bar */}
      <header className="bg-navy-900 px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center gap-2">
          <span className="inline-block w-5 h-5 border-2 border-brand" />
          <span className="text-xl sm:text-2xl font-extrabold text-brand tracking-wide">SCHOOL ADMISSION</span>
        </div>
      </header>

      {/* hero */}
      <main className="flex-1 bg-navy-700 px-4 sm:px-6 py-8 md:py-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="hidden md:block text-white animate-fade-up">
            <p className="text-brand text-sm font-semibold uppercase tracking-wide">
              School for everyone
            </p>
            <h2 className="text-4xl lg:text-5xl font-extrabold uppercase leading-tight mt-3">
              Partner for your child&apos;s future
            </h2>
            <p className="mt-6 border-l-4 border-brand pl-4 text-gray-200 max-w-md">
              Apply, pay the registration fee, book an entrance exam slot and follow your
              application status in one place.
            </p>
          </div>

          <div className="bg-white p-8 shadow-xl w-full max-w-md justify-self-center md:justify-self-end animate-fade-up">
            <p className="text-brand-dark text-sm font-semibold uppercase tracking-wide">
              {subtitle}
            </p>
            <h1 className="text-3xl font-extrabold text-navy-900 mt-1 mb-6">{title}</h1>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}