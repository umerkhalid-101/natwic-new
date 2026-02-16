
export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  tags: string[];
  description: string;
  imageUrl: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  features: string[];
  isPopular?: boolean;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  image: string;
  stars: number;
}
