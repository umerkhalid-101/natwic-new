/**
 * Client projects: shown as floating cards on the home page, listed on /work,
 * and each given its own case study at /work/<slug>.
 * Write-ups describe what each live site does; edit freely.
 */

export type Project = {
  id: number;
  slug: string;
  title: string;
  category: string;
  services: string[];
  domain: string;
  url: string;
  image: string;
  /** Intrinsic cover size, for width/height on <img> */
  imageSize: [number, number];
  /** Describes the cover screenshot for screen readers and image search */
  imageAlt: string;
  summary: string;
  challenge: string;
  approach: string;
  outcome: string;
  highlights: string[];
};

export const PROJECTS: Project[] = [
  {
    id: 1,
    slug: 'unita',
    title: 'Unita',
    category: 'Web platform',
    services: ['Product design', 'Web development', 'Search UX'],
    domain: 'unitaw.com',
    url: 'https://unitaw.com/',
    image: '/work/unitaw.webp',
    imageSize: [1200, 900],
    imageAlt: 'Unita homepage with an AI-assisted search bar for finding verified businesses',
    summary: 'A directory where verified businesses find each other.',
    challenge:
      'Unita checks every company against national trade registers before it is listed. The site had to make that trust obvious at a glance, and make searching across companies, chambers, creators and countries feel effortless.',
    approach:
      'We built the experience around search: one AI-assisted search bar, clear tabs for each kind of listing, and a hero that explains verification in a single line. A light, calm interface keeps a large directory easy to scan.',
    outcome:
      'A credible, easy-to-use platform that is already live across eight countries and ready to grow one verified listing at a time.',
    highlights: ['AI-assisted search', 'Verification explained in one line', 'Directory built to scale'],
  },
  {
    id: 2,
    slug: 'folionomics',
    title: 'Folionomics',
    category: 'Fintech · Product UI',
    services: ['Product design', 'UI system', 'Front-end'],
    domain: 'folionomics.com',
    url: 'https://www.folionomics.com/',
    image: '/work/folionomics.webp',
    imageSize: [1200, 900],
    imageAlt: 'Folionomics homepage in a dark theme with an interactive demo charting portfolio net worth',
    summary: 'Wallets and DeFi positions in one clear view.',
    challenge:
      'Crypto investors juggle wallets and DeFi positions across different apps. Folionomics needed a privacy-first product that shows everything in one place, without asking anyone to sign in first.',
    approach:
      'We designed a focused dark interface around a live demo: paste any wallet address and see net worth, history and positions straight away. Restrained colour and clear type keep dense financial data readable.',
    outcome:
      'A product people can explore in seconds, read-only and private, with portfolio-aware swaps planned next.',
    highlights: ['Read-only, no sign-in demo', 'Dense data made readable', 'Dark UI system'],
  },
  {
    id: 3,
    slug: 'breakthirty',
    title: 'Breakthirty',
    category: 'Marketing agency · Website',
    services: ['Web design', 'Development', 'Conversion'],
    domain: 'breakthirty.com',
    url: 'https://www.breakthirty.com/',
    image: '/work/breakthirty.webp',
    imageSize: [1200, 900],
    imageAlt: 'Breakthirty homepage with the headline about focusing on growth and a row of marketing services',
    summary: 'A growth agency site built to turn visitors into audits.',
    challenge:
      'A growth agency for Shopify and Amazon sellers offers a long list of services. The site needed to present all of it without overwhelming the store owners it is for.',
    approach:
      'We led with one clear promise, grouped the services into an easy-to-browse carousel, and added a section of free audits as a low-pressure way to get started.',
    outcome:
      'A bright, confident site that explains a broad offer simply and gives every visitor an easy first step.',
    highlights: ['One clear promise up top', 'Services you can browse', 'Free audits as a way in'],
  },
  {
    id: 4,
    slug: 'beyond-hut',
    title: 'Beyond Hut',
    category: 'Remote staffing · Website',
    services: ['Web design', 'Development', 'Messaging'],
    domain: 'beyondhut.com',
    url: 'https://beyondhut.com/',
    image: '/work/beyondhut.webp',
    imageSize: [1200, 716],
    imageAlt: 'Beyond Hut homepage offering trained remote staff to build a property team without the overhead',
    summary: 'Remote property teams, without the overhead.',
    challenge:
      'Beyond Hut places trained remote staff with UK property businesses. The site had to make a new kind of hire feel safe, simple and clearly worth it.',
    approach:
      'We put the value first: the key benefits in one strip near the top, a side-by-side cost comparison, and a simple four-step journey from the first call to a working team.',
    outcome:
      'A calm, trustworthy site that answers "is this worth it?" before anyone has to ask.',
    highlights: ['Value up front', 'Cost comparison', 'Four-step onboarding'],
  },
  {
    id: 5,
    slug: 'cayano',
    title: 'Cayano',
    category: 'Property · Website',
    services: ['Web design', 'Development', 'Property search'],
    domain: 'cayano.co.uk',
    url: 'https://cayano.co.uk/',
    image: '/work/cayano.webp',
    imageSize: [1200, 900],
    imageAlt: 'Cayano homepage with an aerial view of London and a Book a Valuation button',
    summary: 'Property management that puts people first.',
    challenge:
      'A London lettings and management agency works with landlords and tenants, two audiences with very different needs. It wanted one site that serves both well.',
    approach:
      'We gave landlords and tenants their own paths, put valuation booking right in the hero, and built in a property search, all set against full-bleed aerial London imagery.',
    outcome:
      'A clear, modern agency site where every visitor finds their next step quickly.',
    highlights: ['Separate landlord and tenant paths', 'Valuation booking up front', 'Property search'],
  },
];

export const pad = (n: number) => String(n).padStart(2, '0');

export const projectBySlug = (slug: string) => PROJECTS.find((p) => p.slug === slug);
