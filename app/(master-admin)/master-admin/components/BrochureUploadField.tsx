import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, FileText, X, Download } from "lucide-react"

interface BrochureUploadFieldProps {
    value: File | null
    onChange: (file: File | null) => void
    existingBrochureUrl?: string
    onRemoveExisting?: () => void
}

export function BrochureUploadField({
    value,
    onChange,
    existingBrochureUrl,
    onRemoveExisting
}: BrochureUploadFieldProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        if (file && file.type === "application/pdf") {
            onChange(file)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && file.type === "application/pdf") {
            onChange(file)
        }
    }

    const handleRemove = () => {
        onChange(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    return (
        <div className="space-y-4">
            {/* Existing Brochure */}
            {existingBrochureUrl && !value && (
                <div className="border border-border rounded-lg p-4 bg-muted/20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <FileText className="h-8 w-8 text-blue-600" />
                            <div>
                                <p className="font-medium text-foreground">Existing Brochure</p>
                                <p className="text-sm text-muted-foreground">PDF document attached</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(existingBrochureUrl, '_blank')}
                            >
                                <Download className="h-4 w-4 mr-1" />
                                View
                            </Button>
                            {onRemoveExisting && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={onRemoveExisting}
                                    className="text-destructive hover:text-destructive"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* New Brochure Upload */}
            {value && (
                <div className="border border-border rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <FileText className="h-8 w-8 text-green-600" />
                            <div>
                                <p className="font-medium text-foreground">{value.name}</p>
                                <p className="text-sm text-muted-foreground">
                                    {(value.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleRemove}
                            className="text-destructive hover:text-destructive"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Upload Area */}
            {!value && (
                <div
                    className="w-full h-24 border-2 border-dashed border-muted rounded-lg flex flex-col items-center justify-center cursor-pointer bg-muted/30 hover:bg-muted/50 transition"
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={e => e.preventDefault()}
                    onDragEnter={e => e.preventDefault()}
                >
                    <div className="flex flex-col items-center justify-center w-full h-full p-2">
                        <div className="flex items-center border justify-center w-8 h-8 mb-2 rounded-full bg-muted">
                            <Upload className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="text-xs text-muted-foreground text-center px-2 font-medium">
                            <span className="block">Drag &amp; drop PDF here</span>
                            <span className="block">or <span className="underline text-primary">click to select</span></span>
                        </span>
                    </div>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    )
} 