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
