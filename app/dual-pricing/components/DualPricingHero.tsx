import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import SanityImage from "@/components/SanityImage";
import { PortableText, PortableTextComponents } from "@portabletext/react";

interface DualPricingHeroProps {
    title: string;
    description?: string | any; // Can be string or PortableText content
    image: string | any; // Can be image path or Sanity image object
    imageAlt?: string;
    badge?: string;
    rightFeatures?: string | any;
    useSanityImage?: boolean;
    usePortableText?: boolean;
    portableTextComponents?: PortableTextComponents;
}

export default function DualPricingHero({
    title,
    description,
    image,
    imageAlt,
    badge,
    rightFeatures,
    useSanityImage = false,
    usePortableText = false,
    portableTextComponents
}: DualPricingHeroProps) {
    const defaultPortableTextComponents: PortableTextComponents = {
        list: {
            bullet: ({ children }) => (
                <ul className="space-y-3 sm:space-y-4 flex-grow">
                    {children}
                </ul>
            ),
            number: ({ children }) => (
                <ol className="space-y-3 sm:space-y-4 flex-grow">
                    {children}
                </ol>
            ),
        },
        listItem: {
            bullet: ({ children }) => (
                <li className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle2 className="h-4 w-4 sm:h-6 sm:w-6 flex-shrink-0 text-white fill-[#662CB2] mt-0.5" />
                    <span className="text-xs sm:text-sm leading-relaxed">
                        {children}
                    </span>
                </li>
            ),
            number: ({ children }) => (
                <li className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle2 className="h-4 w-4 sm:h-6 sm:w-6 flex-shrink-0 text-white fill-[#662CB2] mt-0.5" />
                    <span className="text-xs sm:text-sm leading-relaxed">
                        {children}
                    </span>
                </li>
            ),
        },
        block: {
            normal: ({ children }) => (
                <p className="leading-relaxed mb-2 mt-2">
                    {children}
                </p>
            ),
            h3: ({ children }) => (
                <h3 className="text-xl md:text-2xl font-medium leading-tight text-gray-900 dark:text-white mt-6">
                    {children}
                </h3>
            ),
        },
    };

    const components = portableTextComponents || defaultPortableTextComponents;

    return (
        <section className="py-8 sm:py-12">
            <div className="container mx-auto px-4">
                {badge && (
                    <div className="mb-8">
                        <div
                            className="inline-block px-5 py-2 rounded-full text-sm font-medium 
                        bg-purple-100 text-purple-700
                        dark:bg-purple-600/20 dark:text-white"
                        >
                            {badge}
                        </div>
                    </div>
                )}

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                    {/* Left Column: Text Content */}
                    <div className="space-y-6">
                        <h1 className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white">
                            {title}
                        </h1>

                        {usePortableText && description ? (
                            <PortableText value={description} components={components} />
                        ) : typeof description === 'string' ? (
                            <div className="space-y-4">
                                {description.split('\n\n').map((paragraph, index) => (
                                    <p key={index} className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        ) : null}

                    </div>

                    {/* Right Column: Image and Feature List */}
                    <div className="space-y-12">
                        <div>
                            {useSanityImage ? (
                                <SanityImage
                                    image={image}
                                    alt={imageAlt || title}
                                    width={800}
                                    height={600}
                                    className="w-full h-auto rounded-2xl"
                                />
                            ) : (
                                <Image
                                    src={image as string}
                                    alt={imageAlt || title}
                                    width={800}
                                    height={600}
                                    className="w-full h-auto rounded-2xl"
                                />
                            )}
                        </div>

                        {usePortableText && rightFeatures ? (
                            <PortableText value={rightFeatures} components={components} />
                        ) : typeof rightFeatures === 'string' ? (
                            <div className="space-y-4">
                                {description.split('\n\n').map((paragraph, index) => (
                                    <p key={index} className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </section>
    );
} 