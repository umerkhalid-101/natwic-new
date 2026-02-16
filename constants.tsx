
import { ServiceItem, PricingPlan, Testimonial } from './types';

export const SERVICES: ServiceItem[] = [
  {
    id: '1',
    number: '01',
    title: 'Web design',
    tags: ['Website', 'Wireframe', 'Landing page', 'Dashboard', 'Product'],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.',
    imageUrl: 'https://picsum.photos/seed/web/400/300'
  },
  {
    id: '2',
    number: '02',
    title: 'Branding',
    tags: ['Logo', 'Packaging', 'Mockup', 'Deck', 'Visual identity'],
    description: 'Creating timeless brand identities that resonate with your core audience and stand the test of time.',
    imageUrl: 'https://picsum.photos/seed/brand/400/300'
  },
  {
    id: '3',
    number: '03',
    title: 'Content',
    tags: ['UX writing', 'Social content', 'Campaign', 'Deck', 'Advertising'],
    description: 'Strategic content creation that drives engagement and tells your brand story effectively.',
    imageUrl: 'https://picsum.photos/seed/content/400/300'
  },
  {
    id: '4',
    number: '04',
    title: 'Social media',
    tags: ['Strategy', 'Growth', 'Campaign', 'Posts', 'Design'],
    description: 'Scaling your digital presence through data-driven social strategies and creative executions.',
    imageUrl: 'https://picsum.photos/seed/social/400/300'
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: 'Standard',
    price: '3450',
    period: '/project',
    features: [
      'Fast design & dev, built for scale',
      'Dedicated creative team',
      'Average 2-3 day turnaround',
      'Ongoing design-to-build support',
      '2-4 weeks sprint'
    ]
  },
  {
    name: 'Pro',
    price: '6850',
    period: '/monthly',
    isPopular: true,
    features: [
      'Unlimited tasks, one at time',
      'Slack channel and message',
      'Average 24h turnaround',
      'Ongoing design-to-build support',
      'Branding and dev sprints'
    ]
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    quote: "Fast, thoughtful, and deeply collaborative. Natwic felt like part of our team from day one.",
    author: "Naomi Voss",
    role: "Creative Director at Antra®",
    image: "https://i.pravatar.cc/150?u=naomi",
    stars: 5
  },
  {
    id: '2',
    quote: "Natwic's work was minimal in form but rich in intention. They helped us express our brand with clarity.",
    author: "Mark Williams",
    role: "Head of Brand at Velith®",
    image: "https://i.pravatar.cc/150?u=mark",
    stars: 5
  }
];
