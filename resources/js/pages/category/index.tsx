import { InputField } from '@/components/form-fields';
import { InputFieldColor } from '@/components/input-field-color';
import Modal from '@/components/ui/modal';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Tags } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

interface Category {
    id: number;
    name: string;
    color: string;
    order: number;
    user_id: number;
}

interface PageProps {
    categories: Category[];
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Categories', href: '/categories' }];

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

export default function Categories({ categories }: PageProps) {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<Category | null>(null);

    const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

    const fetchCategory = async (id: number) => {
        try {
            const response = await fetch(`/categories/${id}/edit`);
            const result = await response.json();
            setFormData(result.data);
            setShowForm(true);
        } catch (err) {
            console.error('Failed to fetch category', err);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                <div className="flex-1 p-4 sm:p-6 lg:p-8">
                    <div className="mb-6 flex items-center gap-4">
                        <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 p-3 shadow-lg">
                            <Tags className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
                                Categories
                            </h1>
                            <p className="mt-1 text-slate-600 dark:text-slate-400">Manage your categories</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {sortedCategories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => fetchCategory(category.id)}
                                className={`flex items-center gap-2 rounded-full border border-white/20 bg-gradient-to-r px-4 py-2 text-sm font-medium text-white transition hover:scale-105 ${category.color}`}
                            >
                                <div className="rounded-full bg-white/20 p-1">
                                    <Tags className="h-4 w-4 text-white" />
                                </div>
                                {category.name}
                            </button>
                        ))}

                        <button
                            onClick={() => {
                                setFormData(null);
                                setShowForm(true);
                            }}
                            className="flex items-center gap-2 rounded-full border border-white px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                        >
                            <Plus className="h-4 w-4" />
                            Add new
                        </button>
                    </div>
                </div>
            </div>

            <CategoryFormModal
                show={showForm}
                initialData={formData ?? undefined}
                onClose={() => {
                    setShowForm(false);
                    setFormData(null);
                }}
            />
        </AppLayout>
    );
}

function CategoryFormModal({ initialData, show, onClose }: { initialData?: Category; show: boolean; onClose: () => void }) {
    const isEdit = !!initialData;

    const { data, setData, post, put, processing, reset, errors } = useForm({
        name: '',
        color: '',
    });

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteInput, setDeleteInput] = useState('');

    useEffect(() => {
        if (initialData) {
            setData({
                name: initialData.name,
                color: initialData.color,
            });
        } else {
            reset();
        }
    }, [initialData]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const action = isEdit ? put : post;
        const url = isEdit ? `/categories/${initialData!.id}` : '/categories';

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
            router.delete(`/categories/${initialData.id}`, {
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
                    <h2 className="mb-4 text-xl font-semibold">{isEdit ? 'Edit Category' : 'Add New Category'}</h2>
                    <form onSubmit={submit} className="space-y-4">
                        <InputField
                            label="Name"
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            error={errors.name}
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
                            {processing ? (isEdit ? 'Updating...' : 'Saving...') : isEdit ? 'Update Category' : 'Create Category'}
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
                                Delete this category
                            </button>
                        </div>
                    )}
                </div>
            </Modal>

            <Modal show={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} maxWidth="sm">
                <div className="p-6 text-slate-800 dark:text-slate-100">
                    <h2 className="mb-4 text-lg font-semibold text-red-600 dark:text-red-400">Delete Category</h2>
                    <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
                        Type <span className="font-bold">{initialData?.name}</span> to confirm deletion.
                    </p>
                    <input
                        type="text"
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        value={deleteInput}
                        onChange={(e) => setDeleteInput(e.target.value)}
                        placeholder="Enter category name"
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
