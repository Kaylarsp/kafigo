// pages/Transactions/TagFormModal.tsx

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

export default function TagFormModal({ isOpen, onClose }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({ name: '' });

    const submitTag = (e: React.FormEvent) => {
        e.preventDefault();
        post('/tags', {
            preserveScroll: true,
            onSuccess: () => {
                onClose(); // Tutup modal setelah berhasil
                reset(); // Reset form
                router.reload({ only: ['tags'] }); // Muat ulang hanya data tag
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Tag</DialogTitle>
                </DialogHeader>
                <form onSubmit={submitTag} className="mt-2 space-y-4">
                    <div>
                        <Label htmlFor="new_tag_name">Tag Name</Label>
                        <Input
                            id="new_tag_name"
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
                            {processing ? 'Saving...' : 'Save Tag'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
