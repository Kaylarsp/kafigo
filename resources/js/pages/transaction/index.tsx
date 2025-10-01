import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';

import { type BreadcrumbItem } from '@/types';
import { ArrowDownRight, ArrowRightLeft, ArrowUpRight, Calendar } from 'lucide-react';
import CategoryFormModal from './category_form';
import TransactionFormModal from './form';
import TagFormModal from './tag_form';

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

export interface Transaction {
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
    tags?: number[];
    tags_data?: Tag[];
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
    // --- STATE & DATA MANAGEMENT ---
    const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount || 0), 0);
    const totalOutcome = transactions.filter((t) => t.type === 'outcome').reduce((s, t) => s + Number(t.amount || 0), 0);
    const totalTransfer = transactions.filter((t) => t.type === 'transfer').reduce((s, t) => s + Number(t.amount || 0), 0);

    const formatFullCurrency = (val: number | string) => `IDR ${Number(val).toLocaleString('id-ID', { minimumFractionDigits: 2 })}`;

    const [selected, setSelected] = useState<Transaction | null>(null);
    const [detailedTransaction, setDetailedTransaction] = useState<Transaction | null>(null);

    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [formType, setFormType] = useState<'income' | 'outcome' | 'transfer'>('income');

    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isTagModalOpen, setIsTagModalOpen] = useState(false);

    // --- EFFECTS ---
    useEffect(() => {
        const fetchTransactionDetails = async () => {
            if (selected?.id) {
                try {
                    const response = await axios.post('/transactions/get-transaction', { id: selected.id });
                    setDetailedTransaction(response.data);
                } catch (error) {
                    console.error('Failed to fetch transaction details:', error);
                    setIsViewOpen(false);
                }
            }
        };

        if (isViewOpen) {
            fetchTransactionDetails();
        } else {
            setDetailedTransaction(null);
        }
    }, [isViewOpen, selected]);

    // --- HANDLER FUNCTIONS ---
    function openView(tx: Transaction) {
        setSelected(tx);
        setIsViewOpen(true);
    }

    function openCreate(type: 'income' | 'outcome' | 'transfer') {
        setSelected(null);
        setFormType(type);
        setIsFormOpen(true);
    }

    function openEdit(tx: Transaction) {
        setSelected(tx);
        setIsFormOpen(true);
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
                            <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
                                Transactions
                            </h1>
                            <p className="mt-1 text-slate-600 dark:text-slate-400">Track all your incomes, outcomes, and transfers here.</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <Calendar className="h-4 w-4" />
                            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
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
                            <ArrowUpRight className="mr-1 h-4 w-4" /> Add Income
                        </Button>
                        <Button onClick={() => openCreate('outcome')} className="bg-red-600 hover:bg-red-700">
                            <ArrowDownRight className="mr-1 h-4 w-4" /> Add Outcome
                        </Button>
                        <Button onClick={() => openCreate('transfer')} className="bg-blue-600 hover:bg-blue-700">
                            <ArrowRightLeft className="mr-1 h-4 w-4" /> Add Transfer
                        </Button>
                    </div>

                    {/* Transaction list */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle>Recent Transactions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="divide-y divide-slate-200 dark:divide-slate-700">
                                {transactions.length === 0 && <div className="py-4 text-sm text-slate-500">No transactions yet.</div>}
                                {transactions.map((t) => (
                                    <div
                                        key={t.id}
                                        className="flex cursor-pointer items-center justify-between py-3 hover:bg-slate-50 dark:hover:bg-slate-800"
                                        onClick={() => openView(t)}
                                    >
                                        <div className="flex items-center gap-3">
                                            {t.type === 'income' ? (
                                                <ArrowUpRight className="h-5 w-5 text-green-600" />
                                            ) : t.type === 'outcome' ? (
                                                <ArrowDownRight className="h-5 w-5 text-red-600" />
                                            ) : (
                                                <ArrowRightLeft className="h-5 w-5 text-blue-600" />
                                            )}
                                            <div>
                                                <div className="font-medium">{t.title ?? 'Untitled'}</div>
                                                <div className="text-xs text-slate-500">
                                                    {t.transaction_date ?? '—'} • {t.account?.name ?? ''}
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className={`text-right font-semibold ${t.type === 'income' ? 'text-green-600' : t.type === 'outcome' ? 'text-red-600' : 'text-blue-600'}`}
                                        >
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

            {/* MODALS */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Transaction Details</DialogTitle>
                    </DialogHeader>

                    {/* --- KONTEN DIALOG YANG DIDESAIN ULANG --- */}
                    {!detailedTransaction ? (
                        <div className="py-12 text-center text-muted-foreground">Loading details...</div>
                    ) : (
                        <div className="flex flex-col gap-4 pt-2">
                            {/* Bagian Utama: Jumlah & Judul */}
                            <div className="flex items-start justify-between rounded-lg bg-secondary/50 p-4 dark:bg-secondary/20">
                                <div>
                                    <p className="text-lg font-semibold text-foreground">{detailedTransaction.title ?? 'Untitled Transaction'}</p>
                                    <p className="text-sm text-muted-foreground">{detailedTransaction.transaction_date ?? '-'}</p>
                                </div>
                                <div
                                    className={`flex items-center gap-1 text-2xl font-bold ${
                                        detailedTransaction.type === 'income'
                                            ? 'text-green-600'
                                            : detailedTransaction.type === 'outcome'
                                              ? 'text-red-600'
                                              : 'text-blue-600'
                                    }`}
                                >
                                    {detailedTransaction.type === 'income' ? (
                                        <ArrowUpRight className="h-6 w-6" />
                                    ) : detailedTransaction.type === 'outcome' ? (
                                        <ArrowDownRight className="h-6 w-6" />
                                    ) : (
                                        <ArrowRightLeft className="h-6 w-6" />
                                    )}
                                    <span>{formatFullCurrency(detailedTransaction.amount)}</span>
                                </div>
                            </div>

                            {/* Bagian Detail: Menggunakan Grid */}
                            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                                <DetailItem label="Type">
                                    <span className="rounded-full bg-secondary px-2 py-0.5 text-secondary-foreground dark:bg-slate-700">
                                        {detailedTransaction.type}
                                    </span>
                                </DetailItem>

                                <DetailItem label="Category">{detailedTransaction.category?.name ?? '-'}</DetailItem>

                                <DetailItem label={detailedTransaction.type === 'transfer' ? 'From Account' : 'Account'}>
                                    {detailedTransaction.account?.name ?? '-'}
                                </DetailItem>

                                {detailedTransaction.type === 'transfer' && (
                                    <DetailItem label="To Account">{detailedTransaction.to_account?.name ?? '-'}</DetailItem>
                                )}
                            </div>

                            {/* Bagian Deskripsi & Tags */}
                            {detailedTransaction.description && (
                                <DetailItem label="Description">
                                    <p className="text-foreground">{detailedTransaction.description}</p>
                                </DetailItem>
                            )}

                            {detailedTransaction.tags_data && detailedTransaction.tags_data.length > 0 && (
                                <DetailItem label="Tags">
                                    <div className="flex flex-wrap gap-2">
                                        {detailedTransaction.tags_data.map((tag) => (
                                            <span
                                                key={tag.id}
                                                className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground dark:bg-slate-700"
                                            >
                                                #{tag.name}
                                            </span>
                                        ))}
                                    </div>
                                </DetailItem>
                            )}
                        </div>
                    )}

                    {/* Footer tidak berubah fungsinya */}
                    <DialogFooter className="mt-4 flex gap-2">
                        <Button
                            onClick={() => {
                                setIsViewOpen(false);
                                selected && openEdit(selected);
                            }}
                        >
                            Edit
                        </Button>
                        <Button variant="destructive" onClick={() => handleDeleteRequest(selected)}>
                            Delete
                        </Button>
                        <Button variant="ghost" onClick={() => setIsViewOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <TransactionFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                transaction={selected}
                defaultType={formType}
                accounts={accounts}
                categories={categories}
                tags={tags}
                onCategoryAdd={() => setIsCategoryModalOpen(true)}
                onTagAdd={() => setIsTagModalOpen(true)}
            />

            <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p>
                            This action cannot be undone. This will permanently delete the transaction titled{' '}
                            <span className="font-semibold">"{selected?.title}"</span>.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsDeleteConfirmOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDestroy}>
                            Yes, delete it
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <CategoryFormModal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} />
            <TagFormModal isOpen={isTagModalOpen} onClose={() => setIsTagModalOpen(false)} />
        </AppLayout>
    );
}

function DetailItem({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col">
            <span className="text-xs font-medium text-muted-foreground">{label}</span>
            <span className="text-foreground">{children}</span>
        </div>
    );
}

function SummaryCard({ title, value, color, icon }: { title: string; value: number; color: string; icon: React.ReactNode }) {
    return (
        <Card className={`relative overflow-hidden border-0 bg-gradient-to-br shadow-lg from-${color}-500 to-${color}-600 text-white`}>
            <div className="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-white/10" />
            <CardHeader className="relative z-10 pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium opacity-90">{title}</CardTitle>
                    <div className="h-5 w-5 opacity-80">{icon}</div>
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
