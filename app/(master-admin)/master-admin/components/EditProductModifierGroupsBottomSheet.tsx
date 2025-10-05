'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sheet } from 'react-modal-sheet';
import { Plus, Edit, Trash2, GripVertical, X, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useModifierGroups } from '../actions/hook/useModifiersGroups';
import { createModifierGroup, Modifier } from '../actions/order-actions/create-modifier-group';
import { Product } from '@/lib/types';

const modifierGroupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
    modifiers: z.array(z.object({
        name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
        desc: z.string().max(50, 'Description must be less than 50 characters'),
        price_adjustment: z.number().min(0, 'Price adjustment must be greater than 0'),
    })).min(1, 'At least one modifier is required'),
});

type ModifierGroupFormData = z.infer<typeof modifierGroupSchema>;

export default function EditProductModifierGroupsBottomSheet({
    open,
    setOpen,
    product,
    selectedModifierGroupIds = [],
    onSelectionChange
}: {
    open: boolean,
    setOpen: (open: boolean) => void,
    product: Product,
    selectedModifierGroupIds?: number[],
    onSelectionChange?: (selectedIds: number[]) => void
}) {
    const { data: modifierGroups } = useModifierGroups();
    const [selectedIds, setSelectedIds] = useState<number[]>(selectedModifierGroupIds);

    // Update local state when prop changes
    useEffect(() => {
        setSelectedIds(selectedModifierGroupIds);
    }, [selectedModifierGroupIds]);

    const handleToggleSelection = (groupId: number) => {
        const newSelection = selectedIds.includes(groupId)
            ? selectedIds.filter(id => id !== groupId)
            : [...selectedIds, groupId];

        setSelectedIds(newSelection);
        onSelectionChange?.(newSelection);
    };

    const handleSave = () => {
        onSelectionChange?.(selectedIds);
        setOpen(false);
        toast.success(`Selected ${selectedIds.length} modifier group${selectedIds.length !== 1 ? 's' : ''}`);
    };

    return (
        <Sheet isOpen={open} onClose={() => setOpen(false)}>
            <Sheet.Container>
                <Sheet.Header>
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                        <div>
                            <h2 className="text-xl font-semibold text-foreground">Select Modifier Groups</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Choose modifier groups for {product.name}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                                {selectedIds.length} selected
                            </span>
                        </div>
                    </div>
                </Sheet.Header>
                <Sheet.Content className=' flex-1 overflow-y-auto'>
                    <div className="flex-1 overflow-y-auto px-6 pb-6 mt-6">
                        {modifierGroups?.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <GripVertical className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No modifier groups available</p>
                                <p className="text-sm">Create modifier groups first</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {modifierGroups?.map((group) => {
                                    const isSelected = selectedIds.includes(group.id);
                                    return (
                                        <div
                                            key={group.id}
                                            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${isSelected
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border bg-card hover:bg-muted/50'
                                                }`}
                                            onClick={() => handleToggleSelection(group.id)}
                                        >
                                            <div className="flex items-center gap-3 flex-1">
                                                {/* Selection Indicator */}
                                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${isSelected
                                                    ? 'border-primary bg-primary text-primary-foreground'
                                                    : 'border-muted-foreground'
                                                    }`}>
                                                    {isSelected && <Check className="h-3 w-3" />}
                                                </div>

                                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-foreground flex items-center gap-2 flex-row">
                                                        {group.name}
                                                        <p className="text-sm text-muted-foreground">
                                                            {
                                                                group.modifiers.length > 0 ? `(${group.modifiers.length} variants)` : 'No variants'
                                                            }
                                                        </p>
                                                    </h4>

                                                    <div className='flex flex-col gap-2 mt-1'>
                                                        {
                                                            group.modifiers.map((modifier: Modifier, index: number) => (
                                                                <div key={index} className='flex items-center gap-2 flex-row w-full'>
                                                                    <p className="text-xs text-muted-foreground"> • {modifier.name}</p>
                                                                    <p className={`text-xs ${modifier.price_adjustment > 0 ? 'text-green-500' : 'text-gray-500'}`}>
                                                                        ${modifier.price_adjustment}
                                                                    </p>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-background">
                        <div className="text-sm text-muted-foreground">
                            {selectedIds.length} modifier group{selectedIds.length !== 1 ? 's' : ''} selected
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={selectedIds.length === 0}
                            >
                                Save Selection
                            </Button>
                        </div>
                    </div>
                </Sheet.Content>
            </Sheet.Container>
            <Sheet.Backdrop onClick={() => setOpen(false)} />
        </Sheet>
    )
}