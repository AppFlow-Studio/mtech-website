'use client'
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Textarea } from "../ui/textarea";
import { Smile, AtSign, Hash, Paperclip, Send, Button } from "lucide-react";


export default function Auditlog() {

    const [comment, setComment] = useState('')

    const handlePostComment = () => {
        console.log(comment)
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Comment Input */}
                    <div className="mb-6">
                        <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center text-white text-sm font-medium">
                                TS
                            </div>
                            <div className="flex-1">
                                <Textarea
                                    placeholder="Leave a comment..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="min-h-[80px]"
                                />
                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center space-x-2">
                                        <button className="p-1 hover:bg-muted rounded">
                                            <Smile className="h-4 w-4" />
                                        </button>
                                        <button className="p-1 hover:bg-muted rounded">
                                            <AtSign className="h-4 w-4" />
                                        </button>
                                        <button className="p-1 hover:bg-muted rounded">
                                            <Hash className="h-4 w-4" />
                                        </button>
                                        <button className="p-1 hover:bg-muted rounded">
                                            <Paperclip className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <Button
                                        size="sm"
                                        onClick={handlePostComment}
                                        disabled={!comment.trim()}
                                    >
                                        <Send className="h-4 w-4 mr-2" />
                                        Post
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Only you and other staff can see comments
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Events */}
                    <div className="space-y-4">
                        {auditLog.map((entry, index) => (
                            <div key={entry.id} className="relative">
                                {/* Timeline line */}
                                {index < auditLog.length - 1 && (
                                    <div className="absolute left-4 top-8 w-0.5 h-8 bg-gray-200 dark:bg-gray-700" />
                                )}

                                <div className="flex items-start space-x-3">
                                    {/* Timeline dot */}
                                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                                        <div className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                                    {entry.user}
                                                </span>
                                                <span className="text-sm text-muted-foreground">
                                                    {entry.action}
                                                </span>
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                {formatTime(entry.timestamp)}
                                            </span>
                                        </div>

                                        {/* Special handling for email events */}
                                        {entry.type === 'email_sent' && (
                                            <button className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline">
                                                View email
                                            </button>
                                        )}

                                        {/* Expandable details for certain events */}
                                        {(entry.type === 'payment' || entry.type === 'order_action') && (
                                            <button className="mt-1 text-xs text-muted-foreground hover:text-foreground">
                                                ▼
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}