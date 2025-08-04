import FeatureSlider from "@/components/business-type/FeatureSlider";
import PictureCardsGrid from "@/components/business-type/PictureCardsGrid";
import Contact from "@/components/Contact";
import { PortableText } from "@portabletext/react";

interface BusinessTypeCard {
    title: string;
    description: any; // PortableText content
    image: any; // Sanity image object
    features?: Array<{
        name: string;
        description: string;
    }>;
    cta: string;
}

interface BusinessTypePageProps {
    businessType: {
        title: string;
        description: any; // PortableText content
        imageSrc: any; // Sanity image object
        cards: BusinessTypeCard[];
        picture_cards?: Array<{
            title: string;
            description: string;
            background_image: any;
            overlay_color?: string;
            text_color?: string;
        }>;
        cta: string;
        business_type_link: string;
    };
}

export default function BusinessTypePage({ businessType }: BusinessTypePageProps) {
    // Transform Sanity cards to FeatureSlider format
    const sliderData = businessType?.cards?.map(card => ({
        title: card.title,
        imageSrc: card.image ? card.image : '',
        description: typeof card.description === 'string' ? card.description : card.description,
        features: card.features?.map(feature => ({
            name: feature.name,
            detail: feature.description,
        })) || [],
        cta: card.cta,
    }));

    return (
        <>
            <section className="py-16 sm:py-24 overflow-hidden">
                <div className="container mx-auto px-4">
                    {/* Section Header */}
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                            {businessType?.title}
                        </h2>
                        <div className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                            {businessType?.description ? <PortableText value={businessType.description} /> : <div>No description found</div>}
                        </div>
                    </div>
                </div>
                {businessType?.picture_cards && businessType.picture_cards.length > 0 && (
                    <PictureCardsGrid cards={businessType.picture_cards} />
                )}
                <FeatureSlider sliderData={sliderData} />
            </section>

            {/* Picture Cards Grid */}


            <Contact />
        </>
    );
} 