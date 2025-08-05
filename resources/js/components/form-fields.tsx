import React from 'react';
import Select from 'react-select';

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export function InputField({
  id,
  label,
  type,
  value,
  onChange,
  error,
}: InputFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required
        className="w-full rounded-md border border-slate-300 py-2 pr-4 pl-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-slate-700 dark:text-white"
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  options: { id: number; name: string }[];
  error?: string;
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  error,
}: SelectFieldProps) {
  const selectOptions = options.map((opt) => ({
    value: opt.id,
    label: opt.name,
  }));

  const selectedOption = selectOptions.find((opt) => opt.value === value) ?? null;

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <Select
        options={selectOptions}
        value={selectedOption}
        onChange={(selected) => onChange(selected?.value ?? null)}
        isSearchable
        classNamePrefix="react-select"
        className="react-select-container dark:text-white"
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
