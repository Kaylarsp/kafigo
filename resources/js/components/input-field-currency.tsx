import React, { useState, useEffect } from 'react';

interface InputFieldCurrencyProps {
  id: string;
  label: string;
  value: number;
  currencyCode: string;
  onChange: (value: number) => void;
  error?: string;
}

export function InputFieldCurrency({
  id,
  label,
  value,
  currencyCode,
  onChange,
  error,
}: InputFieldCurrencyProps) {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    setDisplayValue(formatCurrency(value, currencyCode));
  }, [value, currencyCode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, '');
    const num = parseInt(raw || '0', 10);
    setDisplayValue(formatCurrency(num, currencyCode));
    onChange(num);
  };

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={displayValue}
        onChange={handleChange}
        required
        inputMode="numeric"
        className="w-full rounded-md border border-slate-300 py-2 pr-4 pl-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-slate-700 dark:text-white"
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

function formatCurrency(value: number, currencyCode: string): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: currencyCode || 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
