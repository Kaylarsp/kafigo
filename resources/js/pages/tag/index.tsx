import { InputField } from '@/components/form-fields';
import Modal from '@/components/ui/modal';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Tags } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

interface Tag {
    id: number;
    name: string;
    user_id: number;
}

interface PageProps {
    tags: Tag[];
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Tags', href: '/tags' }];

export default function TagsPage({ tags }: PageProps) {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<Tag | null>(null);

    const sortedTags = [...tags].sort((a, b) => a.name.localeCompare(b.name));

    const fetchTag = async (id: number) => {
        try {
            const response = await fetch(`/tags/${id}/edit`);
            const result = await response.json();
            setFormData(result.data);
            setShowForm(true);
        } catch (err) {
            console.error('Failed to fetch tag', err);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tags" />
            <div className="min-h-screen bg-black text-white">
                <div className="p-6">
                    <div className="mb-6 flex items-center gap-4">
                        <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 p-3 shadow-lg">
                            <Tags className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Tags</h1>
                            <p className="text-slate-400">Manage your tags</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {sortedTags.map((tag) => (
                            <button
                                key={tag.id}
                                onClick={() => fetchTag(tag.id)}
                                className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:scale-105"
                            >
                                <div className="rounded-full bg-white/20 p-1">
                                    #
                                </div>
                                {tag.name}
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

            <TagFormModal
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

function TagFormModal({
    initialData,
    show,
    onClose,
}: {
    initialData?: Tag;
    show: boolean;
    onClose: () => void;
}) {
    const isEdit = !!initialData;

    const { data, setData, post, put, processing, reset, errors } = useForm({
        name: '',
    });

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteInput, setDeleteInput] = useState('');

    useEffect(() => {
        if (initialData) {
            setData({ name: initialData.name });
        } else {
            reset();
        }
    }, [initialData]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const action = isEdit ? put : post;
        const url = isEdit ? `/tags/${initialData!.id}` : '/tags';

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
            router.delete(`/tags/${initialData.id}`, {
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
            <Modal show={show} onClose={onClose} maxWidth="sm">
                <div className="p-6 text-slate-800 dark:text-slate-100">
                    <h2 className="mb-4 text-xl font-semibold">{isEdit ? 'Edit Tag' : 'Add New Tag'}</h2>
                    <form onSubmit={submit} className="space-y-4">
                        <InputField
                            label="Tag Name"
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            error={errors.name}
                        />

                        <button
                            type="submit"
                            className="w-full rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                            disabled={processing}
                        >
                            {processing ? (isEdit ? 'Updating...' : 'Saving...') : isEdit ? 'Update Tag' : 'Create Tag'}
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
                                Delete this tag
                            </button>
                        </div>
                    )}
                </div>
            </Modal>

            <Modal show={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} maxWidth="sm">
                <div className="p-6 text-slate-800 dark:text-slate-100">
                    <h2 className="mb-4 text-lg font-semibold text-red-600 dark:text-red-400">Delete Tag</h2>
                    <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
                        Type <span className="font-bold">{initialData?.name}</span> to confirm deletion.
                    </p>
                    <input
                        type="text"
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        value={deleteInput}
                        onChange={(e) => setDeleteInput(e.target.value)}
                        placeholder="Enter tag name"
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
