"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Plus, Loader2, User } from "lucide-react";
import { toast } from "sonner";
import { useProfile } from "@/lib/hooks/useProfile";
import { getQuoteNotes } from "../actions/get-quote-notes";
import { addQuoteNote } from "../actions/add-quote-notes";

interface QuoteNote {
    id: string;
    note: string;
    created_at: string;
    profiles: {
        id: string;
        first_name: string;
        last_name: string;
        role: string;
    };
}

interface QuoteNotesProps {
    quoteRequestId: string;
    profile_id: string;
}

export default function QuoteNotes({ quoteRequestId, profile_id }: QuoteNotesProps) {
    const { profile } = useProfile();
    const queryClient = useQueryClient();
    const [showNoteForm, setShowNoteForm] = useState(false);
    const [newNote, setNewNote] = useState("");

    const { data: notes, isLoading } = useQuery({
        queryKey: ["quote-notes", quoteRequestId],
        queryFn: () => getQuoteNotes(quoteRequestId),
    });

    const addNoteMutation = useMutation({
        mutationFn: (note: string) => addQuoteNote(quoteRequestId, note, profile_id, `${profile?.first_name} ${profile?.last_name}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["quote-notes", quoteRequestId] });
            setNewNote("");
            setShowNoteForm(false);
            toast.success("Note added successfully");
        },
        onError: (error) => {
            toast.error("Failed to add note");
            console.error(error);
        },
    });

    const handleAddNote = () => {
        if (!newNote.trim()) {
            toast.error("Please enter a note");
            return;
        }
        addNoteMutation.mutate(newNote);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Quote Notes
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Quote Notes
                    </CardTitle>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowNoteForm(!showNoteForm)}
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Note
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Add Note Form */}
                {showNoteForm && (
                    <div className="space-y-3 p-4 bg-muted/50 rounded-lg border">
                        <Textarea
                            placeholder="Add a note to this order..."
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            className="min-h-[100px]"
                            disabled={addNoteMutation.isPending}
                        />
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                onClick={handleAddNote}
                                disabled={addNoteMutation.isPending || !newNote.trim()}
                            >
                                {addNoteMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                ) : (
                                    <MessageSquare className="h-4 w-4 mr-1" />
                                )}
                                Post Note
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    setShowNoteForm(false);
                                    setNewNote("");
                                }}
                                disabled={addNoteMutation.isPending}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}

                {/* Notes List */}
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {notes && Array.isArray(notes) && notes.length > 0 ? (
                        notes.map((note: QuoteNote) => (
                            <div
                                key={note.id}
                                className="p-4 bg-background border rounded-lg space-y-2"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium text-sm">
                                            {note?.profiles?.first_name} {note?.profiles?.last_name}
                                        </span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {formatDate(note.created_at)}
                                    </span>
                                </div>
                                <p className="text-sm text-foreground whitespace-pre-wrap">
                                    {note.note}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>No notes yet</p>
                            <p className="text-xs">Add the first note to start the conversation</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
} 