import type { ApplicationStatus } from '@/types';

const styles: Record<ApplicationStatus, string> = {
  'Application Created': 'bg-gray-100 text-gray-700',
  'Registration Fee Paid': 'bg-blue-100 text-blue-800',
  'Slot Booked': 'bg-purple-100 text-purple-800',
  'Exam Completed': 'bg-orange-100 text-orange-800',
  'Admission Completed': 'bg-green-100 text-green-800',
};

export default function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}