import React, { useCallback, useMemo } from 'react'
import { ArrayOfPrimitivesInputProps, PatchEvent, set, setIfMissing, unset } from 'sanity'
import { useTags } from '@/app/(master-admin)/master-admin/actions/hook/useTagHooks'

// Array input for selecting tag IDs and saving them into the field value
export default function TagSelector(props: ArrayOfPrimitivesInputProps<string>) {
    const { onChange, value } = props
    const selectedIds = useMemo<string[]>(() => (Array.isArray(value) ? value : []), [value])

    const { data: tags, isLoading, isError } = useTags()

    const commit = useCallback((nextIds: string[]) => {
        if (nextIds.length === 0) {
            onChange(PatchEvent.from(unset()))
        } else {
            onChange(PatchEvent.from([setIfMissing([]), set(nextIds)]))
        }
    }, [onChange])

    const toggle = useCallback((id: string) => {
        const isSelected = selectedIds.includes(id)
        const next = isSelected ? selectedIds.filter(v => v !== id) : [...selectedIds, id]
        commit(next)
    }, [selectedIds, commit])

    const clearAll = useCallback(() => {
        onChange(PatchEvent.from(unset()))
    }, [onChange])

    if (isLoading) return <div>Loading tags…</div>
    if (isError) return <div>Failed to load tags.</div>

    return (
        <div className="space-y-3">
            {/* Chips */}
            <div className='flex flex-row flex-wrap gap-2'>
                {tags?.map((tag: any) => {
                    const active = selectedIds.includes(String(tag.id))
                    return (
                        <button
                            key={tag.id}
                            type="button"
                            onClick={() => toggle(String(tag.id))}
                            className={`px-3 py-1 rounded-full text-sm border transition-colors ${active
                                ? 'bg-purple-100 border-purple-300 text-purple-800'
                                : 'bg-transparent border-gray-300 text-white dark:text-white'}`}
                        >
                            {tag.name}
                        </button>
                    )
                })}
            </div>

            {/* Selected summary + reset */}
            <div className='flex items-center justify-between'>
                <span className='text-xs text-gray-500'>
                    {selectedIds.length} selected
                </span>
                {selectedIds.length > 0 && (
                    <button type="button" onClick={clearAll} className='text-xs text-red-600 hover:underline'>
                        Clear all
                    </button>
                )}
            </div>
        </div>
    )
}