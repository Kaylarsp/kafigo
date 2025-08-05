import React from 'react';
import clsx from 'clsx';

interface InputFieldColorProps {
  id: string;
  label: string;
  value: string;
  colors?: string[]; // optional external color list
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

const defaultColors = [
  'from-pink-500 to-red-500',
  'from-yellow-400 to-orange-500',
  'from-green-500 to-emerald-500',
  'from-blue-500 to-indigo-500',
  'from-purple-500 to-fuchsia-500',
  'from-slate-500 to-slate-600',
];

export function InputFieldColor({
  id,
  label,
  value,
  colors,
  onChange,
  error,
  className,
}: InputFieldColorProps) {
  const colorOptions = colors ?? defaultColors; // use props.colors if exists, fallback to default

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <div className="flex flex-wrap gap-3 mt-2">
        {colorOptions.map((color) => (
          <button
            key={color}
            type="button"
            aria-label={color}
            onClick={() => onChange(color)}
            className={clsx(
              'h-10 w-10 rounded-full bg-gradient-to-br transition-all duration-200',
              color,
              value === color
                ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-800'
                : 'ring-1 ring-slate-300 dark:ring-slate-600'
            )}
          />
        ))}
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
