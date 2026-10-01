'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';

export interface StudentFormValues {
  studentName: string;
  dateOfBirth: string; // "YYYY-MM-DD", which is what <input type="date"> gives us
  gender: string;
  previousSchool: string;
  applyingGrade: string;
}

const emptyValues: StudentFormValues = {
  studentName: '',
  dateOfBirth: '',
  gender: 'Male',
  previousSchool: '',
  applyingGrade: 'Grade 1',
};

interface Props {
  initialValues?: StudentFormValues;
  submitLabel: string;
  submitting: boolean;
  error: string;
  onSubmit: (values: StudentFormValues) => void;
}

export default function StudentForm({
  initialValues = emptyValues,
  submitLabel,
  submitting,
  error,
  onSubmit,
}: Props) {
  const [values, setValues] = useState<StudentFormValues>(initialValues);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  // small helper so every field updates state the same way
  const set = (field: keyof StudentFormValues, value: string) =>
    setValues({ ...values, [field]: value });

  const label = 'block text-sm font-semibold text-navy-900 mb-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={label}>Student name</label>
        <input
          className="input"
          value={values.studentName}
          onChange={(e) => set('studentName', e.target.value)}
          required
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>Date of birth</label>
          <input
            type="date"
            className="input"
            value={values.dateOfBirth}
            onChange={(e) => set('dateOfBirth', e.target.value)}
            required
          />
        </div>
        <div>
          <label className={label}>Gender</label>
          <select
            className="input"
            value={values.gender}
            onChange={(e) => set('gender', e.target.value)}
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className={label}>Previous school</label>
        <input
          className="input"
          value={values.previousSchool}
          onChange={(e) => set('previousSchool', e.target.value)}
          required
        />
      </div>

      <div>
        <label className={label}>Applying grade</label>
        <select
          className="input"
          value={values.applyingGrade}
          onChange={(e) => set('applyingGrade', e.target.value)}
        >
          <option>Grade 1</option>
          <option>Grade 2</option>
          <option>Grade 3</option>
          <option>Grade 4</option>
        </select>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button type="submit" disabled={submitting} className="btn-primary">
        {submitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}