import type { ApplicationStatus } from '@/types';

const steps: ApplicationStatus[] = [
  'Application Created',
  'Registration Fee Paid',
  'Slot Booked',
  'Exam Completed',
  'Admission Completed',
];

export default function StatusStepper({ current }: { current: ApplicationStatus }) {
  const currentIndex = steps.indexOf(current);

  return (
    <ol className="flex flex-col sm:flex-row gap-4 sm:gap-2">
      {steps.map((step, i) => {
        const done = i <= currentIndex;
        return (
          <li key={step} className="flex sm:flex-col items-center sm:flex-1 gap-3 sm:gap-2">
            <span
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                done ? 'bg-brand text-navy-900' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {done ? '✓' : i + 1}
            </span>
            <span
              className={`text-xs sm:text-center font-semibold ${
                done ? 'text-navy-900' : 'text-gray-400'
              }`}
            >
              {step}
            </span>
          </li>
        );
      })}
    </ol>
  );
}