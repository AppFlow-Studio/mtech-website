export interface Product {
  name: string;
  description: string;
  imageSrc: string;
  link: string;
  inStock: boolean;
  tags?: string[];
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
