// pages/Transactions/CategoryFormModal.tsx

import { router, useForm } from '@inertiajs/react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function CategoryFormModal({ isOpen, onClose }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({ name: '' });

    const submitCategory = (e: React.FormEvent) => {
        e.preventDefault();
        post('/categories', {
            preserveScroll: true,
            onSuccess: () => {
                onClose(); // Tutup modal setelah berhasil
                reset(); // Reset form
                router.reload({ only: ['categories'] }); // Muat ulang hanya data kategori
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                </DialogHeader>
                <form onSubmit={submitCategory} className="mt-2 space-y-4">
                    <div>
                        <Label htmlFor="new_category_name">Category Name</Label>
                        <Input
                            id="new_category_name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            autoFocus
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Category'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
