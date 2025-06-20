export interface Product {
  name: string;
  description: string;
  imageSrc: string;
  link: string;
  inStock: boolean;
}

export interface FullTestimonial {
  logoSrc: string;
  companyName: string;
  rating: number;
  timestamp: string;
  title: string;
  text: string;
  likes: number;
  dislikes: number;
}

export interface FeatureItem {
  title: string;
  description: string;
  imageSrc: string;
}

export interface FeatureTabsProps {
  features: FeatureItem[];
}

export interface Insight {
  icon: React.ElementType;
  title: string;
  description: string;
  imageSrc: string;
}

export interface ImageLinkCardProps {
  title: string;
  imageSrc: string;
  link: string;
}
