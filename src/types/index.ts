export type Role = 'parent' | 'admission';

export type ApplicationStatus =
  | 'Application Created'
  | 'Registration Fee Paid'
  | 'Slot Booked'
  | 'Exam Completed'
  | 'Admission Completed';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface ExamSlot {
  _id: string;
  date: string;
  time: string;
  capacity: number;
  bookedCount: number;
}

export interface Student {
  _id: string;
  studentName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  previousSchool: string;
  applyingGrade: string;
  status: ApplicationStatus;
  feePaidAt?: string;
  examSlot?: ExamSlot;
  examScore?: number;
  assignedCourse?: string;
  parent?: { _id: string; name: string; email: string };
}