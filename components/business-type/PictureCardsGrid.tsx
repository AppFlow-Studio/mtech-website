import Image from "next/image";

interface PictureCard {
    title: string;
    description: string;
    background_image: any; // Sanity image object
    overlay_color?: string;
    text_color?: string;
}

interface PictureCardsGridProps {
    cards: PictureCard[];
    className?: string;
}
import { urlFor } from "@/sanity/lib/image";


export default function PictureCardsGrid({ cards, className = "" }: PictureCardsGridProps) {
    return (
        <section className={`py-16 sm:py-24 ${className}`}>
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            className="relative h-64 rounded-xl overflow-hidden group cursor-pointer transition-transform duration-300 hover:scale-105"
                        >
                            {/* Background Image with Blur */}
                            <div className="">
                                <Image
                                    src={urlFor(card).url()}
                                    alt={card.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
} 