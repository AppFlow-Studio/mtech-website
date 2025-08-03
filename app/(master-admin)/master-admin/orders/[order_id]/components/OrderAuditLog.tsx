"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, Loader2, User, Clock, Paperclip, Send, Printer, Mail } from "lucide-react";
import { getOrderAuditLog } from "../actions/get-order-audit-log";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getEmail } from "../../../quote-requests/[id]/actions/get-email";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ResendEmail } from "../../../quote-requests/[id]/actions/resend-email";
import { useProfile } from "@/lib/hooks/useProfile";

interface AuditLogEntry {
    id: string
    quote_request_id: string
    event_type: 'PAYMENT_PROCESSED' | 'NOTE_ADDED' | 'EMAIL_SENT' | 'SYSTEM_ACTION'
    user_id: string
    user_name: string
    message: string
    details: {
        PAYMENT_PROCESSED?: {
            amount: number
            currency: string
            gateway: string
            status: string
            type: string
            payment_id: string
        }
        NOTE_ADDED?: {
            note_text: string
        }
        EMAIL_SENT?: {
            sent_email_id: string
            recipient_email: string
        }
        SYSTEM_ACTION?: {
            action_type: string
            action_details: string
        }
    }
    created_at: string
}

interface OrderAuditLogProps {
    orderId: string;
}

export default function OrderAuditLog({ orderId }: OrderAuditLogProps) {
    const { data: auditLog, isLoading, refetch } = useQuery({
        queryKey: ["order-audit-log", orderId],
        queryFn: () => getOrderAuditLog(orderId),
    });
    const { profile } = useProfile();
    const [comment, setComment] = useState('');

    // Email States
    const [emailModalOpen, setEmailModalOpen] = useState(false)
    const [emailTo, setEmailTo] = useState<string>('')
    const [emailSubject, setEmailSubject] = useState<string>('')
    const [emailContent, setEmailContent] = useState<string>('')
    const [isLoadingEmail, setIsLoadingEmail] = useState(false)
    const [currentEmailId, setCurrentEmailId] = useState<string>('')
    const [isResendingEmail, setIsResendingEmail] = useState(false)
    const [resendEmailModalOpen, setResendEmailModalOpen] = useState(false)
    const [expandedLogEntries, setExpandedLogEntries] = useState<Set<string>>(new Set())

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };


    const getEventTypeDisplayText = (eventType: AuditLogEntry['event_type']) => {
        switch (eventType) {
            case 'NOTE_ADDED':
                return 'added a note'
            case 'EMAIL_SENT':
                return 'sent an email'
            case 'PAYMENT_PROCESSED':
                return 'processed payment'
            case 'SYSTEM_ACTION':
                return 'performed system action'
            default:
                return 'performed an action'
        }
    }

    const handleViewEmail = async (emailId: string) => {
        setIsLoadingEmail(true)
        setEmailModalOpen(true)
        setCurrentEmailId(emailId)

        try {
            const result = await getEmail(emailId)
            if (result instanceof Error) {
                toast.error('Failed to load email', {
                    description: result.message
                })
                setEmailContent('Failed to load email content')
            } else {
                setEmailTo(result.data?.to[0] || '')
                setEmailContent(result.data?.html || 'No email content available')
                setEmailSubject(result.data?.subject || 'No email subject available')
            }
        } catch (error) {
            console.error('Error loading email:', error)
            toast.error('Failed to load email')
            setEmailContent('Failed to load email content')
        } finally {
            setIsLoadingEmail(false)
        }
    }

    const handlePrintEmail = () => {
        const printWindow = window.open('', '_blank')
        if (printWindow) {
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Email Print</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .email-header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
                        .email-content { line-height: 1.6; }
                    </style>
                </head>
                <body>
                    <div class="email-header">
                        <h2>Email Content</h2>
                        <p><strong>Email ID:</strong> ${currentEmailId}</p>
                        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                    </div>
                    <div class="email-content">
                        ${emailContent}
                    </div>
                </body>
                </html>
            `)
            printWindow.document.close()
            printWindow.print()
        }
    }

    const handleResendEmail = () => {
        setResendEmailModalOpen(true)
    }

    const confirmResendEmail = async () => {
        setIsResendingEmail(true)

        const response = await ResendEmail(emailTo, emailSubject, emailContent, orderId, profile || {})
        if (response instanceof Error) {
            toast.error('Failed to resend email', {
                description: response.message
            })
            setIsResendingEmail(false)
        } else {
            toast.success('Email resent successfully')
            setResendEmailModalOpen(false)
            setIsResendingEmail(false)
            await refetch()
        }
    }


    // const onSendPriceUpdateEmail = async (changedItems: auditLog?Item[]) => {
    //     if (!auditLog? || changedItems.length === 0) return

    //     try {
    //         // Create email content for price updates
    //         const emailSubject = `Price Update for Order #${auditLog?.order_confirmation_number} - MTech Distributors`

    //         // Prepare data for the React Email component
    //         const emailData = {
    //             auditLog?Id: auditLog?.id,
    //             customerName: `${auditLog?.customer_name} ${auditLog?.customer_last_name}`,
    //             customerEmail: auditLog?.customer_email,
    //             order_confirmation_number: auditLog?.order_confirmation_number,
    //             changedItems: changedItems.map(item => ({
    //                 id: item.id,
    //                 product_name: item.product_name,
    //                 product: item.product,
    //                 quantity: item.quantity,
    //                 quoted_price: item.quoted_price,
    //                 oldPrice: originalPrices[item.id] || item.product?.default_price || 0,
    //                 newPrice: item.quoted_price || item.product?.default_price || 0
    //             })),
    //             totalAmount: getTotalValue(),
    //             reviewLink: 'https://mtechdistributor.com/review-quote'
    //         }
    //         const response = await sendPriceUpdateEmail(emailData)
    //         if (response instanceof Error) {
    //             toast.error('Failed to send price update email', {
    //                 description: response.message
    //             })
    //             return
    //         }

    //         // Send the email using React Email component

    //     } catch (error) {
    //         console.error('Error sending price update email:', error)
    //         throw error
    //     }
    // }

    const toggleLogEntryExpansion = (entryId: string) => {
        setExpandedLogEntries(prev => {
            const newSet = new Set(prev)
            if (newSet.has(entryId)) {
                newSet.delete(entryId)
            } else {
                newSet.add(entryId)
            }
            return newSet
        })
    }
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <History className="h-5 w-5" />
                        Order History
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

    const handlePostComment = () => {
        console.log('Posting comment:', comment)
        setComment('')
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
                                            <Tooltip>
                                                <TooltipTrigger><Paperclip className="h-4 w-4" /></TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Attach a file</p>
                                                </TooltipContent>
                                            </Tooltip>
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
                        {
                            isLoading && (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                </div>
                            )
                        }
                        {auditLog?.map((entry, index) => {
                            const isExpanded = expandedLogEntries.has(entry.id)
                            const hasDetails = entry.event_type !== 'SYSTEM_ACTION'
                            return (
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
                                                        {entry.user_name}
                                                    </span>
                                                    <span className="text-sm text-muted-foreground">
                                                        {getEventTypeDisplayText(entry.event_type)}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                    {formatDate(entry.created_at)}
                                                </span>
                                            </div>

                                            {/* Event-specific content */}
                                            {entry.event_type === 'NOTE_ADDED' && entry.details.NOTE_ADDED && (
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-700">{entry.details.NOTE_ADDED.note_text.slice(0, 100)}{entry.details.NOTE_ADDED.note_text.length > 100 ? '...' : ''}</p>
                                                </div>
                                            )}

                                            {entry.event_type === 'EMAIL_SENT' && entry.details.EMAIL_SENT && (
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-700">
                                                        <p className="text-sm text-gray-700">{entry.message}</p>
                                                        <strong>To:</strong> {entry.details.EMAIL_SENT.recipient_email}
                                                    </p>
                                                    {hasDetails && (
                                                        <button
                                                            className="mt-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                                            onClick={() => handleViewEmail(entry.details.EMAIL_SENT.sent_email_id)}
                                                        >
                                                            View Email
                                                        </button>
                                                    )}
                                                </div>
                                            )}

                                            {entry.event_type === 'PAYMENT_PROCESSED' && entry.details.PAYMENT_PROCESSED && (
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-700">
                                                        <strong>Amount:</strong> ${entry.details.PAYMENT_PROCESSED.amount} {entry.details.PAYMENT_PROCESSED.currency}
                                                    </p>
                                                    <p className="text-sm text-gray-700">
                                                        <strong>Status:</strong> {entry.details.PAYMENT_PROCESSED.status}
                                                    </p>
                                                    {hasDetails && (
                                                        <button
                                                            className="mt-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                                            onClick={() => toggleLogEntryExpansion(entry.id)}
                                                        >
                                                            {isExpanded ? 'Hide Details' : 'View Details'}
                                                        </button>
                                                    )}
                                                </div>
                                            )}

                                            {entry.event_type === 'SYSTEM_ACTION' && entry.details.SYSTEM_ACTION && (
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-700">{entry.message}</p>
                                                </div>
                                            )}

                                            {/* Expandable details */}
                                            {hasDetails && isExpanded && (
                                                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                    <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Details</h4>
                                                    <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                                        {JSON.stringify(entry.details, null, 2)}
                                                    </pre>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>


            {/* Email View Modal */}
            <Dialog open={emailModalOpen} onOpenChange={setEmailModalOpen}>
                <DialogContent className="sm:max-w-4xl max-h-[80vh]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5 text-blue-500" />
                            Email Content
                        </DialogTitle>
                        <DialogDescription>
                            View the email that was sent to the customer
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {isLoadingEmail ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="flex items-center space-x-2">
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                    <span>Loading email content...</span>
                                </div>
                            </div>
                        ) : (
                            <div className="border rounded-lg overflow-hidden">
                                <div className="bg-muted/50 p-3 border-b">
                                    <h4 className="font-medium text-sm">Email Preview</h4>
                                    <p className="text-xs text-muted-foreground">
                                        This is how the email appeared to the recipient
                                    </p>
                                </div>
                                <div className="max-h-[60vh] overflow-auto">
                                    <div
                                        className="p-4"
                                        dangerouslySetInnerHTML={{ __html: emailContent }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <Button
                            variant="outline"
                            onClick={() => setEmailModalOpen(false)}
                        >
                            Close
                        </Button>
                        <Button
                            onClick={handlePrintEmail}
                            variant="outline"
                            disabled={isLoadingEmail}
                        >
                            <Printer className="h-4 w-4 mr-2" />
                            Print Email
                        </Button>
                        <Button
                            onClick={handleResendEmail}
                            disabled={isResendingEmail || isLoadingEmail}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            {isResendingEmail ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Resending...
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4 mr-2" />
                                    Resend Email
                                </>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Resend Email Confirmation Dialog */}
            <Dialog open={resendEmailModalOpen} onOpenChange={setResendEmailModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Send className="h-5 w-5 text-green-500" />
                            Resend Email
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to resend this email to the customer?
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white text-xs font-bold">!</span>
                                </div>
                                <div>
                                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                                        Important Notice
                                    </h4>
                                    <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                                        <li>• This will send a duplicate email to the customer</li>
                                        <li>• The customer may receive multiple copies</li>
                                        <li>• This action will be logged in the audit trail</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="bg-muted/50 rounded-lg p-4">
                            <h4 className="font-medium text-foreground mb-2">Email Details</h4>
                            <div className="text-sm text-muted-foreground space-y-1">
                                {/* <p>Email ID: <span className="font-medium text-foreground">{currentEmailId}</span></p>
                                <p>Customer: <span className="font-medium text-foreground">{auditLog?.customer_name} {auditLog?.customer_last_name}</span></p>
                                <p>Email: <span className="font-medium text-foreground">{auditLog?.customer_email}</span></p> */}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <Button
                            variant="outline"
                            onClick={() => setResendEmailModalOpen(false)}
                            disabled={isResendingEmail}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmResendEmail}
                            disabled={isResendingEmail}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            {isResendingEmail ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Resending...
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4 mr-2" />
                                    Confirm Resend
                                </>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
} 