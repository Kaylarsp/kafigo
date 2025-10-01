import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import Select from 'react-select'; // Mengimpor react-select

import { InputField, SelectField } from '@/components/form-fields';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { PlusCircle } from 'lucide-react';
import { type Transaction } from './Index'; // Mengimpor interface dari file Index

// --- INTERFACES ---
interface Props {
    isOpen: boolean;
    onClose: () => void;
    transaction: Transaction | null;
    defaultType: 'income' | 'outcome' | 'transfer';
    accounts: { id: any; name: string }[];
    categories: { id: any; name: string }[];
    tags: { id: any; name: string }[];
    onCategoryAdd: () => void;
    onTagAdd: () => void;
}

// Tipe data untuk form, dengan 'tags' sebagai array angka
type FormData = {
    id?: any | null;
    title: string;
    account_id: string;
    to_account_id: string;
    category_id: string;
    tags: number[]; // Diubah untuk menampung banyak ID tag
    amount: string;
    type: 'income' | 'outcome' | 'transfer' | string;
    description: string;
    transaction_date: string;
};

export default function TransactionFormModal({
    isOpen,
    onClose,
    transaction,
    defaultType,
    accounts,
    categories,
    tags,
    onCategoryAdd,
    onTagAdd,
}: Props) {
    // Inisialisasi form state dengan 'tags' sebagai array kosong
    const { data, setData, post, put, processing, errors, reset } = useForm<FormData>({
        id: null,
        title: '',
        account_id: '',
        to_account_id: '',
        category_id: '',
        tags: [], // Nilai awal adalah array kosong
        amount: '',
        type: defaultType,
        description: '',
        transaction_date: new Date().toISOString().slice(0, 10),
    });

    // Mengisi atau mereset form saat modal dibuka/ditutup atau data berubah
    useEffect(() => {
        if (isOpen) {
            if (transaction) {
                // Mode Edit: Mengisi form dengan data transaksi yang ada
                setData({
                    id: transaction.id,
                    title: transaction.title ?? '',
                    account_id: (transaction.account_id ?? '').toString(),
                    to_account_id: (transaction.to_account_id ?? '').toString(),
                    category_id: (transaction.category_id ?? '').toString(),
                    tags: transaction.tags ?? [], // Mengisi dengan array ID, misal: [1, 5, 10]
                    amount: Number(transaction.amount || 0).toString(),
                    type: transaction.type,
                    description: transaction.description ?? '',
                    transaction_date: transaction.transaction_date?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
                });
            } else {
                // Mode Create: Mereset form ke nilai default
                reset();
                setData({
                    ...data,
                    type: defaultType,
                    account_id: accounts[0]?.id.toString() ?? '',
                    tags: [], // Pastikan reset ke array kosong
                    transaction_date: new Date().toISOString().slice(0, 10),
                });
            }
        }
    }, [isOpen, transaction, defaultType]);

    // Fungsi untuk submit form
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const url = data.id ? `/transactions/${data.id}` : '/transactions';
        const method = data.id ? put : post;
        method(url, {
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    }

    // Menyiapkan data untuk react-select
    const tagOptions = tags.map((tag) => ({
        value: tag.id,
        label: tag.name,
    }));

    const selectedTagValues = tagOptions.filter((option) => data.tags.includes(option.value));

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {data.id ? 'Edit' : 'Add'} {data.type.charAt(0).toUpperCase() + data.type.slice(1)}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="mt-2 space-y-4">
                    <InputField
                        label="Title"
                        type="text"
                        id="title"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        error={errors.title}
                    />

                    <SelectField
                        label={data.type === 'transfer' ? 'From Account' : 'Account'}
                        value={data.account_id}
                        onChange={(val) => setData('account_id', val ?? 0)}
                        options={accounts.map((acc) => ({ id: acc.id, name: acc.name }))}
                        error={errors.account_id}
                    />
                    {data.type === 'transfer' && (
                        <SelectField
                            label="To Account"
                            value={data.to_account_id}
                            onChange={(val) => setData('to_account_id', val ?? '')}
                            options={accounts.filter((acc) => acc.id.toString() !== data.account_id).map((acc) => ({ id: acc.id, name: acc.name }))}
                            error={errors.to_account_id}
                        />
                    )}

                    <InputField
                        label="Amount"
                        id="amount"
                        type="number"
                        value={data.amount}
                        onChange={(e) => setData('amount', e.target.value)}
                        placeholder="e.g., 50000"
                        error={errors.amount}
                    />
                    <InputField
                        label="Date"
                        id="transaction_date"
                        type="date"
                        value={data.transaction_date}
                        onChange={(e) => setData('transaction_date', e.target.value)}
                        error={errors.transaction_date}
                    />
                    <InputField
                        label="Description (Optional)"
                        id="description"
                        type="text"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                    />

                    <div className="flex items-end gap-2">
                        <div className="flex-grow">
                            <SelectField
                                label="Category (Optional)"
                                value={data.category_id}
                                onChange={(val) => setData('category_id', val ?? 0)}
                                options={categories.map((cat) => ({ id: cat.id, name: cat.name }))}
                                error={errors.category_id}
                            />
                        </div>
                        <Button type="button" variant="outline" size="icon" onClick={onCategoryAdd}>
                            <PlusCircle className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Multiple Select untuk Tags */}
                    <div className="flex items-end gap-2">
                        <div className="flex-grow space-y-1">
                            <Label htmlFor="tags">Tags (Optional)</Label>
                            <Select
                                id="tags"
                                isMulti
                                options={tagOptions}
                                value={selectedTagValues}
                                onChange={(selectedOptions) => {
                                    const selectedIds = selectedOptions.map((option) => option.value);
                                    setData('tags', selectedIds);
                                }}

                                classNames={{
                                    control: () =>
                                        'flex !min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800',
                                    input: () => 'text-foreground dark:text-slate-200',
                                    placeholder: () => 'text-muted-foreground',
                                    valueContainer: () => 'gap-1',
                                    multiValue: () =>
                                        'bg-secondary text-secondary-foreground rounded-sm px-1.5 py-0.5 dark:bg-slate-700 dark:text-slate-200',
                                    multiValueLabel: () => 'text-sm',
                                    multiValueRemove: () => 'hover:bg-destructive hover:text-destructive-foreground',
                                    menu: () => 'bg-background border rounded-md shadow-md mt-1 dark:bg-slate-900 dark:border-slate-700',
                                    option: ({ isFocused }) => (isFocused ? 'bg-secondary dark:bg-slate-700' : 'bg-transparent'),
                                    noOptionsMessage: () => 'text-muted-foreground p-2',
                                }}
                            />
                            {errors.tags && (
                                <p className="mt-1 text-xs text-red-500">{Array.isArray(errors.tags) ? errors.tags.join(', ') : errors.tags}</p>
                            )}
                        </div>
                        <Button type="button" variant="outline" size="icon" onClick={onTagAdd}>
                            <PlusCircle className="h-4 w-4" />
                        </Button>
                    </div>

                    <DialogFooter className="mt-4 flex gap-2">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : data.id ? 'Update' : 'Create'}
                        </Button>
                        <Button type="button" variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
