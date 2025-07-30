import { Download, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BrochureSectionProps {
    brochureUrl?: string
    productName: string
}

export function BrochureSection({ brochureUrl, productName }: BrochureSectionProps) {
    if (!brochureUrl) {
        return null
    }

    const handleDownload = () => {
        // Open brochure in new tab
        window.open(brochureUrl, '_blank')
    }

    return (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="flex-1">
                    <h3 className="font-medium text-blue-900 dark:text-blue-100">
                        Product Brochure Available
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                        Download the detailed brochure for {productName}
                    </p>
                </div>
                <Button
                    onClick={handleDownload}
                    variant="outline"
                    size="sm"
                    className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-800"
                >
                    <Download className="h-4 w-4 mr-2" />
                    View Brochure
                </Button>
            </div>
        </div>
    )
} 