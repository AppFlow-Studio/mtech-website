'use client'

import { useEffect, useState } from 'react';
import { Sheet } from 'react-modal-sheet';
import { Button } from '@/components/ui/button';
import { GripVertical, Check } from 'lucide-react';
import { useModifierGroups } from '../actions/hook/useModifiersGroups';

export default function AddProductModiferGroupBottomSheet({
    open,
    setOpen,
    selectedModifierGroupIds = [],
    onSelectionChange,
}: {
    open: boolean,
    setOpen: (open: boolean) => void,
    selectedModifierGroupIds?: number[],
    onSelectionChange?: (ids: number[]) => void,
}) {
    const { data: modifierGroups } = useModifierGroups();
    const [selectedIds, setSelectedIds] = useState<number[]>(selectedModifierGroupIds);

    useEffect(() => {
        setSelectedIds(selectedModifierGroupIds || []);
    }, [selectedModifierGroupIds]);

    const toggle = (groupId: number) => {
        const next = selectedIds.includes(groupId)
            ? selectedIds.filter(id => id !== groupId)
            : [...selectedIds, groupId];
        setSelectedIds(next);
        onSelectionChange?.(next);
    };

    const handleSave = () => {
        onSelectionChange?.(selectedIds);
        setOpen(false);
    };

    return (
        <Sheet isOpen={open} onClose={() => setOpen(false)}>
            <Sheet.Container>
                <Sheet.Header>
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                        <div>
                            <h2 className="text-xl font-semibold text-foreground">Select Modifier Groups</h2>
                            <p className="text-sm text-muted-foreground mt-1">Choose modifier groups for this product</p>
                        </div>
                        <span className="text-sm text-muted-foreground">{selectedIds.length} selected</span>
                    </div>
                </Sheet.Header>
                <Sheet.Content>
                    <div className="flex-1 overflow-y-auto px-6 pb-6 mt-6">
                        {modifierGroups?.length ? (
                            <div className="space-y-3">
                                {modifierGroups.map((group: any) => {
                                    const isSelected = selectedIds.includes(group.id);
                                    return (
                                        <div
                                            key={group.id}
                                            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${isSelected ? 'border-primary bg-primary/5' : 'border-border bg-card hover:bg-muted/50'}`}
                                            onClick={() => toggle(group.id)}
                                        >
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'}`}>
                                                    {isSelected && <Check className="h-3 w-3" />}
                                                </div>
                                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-foreground flex items-center gap-2">
                                                        {group.name}
                                                        <span className="text-sm text-muted-foreground">{group.modifiers?.length ? `(${group.modifiers.length} variants)` : 'No variants'}</span>
                                                    </h4>
                                                    <p className="text-sm text-muted-foreground">{group?.desc}</p>
                                                    <div className='flex flex-col gap-2 mt-1'>
                                                        {
                                                            group.modifiers.map((modifier: any) => (
                                                                <div key={modifier.id} className='flex items-center gap-2 flex-row w-full'>
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
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">No modifier groups found</div>
                        )}
                    </div>
                    <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-background">
                        <div className="text-sm text-muted-foreground">
                            {selectedIds.length} modifier group{selectedIds.length !== 1 ? 's' : ''} selected
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button onClick={handleSave} disabled={selectedIds.length === 0}>Save Selection</Button>
                        </div>
                    </div>
                </Sheet.Content>
            </Sheet.Container>
            <Sheet.Backdrop onClick={() => setOpen(false)} />
        </Sheet>
    );
}


