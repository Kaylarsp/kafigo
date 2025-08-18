import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';


import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { ArrowUpRight, ArrowDownRight, ArrowRightLeft, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

interface Account {
  id: number;
  name: string;
}

interface Transaction {
  id: number;
  title?: string | null;
  account_id?: number | null;
  account?: Account | null;
  amount: number | string;
  type: 'income' | 'expense' | 'transfer' | string;
  description?: string | null;
  transaction_date?: string | null;
  tags?: string[] | null;
}

interface Props {
  transactions?: Transaction[];
  accounts?: Account[];
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Transactions', href: '/transactions' },
];

export default function Transactions({ transactions = [], accounts = [] }: Props) {
  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount || 0), 0);
  const totalOutcome = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount || 0), 0);
  const totalTransfer = transactions.filter((t) => t.type === 'transfer').reduce((s, t) => s + Number(t.amount || 0), 0);

  const formatCurrency = (val: number) => `IDR ${(val / 1_000_000).toFixed(2)}m`;
  const formatFullCurrency = (val: number) => `IDR ${Number(val).toLocaleString('id-ID', { minimumFractionDigits: 2 })}`;

  const [selected, setSelected] = useState<Transaction | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  type FormData = {
    id?: number | null;
    account_id: string;
    amount: string;
    type: 'income' | 'expense' | 'transfer' | string;
    description: string;
    transaction_date: string;
    title?: string;
  };

  const { data, setData, post, put, processing, errors, reset } = useForm<FormData>({
    id: null,
    account_id: '',
    amount: '',
    type: 'income',
    description: '',
    transaction_date: new Date().toISOString().slice(0, 10),
    title: '',
  });

  function openView(tx: Transaction) {
    setSelected(tx);
    setIsViewOpen(true);
  }

  function openCreate(type: FormData['type']) {
    reset();
    setData('type', type);
    setIsFormOpen(true);
  }

  function openEdit(tx: Transaction) {
    setData({
      id: tx.id,
      account_id: (tx.account_id ?? '').toString(),
      amount: Number(tx.amount || 0).toString(),
      type: tx.type,
      description: tx.description ?? '',
      transaction_date: tx.transaction_date ?? new Date().toISOString().slice(0, 10),
      title: tx.title ?? '',
    });
    setIsFormOpen(true);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (data.id) {
      put(`/transactions/${data.id}`, {
        onSuccess: () => { setIsFormOpen(false); reset(); },
      });
    } else {
      post('/transactions', {
        onSuccess: () => { setIsFormOpen(false); reset(); },
      });
    }
  }

  function destroy(id?: number) {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    router.delete(`/transactions/${id}`);
    setIsViewOpen(false);
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Transactions" />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="flex flex-col gap-6 p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Transactions
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">Track all your incomes, expenses, and transfers here.</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Calendar className="w-4 h-4" />
              {new Date().toLocaleDateString('id-ID', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="grid gap-6 md:grid-cols-3">
            <SummaryCard title="Income" value={totalIncome} color="green" icon={<ArrowUpRight />} />
            <SummaryCard title="Outcome" value={totalOutcome} color="red" icon={<ArrowDownRight />} />
            <SummaryCard title="Transfer" value={totalTransfer} color="blue" icon={<ArrowRightLeft />} />
          </div>

          {/* Quick Add */}
          <div className="flex gap-2">
            <Button onClick={() => openCreate('income')}>Add Transaction</Button>
          </div>

          {/* Transaction list */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {transactions.length === 0 && (
                  <div className="py-4 text-sm text-slate-500">No transactions yet.</div>
                )}
                {transactions.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between py-3 cursor-pointer hover:bg-slate-50"
                    onClick={() => openView(t)}
                  >
                    <div className="flex items-center gap-3">
                      {t.type === 'income' ? (
                        <ArrowUpRight className="w-5 h-5 text-green-600" />
                      ) : t.type === 'expense' ? (
                        <ArrowDownRight className="w-5 h-5 text-red-600" />
                      ) : (
                        <ArrowRightLeft className="w-5 h-5 text-blue-600" />
                      )}
                      <div>
                        <div className="font-medium">{t.title ?? 'Untitled'}</div>
                        <div className="text-xs text-slate-500">
                          {t.transaction_date ?? '—'} • {t.description ?? ''}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={
                          t.type === 'income'
                            ? 'text-green-600 font-semibold'
                            : t.type === 'expense'
                            ? 'text-red-600 font-semibold'
                            : 'text-blue-600 font-semibold'
                        }
                      >
                        {t.type === 'income' ? '+' : t.type === 'expense' ? '-' : ''}
                        {formatFullCurrency(Number(t.amount))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.title ?? 'Transaction Detail'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-2 mt-2 text-sm">
            <div><strong>Type:</strong> {selected?.type}</div>
            <div><strong>Amount:</strong> {selected ? formatFullCurrency(Number(selected.amount)) : '-'}</div>
            <div><strong>Date:</strong> {selected?.transaction_date ?? '-'}</div>
            <div><strong>Account:</strong> {selected?.account?.name ?? selected?.account_id ?? '-'}</div>
            <div><strong>Description:</strong> {selected?.description ?? '-'}</div>
            <div><strong>Tags:</strong> {selected?.tags?.join(', ') ?? '-'}</div>
          </div>

          <DialogFooter className="mt-4 flex gap-2">
            <Button onClick={() => selected && openEdit(selected)}>Edit</Button>
            <Button variant="destructive" onClick={() => destroy(selected?.id)}>Delete</Button>
            <Button variant="ghost" onClick={() => setIsViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{data.id ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={submit} className="space-y-3 mt-2">
            <div>
              <Label>Title</Label>
              <Input value={data.title} onChange={(e) => setData('title', e.target.value)} />
            </div>

            <div>
              <Label htmlFor="account_id">Account</Label>
              <select
                id="account_id"
                className="w-full rounded-md border px-3 py-2"
                value={data.account_id}
                onChange={(e) => setData('account_id', e.target.value)}
              >
                <option value="">Select an account</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>{account.name}</option>
                ))}
              </select>
              {errors.account_id && <p className="text-xs text-red-600">{errors.account_id}</p>}
            </div>

            <div>
              <Label>Amount</Label>
              <Input type="number" value={data.amount} onChange={(e) => setData('amount', e.target.value)} />
              {errors.amount && <p className="text-xs text-red-600">{errors.amount}</p>}
            </div>

            <div>
              <Label>Type</Label>
              <select
                className="w-full rounded-md border px-3 py-2"
                value={data.type}
                onChange={(e) => setData('type', e.target.value as any)}
              >
                <option value="income">Income</option>
                <option value="expense">Outcome</option>
                <option value="transfer">Transfer</option>
              </select>
              {errors.type && <p className="text-xs text-red-600">{errors.type}</p>}
            </div>

            <div>
              <Label>Date</Label>
              <Input type="date" value={data.transaction_date} onChange={(e) => setData('transaction_date', e.target.value)} />
              {errors.transaction_date && <p className="text-xs text-red-600">{errors.transaction_date}</p>}
            </div>

            <div>
              <Label>Description</Label>
              <Input value={data.description} onChange={(e) => setData('description', e.target.value)} />
            </div>

            <DialogFooter className="mt-2 flex gap-2">
              <Button type="submit" disabled={processing}>{data.id ? 'Update' : 'Create'}</Button>
              <Button variant="ghost" onClick={() => { reset(); setIsFormOpen(false); }}>Cancel</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

function SummaryCard({ title, value, color, icon }: { title: string; value: number; color: string; icon: React.ReactNode }) {
  return (
    <Card className={`relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-${color}-600 to-${color}-700 text-white`}>
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
      <CardHeader className="pb-2 relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium opacity-90">{title}</CardTitle>
          <div className="w-5 h-5 opacity-80">{icon}</div>
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-3xl font-bold mb-2">IDR {(value / 1_000_000).toFixed(2)}m</div>
        <div className="text-sm opacity-90">Total {title.toLowerCase()}</div>
      </CardContent>
    </Card>
  );
}
