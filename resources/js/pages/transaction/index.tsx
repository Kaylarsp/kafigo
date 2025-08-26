import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';

import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { ArrowUpRight, ArrowDownRight, ArrowRightLeft, Calendar, PlusCircle } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

// --- INTERFACES ---
interface Account {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

interface Transaction {
  id: number;
  title?: string | null;
  account_id?: number | null;
  account?: Account | null;
  to_account_id?: number | null;
  to_account?: Account | null;
  category_id?: number | null;
  category?: Category | null;
  amount: number | string;
  type: 'income' | 'outcome' | 'transfer' | string;
  description?: string | null;
  transaction_date?: string | null;
  tags?: Tag[] | null;
}

interface Props {
  transactions?: Transaction[];
  accounts?: Account[];
  categories?: Category[];
  tags?: Tag[];
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Transactions', href: '/transactions' },
];

export default function Transactions({ transactions = [], accounts = [], categories = [], tags = [] }: Props) {
  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount || 0), 0);
  const totalOutcome = transactions.filter((t) => t.type === 'outcome').reduce((s, t) => s + Number(t.amount || 0), 0);
  const totalTransfer = transactions.filter((t) => t.type === 'transfer').reduce((s, t) => s + Number(t.amount || 0), 0);

  const formatFullCurrency = (val: number | string) => `IDR ${Number(val).toLocaleString('id-ID', { minimumFractionDigits: 2 })}`;

  const [selected, setSelected] = useState<Transaction | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);


  type FormData = {
    id?: number | null;
    account_id: string;
    to_account_id: string;
    category_id: string;
    tags: string;
    amount: string;
    type: 'income' | 'outcome' | 'transfer' | string;
    description: string;
    transaction_date: string;
    title?: string;
  };

  const { data, setData, post, put, processing, errors, reset } = useForm<FormData>({
    id: null,
    account_id: '',
    to_account_id: '',
    category_id: '',
    tags: '',
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

  // MODIFIKASI: Fungsi openCreate sekarang mengisi default value
  function openCreate(type: FormData['type']) {
    reset();
    setData({
      ...data,
      type: type,
      // Set akun pertama sebagai default untuk mempercepat input
      account_id: accounts[0]?.id.toString() ?? '',
      // Reset sisa field ke nilai default yang bersih
      to_account_id: '',
      category_id: '',
      tags: '',
      amount: '',
      description: '',
      title: '',
      transaction_date: new Date().toISOString().slice(0, 10),
    });
    setIsFormOpen(true);
  }

  function openEdit(tx: Transaction) {
    setData({
      id: tx.id,
      account_id: (tx.account_id ?? '').toString(),
      to_account_id: (tx.to_account_id ?? '').toString(),
      category_id: (tx.category_id ?? '').toString(),
      tags: tx.tags?.map(t => t.name).join(', ') ?? '',
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
    const url = data.id ? `/transactions/${data.id}` : '/transactions';
    const method = data.id ? put : post;

    method(url, {
      onSuccess: () => { setIsFormOpen(false); reset(); },
    });
  }

  function handleDeleteRequest(tx: Transaction | null) {
    if (!tx) return;
    setSelected(tx);
    setIsViewOpen(false);
    setIsDeleteConfirmOpen(true);
  }

  function confirmDestroy() {
    if (!selected) return;
    router.delete(`/transactions/${selected.id}`, {
      onSuccess: () => {
        setIsDeleteConfirmOpen(false);
        setSelected(null);
      },
    });
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
              <p className="text-slate-600 dark:text-slate-400 mt-1">Track all your incomes, outcomes, and transfers here.</p>
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
            <Button onClick={() => openCreate('income')} className="bg-green-600 hover:bg-green-700">
              <ArrowUpRight className="w-4 h-4 mr-1" /> Add Income
            </Button>
            <Button onClick={() => openCreate('outcome')} className="bg-red-600 hover:bg-red-700">
              <ArrowDownRight className="w-4 h-4 mr-1" /> Add Outcome
            </Button>
            <Button onClick={() => openCreate('transfer')} className="bg-blue-600 hover:bg-blue-700">
              <ArrowRightLeft className="w-4 h-4 mr-1" /> Add Transfer
            </Button>
          </div>

          {/* Transaction list */}
          <Card className="border-0 shadow-lg">
            <CardHeader><CardTitle>Recent Transactions</CardTitle></CardHeader>
            <CardContent>
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {transactions.length === 0 && (
                  <div className="py-4 text-sm text-slate-500">No transactions yet.</div>
                )}
                {transactions.map((t) => (
                  <div key={t.id} className="flex items-center justify-between py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800" onClick={() => openView(t)}>
                    <div className="flex items-center gap-3">
                      {t.type === 'income' ? <ArrowUpRight className="w-5 h-5 text-green-600" /> : t.type === 'outcome' ? <ArrowDownRight className="w-5 h-5 text-red-600" /> : <ArrowRightLeft className="w-5 h-5 text-blue-600" />}
                      <div>
                        <div className="font-medium">{t.title ?? 'Untitled'}</div>
                        <div className="text-xs text-slate-500">{t.transaction_date ?? '—'} • {t.account?.name ?? ''}</div>
                      </div>
                    </div>
                    <div className={`text-right font-semibold ${t.type === 'income' ? 'text-green-600' : t.type === 'outcome' ? 'text-red-600' : 'text-blue-600'}`}>
                      {t.type === 'income' ? '+' : t.type === 'outcome' ? '-' : ''}
                      {formatFullCurrency(t.amount)}
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
          <DialogHeader><DialogTitle>Transaction Details</DialogTitle></DialogHeader>
          <div className="space-y-2 mt-2 text-sm">
            <div><strong>Title:</strong> {selected?.title ?? '-'}</div>
            <div><strong>Type:</strong> <span className="capitalize">{selected?.type}</span></div>
            <div><strong>Amount:</strong> {selected ? formatFullCurrency(selected.amount) : '-'}</div>
            <div><strong>Date:</strong> {selected?.transaction_date ?? '-'}</div>
            <div><strong>{selected?.type === 'transfer' ? 'From Account:' : 'Account:'}</strong> {selected?.account?.name ?? '-'}</div>
            {selected?.type === 'transfer' && <div><strong>To Account:</strong> {selected?.to_account?.name ?? '-'}</div>}
            <div><strong>Category:</strong> {selected?.category?.name ?? '-'}</div>
            <div><strong>Description:</strong> {selected?.description ?? '-'}</div>
            <div><strong>Tags:</strong> {selected?.tags?.map(t => t.name).join(', ') ?? '-'}</div>
          </div>
          <DialogFooter className="mt-4 flex gap-2">
            <Button onClick={() => { setIsViewOpen(false); selected && openEdit(selected); }}>Edit</Button>
            <Button variant="destructive" onClick={() => handleDeleteRequest(selected)}>Delete</Button>
            <Button variant="ghost" onClick={() => setIsViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{data.id ? 'Edit' : 'Add'} {data.type.charAt(0).toUpperCase() + data.type.slice(1)}</DialogTitle>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4 mt-2">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
              {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
            </div>

            <div>
              <Label htmlFor="account_id">{data.type === 'transfer' ? 'From Account' : 'Account'}</Label>
              <Select value={data.account_id} onValueChange={(value) => setData('account_id', value)}>
                <SelectTrigger><SelectValue placeholder="Select an account" /></SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => <SelectItem key={account.id} value={String(account.id)}>{account.name}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.account_id && <p className="text-xs text-red-600 mt-1">{errors.account_id}</p>}
            </div>

            {data.type === 'transfer' && (
              <div>
                <Label htmlFor="to_account_id">To Account</Label>
                <Select value={data.to_account_id} onValueChange={(value) => setData('to_account_id', value)}>
                  <SelectTrigger><SelectValue placeholder="Select destination account" /></SelectTrigger>
                  <SelectContent>
                    {accounts.filter(acc => acc.id.toString() !== data.account_id).map((account) => (
                      <SelectItem key={account.id} value={String(account.id)}>{account.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.to_account_id && <p className="text-xs text-red-600 mt-1">{errors.to_account_id}</p>}
              </div>
            )}

            {/* MODIFIKASI: Kategori sekarang tampil untuk SEMUA jenis transaksi */}
            <div>
              <Label htmlFor="category_id">Category (Optional)</Label>
              <div className="flex items-center gap-2">
                <Select value={data.category_id} onValueChange={(value) => setData('category_id', value)}>
                  <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                  <SelectContent>
                    {/* Opsi "No Category" dihapus. Placeholder akan muncul jika value kosong. */}
                    {categories.map((cat) => <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>)}
                  </SelectContent>                                </Select>
                <Button type="button" variant="outline" size="icon" onClick={() => setIsCategoryModalOpen(true)}>
                  <PlusCircle className="w-4 h-4" />
                </Button>
              </div>
              {errors.category_id && <p className="text-xs text-red-600 mt-1">{errors.category_id}</p>}
            </div>

            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" type="number" value={data.amount} onChange={(e) => setData('amount', e.target.value)} placeholder="e.g., 50000" />
              {errors.amount && <p className="text-xs text-red-600 mt-1">{errors.amount}</p>}
            </div>

            <div>
              <Label htmlFor="transaction_date">Date</Label>
              <Input id="transaction_date" type="date" value={data.transaction_date} onChange={(e) => setData('transaction_date', e.target.value)} />
              {errors.transaction_date && <p className="text-xs text-red-600 mt-1">{errors.transaction_date}</p>}
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Input id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
            </div>

            {/* MODIFIKASI: Tags sekarang tampil untuk SEMUA jenis transaksi */}
            <div>
              <Label htmlFor="tags">Tags (Optional, comma-separated)</Label>
              <div className="flex items-center gap-2">
                <Input id="tags" value={data.tags} onChange={(e) => setData('tags', e.target.value)} placeholder="e.g., food, office" />
              </div>
              {errors.tags && <p className="text-xs text-red-600 mt-1">{errors.tags}</p>}
            </div>

            <DialogFooter className="mt-4 flex gap-2">
              <Button type="submit" disabled={processing}>{processing ? 'Saving...' : (data.id ? 'Update' : 'Create')}</Button>
              <Button type="button" variant="ghost" onClick={() => { reset(); setIsFormOpen(false); }}>Cancel</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Are you sure?</DialogTitle></DialogHeader>
          <div className="py-4">
            <p>This action cannot be undone. This will permanently delete the transaction titled <span className="font-semibold">"{selected?.title}"</span>.</p>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDestroy}>Yes, delete it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CategoryFormModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />

    </AppLayout>
  );
}

function CategoryFormModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { data, setData, post, processing, errors, reset } = useForm({ name: '' });

  const submitCategory = (e: React.FormEvent) => {
    e.preventDefault();
    post('/categories', {
      preserveScroll: true,
      onSuccess: () => {
        onClose();
        reset();
        router.reload({ only: ['categories'] });
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>Add New Category</DialogTitle></DialogHeader>
        <form onSubmit={submitCategory} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="new_category_name">Category Name</Label>
            <Input
              id="new_category_name"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              autoFocus
            />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={processing}>{processing ? 'Saving...' : 'Save Category'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


function SummaryCard({ title, value, color, icon }: { title: string; value: number; color: string; icon: React.ReactNode }) {
  return (
    <Card className={`relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-${color}-500 to-${color}-600 text-white`}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
      <CardHeader className="pb-2 relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium opacity-90">{title}</CardTitle>
          <div className="w-5 h-5 opacity-80">{icon}</div>
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-3xl font-bold">
          {Number(value).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}
        </div>
      </CardContent>
    </Card>
  );
}
