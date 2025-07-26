import { SanityImageSource } from "@sanity/image-url/lib/types/types";

export interface Product {
  name: string;
  description: string;
  imageSrc: string;
  link: string;
  inStock: boolean;
  tags?: string[];
  default_price: number;
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

interface Feature {
  name: string;
  detail?: string;
}

export interface Slide {
  imageSrc: string;
  title: string;
  description: string;
  features: Feature[];
  cta?: string;
}

export interface UserProfile {
  id: string
  first_name: string | null
  last_name: string | null
  role: 'AGENT' | 'ADMIN'
  created_at: string
}

export interface AuthState {
  user: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
}

export interface AuthStore extends AuthState {
  setUser: (user: UserProfile | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  logout: () => void
  initialize: () => Promise<void>
}

export interface AgentTier {
  id: string
  name: string
  description: string
  commission_rate: number
}

export interface AgentProductWithPrices {
  id: string
  product_id : string
  agent_tier_id : string
  price : number,
  products : Product
}

export interface AgentProductTierAndPrices {
  agent_tiers : AgentTier
  agent_product_prices : AgentProductWithPrices[]
}

export interface AgentProductPrices { 
  id: string
  product_id : string
  agent_tier_id : string
  price : number
}

export interface AgentInfoAndProductTierAndPrices {
  id: string
  first_name: string
  last_name: string
  email: string
  phone_number: string
  agent_tiers: AgentProductTierAndPrices
}


export interface Product {
  id: string
  name: string
  description: string
  imageSrc: string
  link: string
  default_price: number
  inStock: boolean
  tags?: string[]
}

export interface AgentProduct {
  id: string
  product: Product
  price: number
  product_id: string
  agent_tier_id: string
  created_at: string
}

export interface Orders {
  id: string
  order_name: string
  notes: string
  created_at: string
  updated_at: string
  agent_id: string
  status: "draft" | "submitted" | "approved" | "completed"
  order_items: OrderItems[]
}

export interface OrderItems {
  id: string
  order_id: string
  product_id: string
  products : Product
  quantity: number
  price_at_order: number
  created_at: string
  fulfillment_type : "PICKUP" | "SHIPPING"
  order_status : "PENDING" | "READY_FOR_PICKUP" | "SHIPPED" | "COMPLETED"
  tracking_number : string | null
  carrier : string | null
  pickup_details : string | null
  updated_at : string
}


export interface AdminPrivileges {
  can_edit_order : boolean
  
}

// TypeScript types based on the provided JSON data structure

export interface AssetReference {
  _ref: string;
  _type: 'reference';
}

export interface ImageType {
  _type: 'image';
  asset: AssetReference;
}

export interface BusinessFeature {
  description: string;
  imageSrc: ImageType;
  title: string;
  _key: string;
}

export interface CardFeature {
  description: string;
  imageSrc: SanityImageSource;
  title: string;
  _key: string;
}

export interface PaymentFeature {
  description: string;
  imageSrc: ImageType;
  title: string;
  _key: string;
}

export interface GrowthSection {
  Growth_Section_Header: string;
  Growth_Section_Image: ImageType;
  Growth_Section_SubText: string;
}

export interface InsightsSection {
  Insights_Section_Header: string;
  Insights_Section_SubText: string;
}

export interface ModernPayments {
  Modern_Description: string;
  Modern_Image: ImageType;
  Modern_Title: string;
}

export interface WhyChooseUs {
  Why_Choose_Us_Header: string;
  Why_Choose_Us_Image: ImageType;
  Why_Choose_Us_SubText: string;
}

export interface SystemInfo {
  base: {
    id: string;
    rev: string;
  };
}

export interface HomePage {
  Features_Business: BusinessFeature[];
  Features_Card: CardFeature[];
  Features_Payments: PaymentFeature[];
  Growth_Section: GrowthSection;
  Hero_Header: string;
  Hero_SubText: string;
  Insights_Section: InsightsSection;
  Modern_Payments: ModernPayments;
  Why_Choose_Us: WhyChooseUs;
  _createdAt: string;
  _id: string;
  _originalId: string;
  _rev: string;
  _system: SystemInfo;
  _type: 'Home_Page';
  _updatedAt: string;
}

// To represent the full query result, which is an array containing the HomePage object
export type HomePageQueryResult = {
  data: HomePage[];
};