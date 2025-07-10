# Inquiry Notes Feature

## Overview

The inquiry notes feature allows agents to add and view notes for their assigned inquiries. This provides a way to track communication history, follow-up actions, and important details about customer interactions.

## Features

### 1. View Previous Notes
- Notes are displayed as cards with agent information and timestamps
- Each note shows:
  - Agent name (first_name + last_name)
  - Creation date and time
  - Note content
- Notes are sorted by creation date (newest first)

### 2. Add New Notes
- "Add Note" button to toggle the note form
- Textarea for entering note content
- Cancel and Post buttons for form actions
- Loading states during note creation

### 3. Database Structure

The `inquiry_notes` table has the following structure:
```sql
CREATE TABLE public.inquiry_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    inquiry_id UUID NOT NULL REFERENCES public.inquiries(id) ON DELETE CASCADE,
    agent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4. Security

Row Level Security (RLS) policies ensure:
- Agents can only view/add notes for their assigned inquiries
- Admins can view/add notes for all inquiries
- Proper authentication and authorization

## Usage

### For Agents

1. **View Notes**: Open the edit dialog for any inquiry to see existing notes
2. **Add Note**: Click "Add Note" button to reveal the note form
3. **Post Note**: Enter your note and click "Post Note" to save
4. **Cancel**: Click "Cancel" to discard changes

### For Developers

#### Server Actions
- `getInquiryNotes(inquiryId)` - Fetch notes for an inquiry
- `addInquiryNote(inquiryId, agentId, note)` - Add a new note

#### React Query Hooks
- `useInquiryNotes(inquiryId)` - Query hook for fetching notes
- `useAddInquiryNote()` - Mutation hook for adding notes

#### State Management
The component uses local state for:
- `showNoteForm` - Controls note form visibility
- `newNote` - Current note text
- `isAddingNote` - Loading state for note creation

## Implementation Details

### File Structure
```
components/
├── actions/
│   ├── get-inquiry-notes.ts
│   └── add-inquiry-note.ts
└── states/
    └── notes.ts

app/agent/page.tsx (updated with notes functionality)
```

### Key Components

1. **Notes Display**: Cards showing previous notes with agent info
2. **Note Form**: Collapsible form for adding new notes
3. **Loading States**: Proper loading indicators during data fetching
4. **Error Handling**: Toast notifications for success/error states

### Styling

Notes use a consistent design with:
- Muted background for note cards
- Proper spacing and typography
- Icons for visual hierarchy
- Responsive layout

## Database Setup

Run the SQL commands in `database-schema.sql` to create the necessary table and policies.

## Future Enhancements

Potential improvements:
- Note editing and deletion
- Rich text formatting
- File attachments
- Note categories/tags
- Email notifications for new notes
- Note search functionality 