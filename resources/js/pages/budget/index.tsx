import { InputField, SelectField } from '@/components/form-fields';
import { Card, CardContent } from '@/components/ui/card';
import Modal from '@/components/ui/modal';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Wallet, Plus } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

interface Account {
    id: number;
    name: string;
}

interface Category {
    id: number;
    name: string;
}

interface Budget {
    id: number;
    nama: string; // 👈 gunakan nama
    start_date: string;
    end_date: string;
    amount: string;
    spent: string;
    remaining: string;
    account: Account;
    category?: Category | null;
}

interface PageProps {
    budgets: Budget[];
    accounts: Account[];
    categories: Category[];
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Budgets', href: '/budgets' }];

const formatCurrency = (val: string | number, currencyCode = 'IDR') => {
    const numberValue = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(numberValue)) return `0,00 ${currencyCode}`;
    return `${numberValue.toLocaleString('id-ID', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} ${currencyCode}`;
};

export default function Budgets({ budgets, accounts, categories }: PageProps) {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<Budget | null>(null);

    const fetchBudget = async (id: number) => {
        try {
            const response = await fetch(`/budgets/${id}/edit`);
            const result = await response.json();
            setFormData(result.data);
            setShowForm(true);
        } catch (err) {
            console.error('Failed to fetch budget', err);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Budgets" />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                <div className="flex-1 p-4 sm:p-6 lg:p-8">
                    <div className="mb-12 flex flex-col items-start justify-between sm:flex-row sm:items-center">
                        <div className="mb-4 flex items-center gap-4 sm:mb-0">
                            <div className="rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 p-3 shadow-lg">
                                <Wallet className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-4xl font-bold text-transparent">
                                    Budgets
                                </h1>
                                <p className="mt-1 text-slate-600 dark:text-slate-400">Manage your spending budgets</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {budgets.map((budget) => (
                            <Card
                                key={budget.id}
                                className="relative border-0 bg-white dark:bg-slate-800 shadow-lg rounded-2xl transition-all duration-300 hover:scale-[1.01] hover:shadow-xl"
                            >
                                <CardContent className="p-6">
                                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                        <div>
                                            <h3 className="mb-1 text-lg font-semibold">
                                                {budget.nama} • {budget.category ? budget.category.name : 'General'} - {budget.account.name}
                                            </h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                {budget.start_date} → {budget.end_date}
                                            </p>
                                            <div className="mt-3 flex flex-col gap-1">
                                                <span className="text-sm text-slate-500 dark:text-slate-400">Total: {formatCurrency(budget.amount)}</span>
                                                <span className="text-sm text-red-500">Spent: {formatCurrency(budget.spent)}</span>
                                                <span className="text-sm text-green-600 dark:text-green-400 font-semibold">
                                                    Remaining: {formatCurrency(budget.remaining)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 self-start sm:self-center">
                                            <button
                                                onClick={() => fetchBudget(budget.id)}
                                                className="rounded-md bg-green-600 px-3 py-1 text-sm font-semibold text-white hover:bg-green-700"
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="mt-12 flex justify-center">
                        <button
                            onClick={() => {
                                setFormData(null);
                                setShowForm(true);
                            }}
                            className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-4 font-bold text-white shadow-xl hover:scale-105 hover:from-green-700 hover:to-emerald-700"
                        >
                            <div className="relative flex items-center gap-3">
                                <div className="rounded-lg bg-white/20 p-2">
                                    <Plus className="h-6 w-6" />
                                </div>
                                <span className="text-lg">Add New Budget</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <BudgetFormModal
                show={showForm}
                initialData={formData ?? undefined}
                accounts={accounts}
                categories={categories}
                onClose={() => {
                    setShowForm(false);
                    setFormData(null);
                }}
            />
        </AppLayout>
    );
}

function BudgetFormModal({
    initialData,
    show,
    onClose,
    accounts,
    categories,
}: {
    initialData?: Budget;
    show: boolean;
    onClose: () => void;
    accounts: Account[];
    categories: Category[];
}) {
    const isEdit = !!initialData;

    const { data, setData, post, put, processing, reset, errors } = useForm({
        nama: '', // 👈 ganti name → nama
        start_date: '',
        end_date: '',
        amount: 0,
        account_id: accounts[0]?.id || 0,
        category_id: null as number | null,
    });

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (show && initialData) {
            setData({
                nama: initialData.nama, // 👈 ganti name → nama
                start_date: initialData.start_date,
                end_date: initialData.end_date,
                amount: parseFloat(initialData.amount) || 0,
                account_id: initialData.account.id,
                category_id: initialData.category?.id ?? null,
            });
        } else if (show) {
            reset();
            setData('account_id', accounts[0]?.id || 0);
        }
    }, [initialData, show]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const action = isEdit ? put : post;
        const url = isEdit ? `/budgets/${initialData!.id}` : '/budgets';

        action(url, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const confirmDelete = () => {
        if (initialData) {
            router.delete(`/budgets/${initialData.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    setShowDeleteConfirm(false);
                    onClose();
                },
            });
        }
    };

    return (
        <>
            <Modal show={show} onClose={onClose} maxWidth="md">
                <div className="p-6 text-slate-800 dark:text-slate-100">
                    <h2 className="mb-4 text-xl font-semibold">{isEdit ? 'Edit Budget' : 'Add New Budget'}</h2>
                    <form onSubmit={submit} className="space-y-4">
                        <InputField
                            label="Nama"
                            id="nama"
                            type="text"
                            value={data.nama}
                            onChange={(e) => setData('nama', e.target.value)}
                            error={errors.nama}
                        />

                        <InputField
                            label="Start Date"
                            id="start_date"
                            type="date"
                            value={data.start_date}
                            onChange={(e) => setData('start_date', e.target.value)}
                            error={errors.start_date}
                        />

                        <InputField
                            label="End Date"
                            id="end_date"
                            type="date"
                            value={data.end_date}
                            onChange={(e) => setData('end_date', e.target.value)}
                            error={errors.end_date}
                        />

                        <InputField
                            label="Amount"
                            id="amount"
                            type="number"
                            value={data.amount}
                            onChange={(e) => setData('amount', parseFloat(e.target.value))}
                            error={errors.amount}
                        />

                        <SelectField
                            label="Account"
                            value={data.account_id}
                            onChange={(val) => setData('account_id', val ?? 0)}
                            options={accounts.map((a) => ({ id: a.id, name: a.name }))}
                            error={errors.account_id}
                        />

                        <SelectField
                            label="Category"
                            value={data.category_id ?? ''}
                            onChange={(val) => setData('category_id', val || null)}
                            options={[{ id: '', name: 'General' }, ...categories.map((c) => ({ id: c.id, name: c.name }))]}
                            error={errors.category_id}
                        />

                        <button
                            type="submit"
                            className="w-full rounded-md bg-green-600 px-4 py-2 font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                            disabled={processing}
                        >
                            {processing ? (isEdit ? 'Updating...' : 'Saving...') : isEdit ? 'Update Budget' : 'Create Budget'}
                        </button>
                    </form>

                    {isEdit && (
                        <div className="mt-4 text-right">
                            <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(true)}
                                className="text-sm text-red-600 hover:underline dark:text-red-400"
                            >
                                Delete this budget
                            </button>
                        </div>
                    )}
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} maxWidth="sm">
                <div className="p-6 text-slate-800 dark:text-slate-100">
                    <h2 className="mb-4 text-lg font-semibold text-red-600 dark:text-red-400">Delete Budget</h2>
                    <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
                        Are you sure you want to delete this budget?
                    </p>
                    <div className="mt-4 flex justify-end gap-3">
                        <button onClick={() => setShowDeleteConfirm(false)} className="text-sm text-slate-600 hover:underline dark:text-slate-300">
                            Cancel
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
