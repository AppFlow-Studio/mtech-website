'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sheet } from 'react-modal-sheet';
import { Plus, Edit, Trash2, GripVertical, X, Check, Search } from 'lucide-react';
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
    const { data: modifierGroups, refetch } = useModifierGroups();
    const [selectedIds, setSelectedIds] = useState<number[]>(selectedModifierGroupIds);
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Create group form
    const createForm = useForm<ModifierGroupFormData>({
        resolver: zodResolver(modifierGroupSchema),
        defaultValues: { name: '', modifiers: [] },
    });

    // Update local state when prop changes
    useEffect(() => {
        setSelectedIds(selectedModifierGroupIds);
    }, [selectedModifierGroupIds]);

    console.log(selectedModifierGroupIds);
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

    const onCreateSubmit = async (data: ModifierGroupFormData) => {
        const result = await createModifierGroup(data, product.id);
        if (result instanceof Error) {
            toast.error('Error creating modifier group', { description: result.message });
            return;
        }
        // result should contain the new group's id
        const newId = (result as any)?.id;
        toast.success('Modifier group created successfully');
        createForm.reset();
        await refetch?.();
        if (newId) {
            const next = selectedIds.includes(newId) ? selectedIds : [...selectedIds, newId];
            setSelectedIds(next);
            onSelectionChange?.(next);
        }
    };

    // Filter modifier groups based on search query
    const filteredModifierGroups = modifierGroups?.filter(group =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.modifiers.some((modifier: Modifier) =>
            modifier.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    ) || [];

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

                        <div className="flex items-center gap-2 flex-row" >
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                    {selectedIds.length} selected
                                </span>
                            </div>
                            <Button variant="outline" onClick={() => setOpen(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </Sheet.Header>
                <Sheet.Content className=''>
                    <div
                        style={{
                            display: 'flex',
                            width: '100%',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingTop: '0px',
                            gap: '16px',
                        }}
                        className='flex-1 overflow-y-auto border'
                    >
                        <div className="flex-1 w-full overflow-y-auto max-h-[500px] px-6 pb-6 mt-6">
                            {/* Search Bar */}
                            <div className="mb-4">
                                <div className="relative py-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search modifier groups..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {modifierGroups?.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <GripVertical className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No modifier groups available</p>
                                    <p className="text-sm">Create modifier groups first</p>
                                </div>
                            ) : filteredModifierGroups.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No modifier groups found</p>
                                    <p className="text-sm">Try adjusting your search terms</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {filteredModifierGroups.map((group) => {
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
                        <div className="flex w-full items-center justify-between px-6 py-2 border-t border-border bg-background">
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

                        {/* Create New Group (inline) */}
                        <div className="w-full px-6 pb-4">
                            <div className="pt-6 border-t border-border">
                                <h3 className="text-lg font-semibold text-foreground mb-1">Create New Group</h3>
                                <p className="text-sm text-muted-foreground mb-4">Quickly add a new modifier group and assign it to this product.</p>
                                <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-6">
                                    {/* Group Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="cg_name">Group Name</Label>
                                        <Input
                                            id="cg_name"
                                            {...createForm.register('name')}
                                            placeholder="e.g., Size, Color, Material"
                                            className="w-full"
                                        />
                                        {createForm.formState.errors.name && (
                                            <p className="text-sm text-destructive">
                                                {createForm.formState.errors.name.message}
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
                                                    const current = createForm.getValues('modifiers');
                                                    createForm.setValue('modifiers', [
                                                        ...current,
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
                                            {createForm.watch('modifiers').map((modifier, index) => (
                                                <div key={index} className="border border-border rounded-lg p-4 space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="font-medium text-sm">Option {index + 1}</h4>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                const current = createForm.getValues('modifiers');
                                                                createForm.setValue('modifiers', current.filter((_, i) => i !== index));
                                                            }}
                                                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </Button>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                        <div className="space-y-1">
                                                            <Label htmlFor={`cg_modifiers.${index}.name`}>Name</Label>
                                                            <Input
                                                                {...createForm.register(`modifiers.${index}.name` as const)}
                                                                placeholder="e.g., Small, Red, Cotton"
                                                                className="w-full"
                                                            />
                                                            {createForm.formState.errors.modifiers?.[index]?.name && (
                                                                <p className="text-xs text-destructive">
                                                                    {createForm.formState.errors.modifiers[index]?.name?.message}
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="space-y-1">
                                                            <Label htmlFor={`cg_modifiers.${index}.desc`}>Description</Label>
                                                            <Input
                                                                {...createForm.register(`modifiers.${index}.desc` as const)}
                                                                placeholder="Brief description"
                                                                className="w-full"
                                                            />
                                                            {createForm.formState.errors.modifiers?.[index]?.desc && (
                                                                <p className="text-xs text-destructive">
                                                                    {createForm.formState.errors.modifiers[index]?.desc?.message}
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="space-y-1">
                                                            <Label htmlFor={`cg_modifiers.${index}.price_adjustment`}>Price Adjustment ($)</Label>
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                min="0"
                                                                {...createForm.register(`modifiers.${index}.price_adjustment` as const, { valueAsNumber: true })}
                                                                placeholder="0.00"
                                                                className="w-full"
                                                            />
                                                            {createForm.formState.errors.modifiers?.[index]?.price_adjustment && (
                                                                <p className="text-xs text-destructive">
                                                                    {createForm.formState.errors.modifiers[index]?.price_adjustment?.message}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Empty State for Modifiers */}
                                        {createForm.watch('modifiers').length === 0 && (
                                            <div className="text-center py-6 text-muted-foreground border border-dashed border-border rounded-lg">
                                                <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                                <p className="text-sm">No modifiers added yet</p>
                                                <p className="text-xs">Click "Add Option" to create modifiers for this group</p>
                                            </div>
                                        )}

                                        {/* Modifiers Validation Error */}
                                        {createForm.formState.errors.modifiers && (
                                            <p className="text-sm text-destructive">
                                                {createForm.formState.errors.modifiers.message}
                                            </p>
                                        )}
                                    </div>

                                    <Button type="submit" className="w-full" disabled={createForm.formState.isSubmitting}>
                                        {createForm.formState.isSubmitting ? (
                                            <>
                                                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                Creating Group...
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Create & Assign Group
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </Sheet.Content>
            </Sheet.Container>
            <Sheet.Backdrop onClick={() => setOpen(false)} />
        </Sheet>
    )
}