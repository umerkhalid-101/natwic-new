import { ServiceItem, PricingPlan, Testimonial } from './types';

export const SERVICES: ServiceItem[] = [
  {
    id: '1',
    number: '01',
    title: 'Web design',
    tags: ['Website', 'Wireframe', 'Landing page', 'Dashboard', 'Product'],
    description: 'Fast, conversion-focused websites and product UI. From a launch-ready landing page to a full SaaS dashboard.',
    idealFor: 'SaaS launches, product teams, service businesses',
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: '2',
    number: '02',
    title: 'Branding',
    tags: ['Logo', 'Packaging', 'Mockup', 'Deck', 'Visual identity'],
    description: 'Identities that make you look as good as the thing you sell: logo, type, colour and the system that ties it together.',
    idealFor: 'New startups, rebrands, local shops and studios',
    imageUrl: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: '3',
    number: '03',
    title: 'Content',
    tags: ['UX writing', 'Social content', 'Campaign', 'Deck', 'Advertising'],
    description: 'Clear words and visuals that explain what you do and why it matters, on your site, in decks and in campaigns.',
    idealFor: 'Pitch decks, product launches, websites',
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: '4',
    number: '04',
    title: 'Social media',
    tags: ['Strategy', 'Growth', 'Campaign', 'Posts', 'Design'],
    description: 'A consistent social presence that brings people back: strategy, templates and posts designed to grow your audience.',
    idealFor: 'Local businesses, consumer brands, founders',
    imageUrl: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?auto=format&fit=crop&q=80&w=1000'
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
    quote: "Natwic understood our brand straight away and turned it into something we're proud to show. Clear communication the whole way through.",
    author: "Linda",
    role: "Salams",
    image: "",
    stars: 5
  },
  {
    id: '2',
    quote: "Quick turnarounds, smart ideas and no hand-holding needed. Natwic made our launch feel easy.",
    author: "Ryan",
    role: "Breakthirty",
    image: "",
    stars: 5
  }
];