import { createContext, useContext, useState, ReactNode } from 'react'

// Initial mock data for tags
const INITIAL_TAGS = [
    "atm parts",
    "pos parts",
    "network devices",
    "atm signage",
    "credit card terminals",
    "pos system",
    "pos accessories",
    "atm machines",
    "scales",
]

interface TagContextType {
    tags: string[]
    addTag: (tag: string) => void
    updateTag: (oldTag: string, newTag: string) => void
    deleteTag: (tag: string) => void
}

const TagContext = createContext<TagContextType | undefined>(undefined)

export function TagProvider({ children }: { children: ReactNode }) {
    const [tags, setTags] = useState<string[]>(INITIAL_TAGS)

    const addTag = (tag: string) => {
        const newTag = tag.toLowerCase().trim()
        if (!tags.includes(newTag)) {
            setTags([...tags, newTag])
        }
    }

    const updateTag = (oldTag: string, newTag: string) => {
        const updatedTag = newTag.toLowerCase().trim()
        setTags(tags.map(tag => tag === oldTag ? updatedTag : tag))
    }

    const deleteTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag))
    }

    return (
        <TagContext.Provider value={{ tags, addTag, updateTag, deleteTag }}>
            {children}
        </TagContext.Provider>
    )
}

export function useTags() {
    const context = useContext(TagContext)
    if (context === undefined) {
        throw new Error('useTags must be used within a TagProvider')
    }
    return context
} 