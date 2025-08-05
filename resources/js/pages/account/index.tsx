import { InputField, SelectField } from '@/components/form-fields';
import { InputFieldColor } from '@/components/input-field-color';
import { InputFieldCurrency } from '@/components/input-field-currency';
import { Card, CardContent } from '@/components/ui/card';
import Modal from '@/components/ui/modal';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Building2, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

interface Account {
    id: number;
    name: string;
    balance: number;
    color: string | null;
    order: number;
    currency_id: number;
    user_id: number;
}

interface Currency {
    id: number;
    code: string;
    name: string;
}

interface PageProps {
    accounts: Account[];
    currencies: Currency[];
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Accounts', href: '/accounts' }];

const colors = [
    'from-blue-500 to-indigo-500',
    'from-green-500 to-emerald-500',
    'from-purple-500 to-fuchsia-500',
    'from-orange-500 to-amber-500',
    'from-pink-500 to-rose-500',
    'from-red-500 to-rose-600',
    'from-teal-500 to-cyan-500',
    'from-yellow-400 to-orange-500',
    'from-lime-400 to-green-600',
    'from-sky-500 to-blue-600',
    'from-indigo-500 to-violet-600',
    'from-slate-500 to-slate-700',
    'from-zinc-500 to-neutral-600',
    'from-fuchsia-500 to-pink-600',
];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const formatCurrency = (val: number, currencyCode = 'IDR') => `${val.toLocaleString('id-ID', { minimumFractionDigits: 2 })} ${currencyCode}`;

export default function Accounts({ accounts, currencies }: PageProps) {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<Account | null>(null);

    const sortedAccounts = [...accounts].sort((a, b) => a.order - b.order);

    const handleReorder = (id: number, direction: 'up' | 'down') => {
        router.post('/accounts/reorder', { id, direction }, { preserveScroll: true, preserveState: true });
    };

    const fetchAccount = async (id: number) => {
        try {
            const response = await fetch(`/accounts/${id}/edit`);
            const result = await response.json();
            setFormData(result.data);
            setShowForm(true);
        } catch (err) {
            console.error('Failed to fetch account', err);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Accounts" />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                <div className="flex-1 p-4 sm:p-6 lg:p-8">
                    <div className="mb-12 flex flex-col items-start justify-between sm:flex-row sm:items-center">
                        <div className="mb-4 flex items-center gap-4 sm:mb-0">
                            <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 p-3 shadow-lg">
                                <Building2 className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
                                    Accounts
                                </h1>
                                <p className="mt-1 text-slate-600 dark:text-slate-400">Manage your financial accounts</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {sortedAccounts.map((account, index) => {
                            const currency = currencies.find((c) => c.id === account.currency_id);
                            const currencyCode = currency?.code || 'IDR';

                            return (
                                <Card
                                    key={account.id}
                                    className={`relative border-0 bg-gradient-to-br shadow-lg ${account.color ?? getRandomColor()} rounded-2xl text-white transition-all duration-300 hover:scale-[1.01] hover:shadow-xl`}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                            <div>
                                                <h3 className="mb-2 text-xl font-bold">{account.name}</h3>
                                                <div className="text-3xl font-bold text-slate-800 dark:text-white">
                                                    {formatCurrency(account.balance, currencyCode)}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 self-start sm:self-center">
                                                <button
                                                    onClick={() => fetchAccount(account.id)}
                                                    className="rounded-md bg-white/20 px-3 py-1 text-sm font-semibold hover:bg-white/30"
                                                >
                                                    Edit
                                                </button>

                                                {index > 0 && (
                                                    <button
                                                        onClick={() => handleReorder(account.id, 'up')}
                                                        className="rounded-md bg-white/20 px-3 py-1 hover:bg-white/30"
                                                    >
                                                        <ChevronUp className="h-5 w-5" />
                                                    </button>
                                                )}
                                                {index < sortedAccounts.length - 1 && (
                                                    <button
                                                        onClick={() => handleReorder(account.id, 'down')}
                                                        className="rounded-md bg-white/20 px-3 py-1 hover:bg-white/30"
                                                    >
                                                        <ChevronDown className="h-5 w-5" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    <div className="mt-12 flex justify-center">
                        <button
                            onClick={() => {
                                setFormData(null);
                                setShowForm(true);
                            }}
                            className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 font-bold text-white shadow-xl hover:scale-105 hover:from-blue-700 hover:to-purple-700"
                        >
                            <div className="relative flex items-center gap-3">
                                <div className="rounded-lg bg-white/20 p-2">
                                    <Plus className="h-6 w-6" />
                                </div>
                                <span className="text-lg">Add New Account</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <AccountFormModal
                show={showForm}
                initialData={formData ?? undefined}
                currencies={currencies}
                onClose={() => {
                    setShowForm(false);
                    setFormData(null);
                }}
            />
        </AppLayout>
    );
}
function AccountFormModal({
    initialData,
    show,
    onClose,
    currencies,
}: {
    initialData?: Account;
    show: boolean;
    onClose: () => void;
    currencies: Currency[];
}) {
    const isEdit = !!initialData;

    const { data, setData, post, put, processing, reset, errors } = useForm({
        name: '',
        balance: 0,
        currency_id: 1,
        color: '',
    });

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteInput, setDeleteInput] = useState('');

    useEffect(() => {
        if (initialData) {
            setData({
                name: initialData.name,
                balance: initialData.balance,
                currency_id: initialData.currency_id,
                color: initialData.color ?? '',
            });
        } else {
            reset();
        }
    }, [initialData]);

    const selectedCurrency = currencies.find((c) => c.id === data.currency_id);
    const currencyCode = selectedCurrency?.code || 'IDR';

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const action = isEdit ? put : post;
        const url = isEdit ? `/accounts/${initialData!.id}` : '/accounts';

        action(url, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const confirmDelete = () => {
        if (deleteInput === initialData?.name) {
            router.delete(`/accounts/${initialData.id}`, {
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
                    <h2 className="mb-4 text-xl font-semibold">{isEdit ? 'Edit Account' : 'Add New Account'}</h2>
                    <form onSubmit={submit} className="space-y-4">
                        <InputField
                            label="Name"
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            error={errors.name}
                        />

                        <SelectField
                            label="Currency"
                            value={data.currency_id}
                            onChange={(val) => setData('currency_id', val ?? 0)}
                            options={currencies.map((c) => ({ id: c.id, name: `${c.code} - ${c.name}` }))}
                            error={errors.currency_id}
                        />

                        <InputFieldCurrency
                            label="Initial Balance"
                            id="balance"
                            value={data.balance}
                            currencyCode={currencyCode}
                            onChange={(val) => setData('balance', val)}
                            error={errors.balance}
                        />

                        <InputFieldColor
                            id="color"
                            label="Color"
                            colors={colors}
                            value={data.color}
                            onChange={(val) => setData('color', val)}
                            error={errors.color}
                        />

                        <button
                            type="submit"
                            className="w-full rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                            disabled={processing}
                        >
                            {processing ? (isEdit ? 'Updating...' : 'Saving...') : isEdit ? 'Update Account' : 'Create Account'}
                        </button>
                    </form>

                    {isEdit && (
                        <div className="mt-4 text-right">
                            <button
                                type="button"
                                onClick={() => {
                                    setDeleteInput('');
                                    setShowDeleteConfirm(true);
                                }}
                                className="text-sm text-red-600 hover:underline dark:text-red-400"
                            >
                                Delete this account
                            </button>
                        </div>
                    )}
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} maxWidth="sm">
                <div className="p-6 text-slate-800 dark:text-slate-100">
                    <h2 className="mb-4 text-lg font-semibold text-red-600 dark:text-red-400">Delete Account</h2>
                    <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
                        Type <span className="font-bold">{initialData?.name}</span> to confirm deletion.
                    </p>
                    <input
                        type="text"
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        value={deleteInput}
                        onChange={(e) => setDeleteInput(e.target.value)}
                        placeholder="Enter account name"
                    />
                    <div className="mt-4 flex justify-end gap-3">
                        <button onClick={() => setShowDeleteConfirm(false)} className="text-sm text-slate-600 hover:underline dark:text-slate-300">
                            Cancel
                        </button>
                        <button
                            onClick={confirmDelete}
                            disabled={deleteInput !== initialData?.name}
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
