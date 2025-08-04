import { PortableText } from '@portabletext/react'
import SanityImage from './SanityImage'

interface ProductHeroSectionProps {
    title: string
    description: any // PortableText content
    image: any // Sanity image object
    ctaText?: string
    ctaLink?: string
    onCtaClick?: () => void
}

export default function ProductHeroSection({
    title,
    description,
    image,
    ctaText = "Buy Our Products",
    ctaLink,
    onCtaClick
}: ProductHeroSectionProps) {
    const handleCtaClick = () => {
        if (onCtaClick) {
            onCtaClick()
        } else if (ctaLink) {
            window.location.href = ctaLink
        }
    }

    return (
        <section className="py-8 sm:py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Column 1: Text Content */}
                    <div className="text-center lg:text-left">
                        <h1
                            className="
              text-3xl md:text-4xl font-medium leading-tight
              text-gray-900 dark:text-white
            "
                        >
                            {title}
                        </h1>
                        <p
                            className="
              mt-6 leading-relaxed
              text-gray-600 dark:text-gray-300
              max-w-xl mx-auto lg:mx-0
            "
                        >
                            <PortableText value={description} />
                        </p>
                        <div className="mt-8">
                            <button
                                className="
                inline-flex items-center justify-center 
                px-4 py-2 rounded-full font-semibold text-white
                bg-gradient-to-b from-[#662CB2] to-[#2C134C] dark:from-[#662CB2] dark:to-[#2C134C] hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600
                hover:opacity-90 transition-opacity duration-300 shadow-lg
              "
                            >
                                {ctaText}
                            </button>
                        </div>
                    </div>
                    <div>
                        <SanityImage
                            image={image}
                            alt={title}
                            width={800}
                            height={550}
                            className="w-full h-auto"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
} 