'use client'
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sheet } from 'react-modal-sheet';
import { Plus, Edit, Trash2, GripVertical, X } from 'lucide-react';
import { toast } from 'sonner';
import { useModifierGroups } from '../actions/hook/useModifiersGroups';
import { createModifierGroup } from '../actions/order-actions/create-modifier-group';
// Database Schema Types
interface ModifierGroup {
    id: number;
    name: string;
    desc: string;
    modifiers: Modifier[];
    created_at?: string;
    updated_at?: string;
}

interface Modifier {
    id: number;
    modifier_group_id: number;
    name: string;
    price_adjustment: number;
    created_at?: string;
    updated_at?: string;
}

interface ProductModifier {
    product_id: number;
    modifier_group_id: number;
    modifiers: Modifier[];
}

// Zod Schema for Form Validation
const modifierGroupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
    modifiers: z.array(z.object({
        name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
        desc: z.string().max(50, 'Description must be less than 50 characters'),
        price_adjustment: z.number().min(0, 'Price adjustment must be greater than 0'),
    })).min(1, 'At least one modifier is required'),
});

type ModifierGroupFormData = z.infer<typeof modifierGroupSchema>;

export default function ModifierGroupsBottomSheet({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
    const { data: modifierGroups, isLoading, error, refetch } = useModifierGroups();
    const form = useForm<ModifierGroupFormData>({
        resolver: zodResolver(modifierGroupSchema),
        defaultValues: {
            name: '',
            modifiers: [],
        },
    });

    const onSubmit = async (data: ModifierGroupFormData) => {
        const result = await createModifierGroup(data);
        if (result instanceof Error) {
            toast.error('Error creating modifier group', { description: result.message });
        } else {
            toast.success('Modifier group created successfully');
            form.reset();
            refetch();
        }
    };

    const handleDelete = (id: number) => {
        toast.success('Modifier group deleted');
    };

    const handleEdit = (id: number) => {
        // Placeholder for edit functionality
        toast.info('Edit functionality coming soon');
    };

    if (isLoading) {
        return <div>Loading...</div>
    }
    if (error) {
        return <div>Error: {error.message}</div>
    }

    return (
        <>
            {/* Trigger Button */}
            <Button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2"
            >
                <Plus className="h-4 w-4" />
                Manage Modifier Groups
            </Button>

            {/* Bottom Sheet */}
            <Sheet
                isOpen={open}
                onClose={() => setOpen(false)}
                snapPoints={[0, 0.5, 0.75, 1]}
                initialSnap={3}

            >
                <Sheet.Container>
                    <Sheet.Header>
                        {/* Drag Handle */}
                        <div className="flex justify-center p-2">
                            <div className="w-12 h-1 bg-muted rounded-full" />
                        </div>

                        {/* Header */}
                        <div className="px-6 pb-4">
                            <h2 className="text-xl font-semibold text-foreground">Modifier Groups</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Create and manage modifier groups for your products
                            </p>
                        </div>
                    </Sheet.Header>

                    <Sheet.Content>
                        <div className="h-full flex flex-col">
                            {/* Create New Group Form */}
                            <div className="px-6 pb-6 border-b border-border">
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    {/* Group Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Group Name</Label>
                                        <Input
                                            id="name"
                                            {...form.register('name')}
                                            placeholder="e.g., Size, Color, Material"
                                            className="w-full"
                                        />
                                        {form.formState.errors.name && (
                                            <p className="text-sm text-destructive">
                                                {form.formState.errors.name.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Modifiers Section */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-base font-medium">Modifiers</Label>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    const currentModifiers = form.getValues('modifiers');
                                                    form.setValue('modifiers', [
                                                        ...currentModifiers,
                                                        { name: '', desc: '', price_adjustment: 0 }
                                                    ]);
                                                }}
                                                className="flex items-center gap-2"
                                            >
                                                <Plus className="h-4 w-4" />
                                                Add Option
                                            </Button>
                                        </div>

                                        {/* Modifiers List */}
                                        <div className="space-y-3">
                                            {form.watch('modifiers').map((modifier, index) => (
                                                <div key={index} className="border border-border rounded-lg p-4 space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="font-medium text-sm">Option {index + 1}</h4>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                const currentModifiers = form.getValues('modifiers');
                                                                form.setValue('modifiers', currentModifiers.filter((_, i) => i !== index));
                                                            }}
                                                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </Button>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                        <div className="space-y-1">
                                                            <Label htmlFor={`modifiers.${index}.name`}>Name</Label>
                                                            <Input
                                                                {...form.register(`modifiers.${index}.name`)}
                                                                placeholder="e.g., Small, Red, Cotton"
                                                                className="w-full"
                                                            />
                                                            {form.formState.errors.modifiers?.[index]?.name && (
                                                                <p className="text-xs text-destructive">
                                                                    {form.formState.errors.modifiers[index]?.name?.message}
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="space-y-1">
                                                            <Label htmlFor={`modifiers.${index}.desc`}>Description</Label>
                                                            <Input
                                                                {...form.register(`modifiers.${index}.desc`)}
                                                                placeholder="Brief description"
                                                                className="w-full"
                                                            />
                                                            {form.formState.errors.modifiers?.[index]?.desc && (
                                                                <p className="text-xs text-destructive">
                                                                    {form.formState.errors.modifiers[index]?.desc?.message}
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="space-y-1">
                                                            <Label htmlFor={`modifiers.${index}.price_adjustment`}>Price Adjustment ($)</Label>
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                min="0"
                                                                {...form.register(`modifiers.${index}.price_adjustment`, { valueAsNumber: true })}
                                                                placeholder="0.00"
                                                                className="w-full"
                                                            />
                                                            {form.formState.errors.modifiers?.[index]?.price_adjustment && (
                                                                <p className="text-xs text-destructive">
                                                                    {form.formState.errors.modifiers[index]?.price_adjustment?.message}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Empty State for Modifiers */}
                                        {form.watch('modifiers').length === 0 && (
                                            <div className="text-center py-6 text-muted-foreground border border-dashed border-border rounded-lg">
                                                <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                                <p className="text-sm">No modifiers added yet</p>
                                                <p className="text-xs">Click "Add Option" to create modifiers for this group</p>
                                            </div>
                                        )}

                                        {/* Modifiers Validation Error */}
                                        {form.formState.errors.modifiers && (
                                            <p className="text-sm text-destructive">
                                                {form.formState.errors.modifiers.message}
                                            </p>
                                        )}
                                    </div>

                                    <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                                        {form.formState.isSubmitting ? (
                                            <>
                                                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                Creating Group...
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Create Group
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </div>

                            {/* Existing Groups List */}
                            <div className="flex-1 overflow-hidden">
                                <div className="px-6 py-4">
                                    <h3 className="text-lg font-medium text-foreground mb-4">
                                        Existing Groups ({modifierGroups?.length})
                                    </h3>
                                </div>

                                <div className="flex-1 overflow-y-auto px-6 pb-6">
                                    {modifierGroups?.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <GripVertical className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                            <p>No modifier groups yet</p>
                                            <p className="text-sm">Create your first group above</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {modifierGroups?.map((group) => (
                                                <div
                                                    key={group.id}
                                                    className="flex items-center justify-between p-4 border border-border rounded-lg bg-card hover:bg-muted/50 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                                                        <div>
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
                                                                    group.modifiers.map((modifier: Modifier) => (
                                                                        <div key={modifier.id} className='flex items-center gap-2 flex-row w-full'>
                                                                            <p className="text-xs text-muted-foreground"> • {modifier.name}
                                                                            </p>
                                                                            <p className={`text-xs ${modifier.price_adjustment > 0 ? 'text-green-500' : 'text-gray-500'}`}>${modifier.price_adjustment}</p>
                                                                        </div>
                                                                    ))
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEdit(group.id)}
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDelete(group.id)}
                                                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop onClick={() => setOpen(false)} />
            </Sheet>
        </>
    );
}