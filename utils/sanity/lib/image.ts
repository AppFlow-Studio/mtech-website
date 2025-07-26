// src/lib/sanity/image.ts or wherever you prefer to place your Sanity utilities
import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

const imageBuilder = createImageUrlBuilder({ projectId, dataset });

export function urlFor(source: SanityImageSource) {
  return imageBuilder.image(source);
}

