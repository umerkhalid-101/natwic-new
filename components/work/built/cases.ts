/**
 * Copy and media for the case studies of sites we designed and built from scratch.
 * Headlines quoted from the live sites; stills captured from them, in /public/work/<slug>/.
 */

import type { Beat, PageShot, Media } from '../rich/blocks';

export type BuiltCase = {
  slug: string;
  eyebrow: string;
  title: string;
  /** Word in the title to set in Natwic violet */
  accent: string;
  subtitle: string;
  meta: { k: string; v: string }[];
  hero: Media;
  sides: { image: string; alt: string }[];
  /** Real labels from the site, floating around the hero */
  chips: string[];
  /** Real headlines from the site */
  headlines: string[];
  brief: { title: string; text: string };
  /** The full homepage, scrolled inside a frame */
  full: { image: string; width: number; height: number; alt: string };
  built: { title: string; text: string }[];
  approach: { title: string; text: string; decisions: string[] };
  story: { title: string; intro: string; beats: Beat[] };
  pages: { title: string; items: PageShot[] };
  results: { title: string; text: string; stats: { value: string; unit: string; label: string }[] };
  closing: { headline: string; line: string; message: string };
};

const img = (slug: string, name: string) => `/work/${slug}/${slug}-${name}.webp`;

export const BUILT_CASES: BuiltCase[] = [
  {
    slug: 'unita',
    eyebrow: 'Case study · Web platform',
    title: 'Unita: A business SuperApp, built from a blank page',
    accent: 'Unita:',
    subtitle: 'Unita checks every company against national trade registers before it is listed. We designed and built the platform that makes that trust obvious and makes searching a large directory feel effortless.',
    meta: [
      { k: 'Client', v: 'Unita' },
      { k: 'Industry', v: 'B2B business directory' },
      { k: 'Services', v: 'Product design, Web development, Search UX' },
      { k: 'Scope', v: 'Built from scratch' },
    ],
    hero: { image: img('unita', 'hero'), alt: 'The Unita homepage: Unita is the business SuperApp, with phone screens of verified listings.' },
    sides: [
      { image: img('unita', 'page-technology'), alt: 'The Unita Technology category page.' },
      { image: img('unita', 'page-country'), alt: 'The Unita country page for Switzerland.' },
    ],
    chips: ['Technology', 'Marketing', 'Business services', 'Finance & legal', 'Property', 'Logistics'],
    headlines: ['Unita is the business SuperApp.', 'Browse by category.', 'What you can find on Unita.', 'How companies connect in Unita.', 'Three ways into Unita.', 'What people ask.', 'Become part of Unita.', 'Browse by industry.'],
    brief: {
      title: 'Trust first. Then search.',
      text: 'Unita lists only companies it has verified against national trade registers. The platform had to make that trust obvious at a glance, and make searching across companies, chambers, creators and countries feel effortless.',
    },
    full: { image: img('unita', 'full'), width: 1200, height: 6750, alt: 'The full Unita homepage, from the hero to the FAQ.' },
    built: [
      { title: 'Search at the center', text: 'One AI-assisted search bar and clear tabs for every kind of listing, so a big directory starts with a single question.' },
      { title: 'Trust in one line', text: 'Verification is explained right in the hero, before anyone has to wonder whether a listing is real.' },
      { title: 'Room to grow', text: 'Category, country and profile pages built as a system, so new markets and listing types slot straight in.' },
    ],
    approach: {
      title: 'Search first. Everything else second.',
      text: 'We built the experience around search, then designed the browsing paths around it: by category, by country, and by type of profile.',
      decisions: ['One AI-assisted search bar as the front door', 'Tabs for companies, chambers, creators and countries', 'A light, calm interface that keeps a large directory easy to scan', 'A joining flow where every profile is reviewed by a person'],
    },
    story: {
      title: 'One question, many ways in.',
      intro: 'We designed the homepage to answer what Unita is, what you can find, and how to join, in that order.',
      beats: [
        { title: 'The promise', text: '“Unita is the business SuperApp.” One search bar, with verified listings right underneath.', media: { image: img('unita', 'hero'), alt: 'The Unita homepage hero with its search bar.' } },
        { title: 'Everywhere it works', text: 'A clear view of every country Unita is present in, so reach is shown, not claimed.', media: { image: img('unita', 'beat-countries'), alt: 'All the countries Unita is present in.' } },
        { title: 'Browse by category', text: 'Industries as big, scannable tiles, for people who know the field but not the company name.', media: { image: img('unita', 'beat-categories'), alt: 'Browse by category on Unita.' } },
        { title: 'What you can find', text: 'Companies, chambers, creators and more, each introduced in plain words.', media: { image: img('unita', 'beat-find'), alt: 'What you can find on Unita.' } },
        { title: 'How companies connect', text: 'The path from finding a company to working with it, laid out step by step.', media: { image: img('unita', 'beat-connect'), alt: 'How companies connect in Unita.' } },
        { title: 'Three ways in', text: '“Three ways into Unita.” A clear choice for every kind of visitor, then the questions people ask.', media: { image: img('unita', 'beat-ways'), alt: 'Three ways into Unita.' } },
      ],
    },
    pages: {
      title: 'One system. Every profile.',
      items: [
        { name: 'Companies', headline: 'This Week on Unita', line: 'An editorial front page for the directory, with new companies every week.', image: img('unita', 'page-companies') },
        { name: 'Categories', headline: 'Browse by industry', line: 'Every industry on one page, grouped so it is easy to scan.', image: img('unita', 'page-categories') },
        { name: 'Category', headline: 'Technology', line: 'A category page with top matches, from SaaS to cybersecurity.', image: img('unita', 'page-technology') },
        { name: 'Country', headline: 'Switzerland', line: 'A country page with an economy snapshot alongside its listings.', image: img('unita', 'page-country') },
        { name: 'Artists', headline: 'Artists', line: 'Approved creators and their work, in the same system as companies.', image: img('unita', 'page-artists') },
        { name: 'Join', headline: 'Become part of Unita.', line: 'One short submission, reviewed by a person, with the invite sent by email.', image: img('unita', 'page-join') },
      ],
    },
    results: {
      title: 'Live, and ready to grow.',
      text: 'A credible, easy-to-use platform that is already live across eight countries and ready to grow one verified listing at a time.',
      stats: [
        { value: '8', unit: 'countries', label: 'Live at launch' },
        { value: '9', unit: 'categories', label: 'To browse by industry' },
        { value: '3', unit: 'ways in', label: 'For every kind of visitor' },
        { value: '1', unit: 'search bar', label: 'At the center of it all' },
      ],
    },
    closing: { headline: 'Building a platform people need to trust? Let’s design it.', line: 'We design and build products and websites for startups and SaaS teams worldwide.', message: 'We saw the Unita case study. We are building a platform too.' },
  },
  {
    slug: 'breakthirty',
    eyebrow: 'Case study · Marketing agency',
    title: 'Breakthirty: A broad offer, made simple, built from scratch',
    accent: 'Breakthirty:',
    subtitle: 'A growth agency for Shopify and Amazon sellers offers a long list of services. We designed and built a site that presents all of it without overwhelming the store owners it is for.',
    meta: [
      { k: 'Client', v: 'Breakthirty' },
      { k: 'Industry', v: 'E-commerce growth agency' },
      { k: 'Services', v: 'Web design, Development, Conversion' },
      { k: 'Scope', v: 'Built from scratch' },
    ],
    hero: { image: img('breakthirty', 'hero'), alt: 'The Breakthirty homepage: We Help You Focus on Growth While We Handle The Grind!' },
    sides: [
      { image: img('breakthirty', 'page-shopify'), alt: 'The Breakthirty Shopify development page.' },
      { image: img('breakthirty', 'page-amazon'), alt: 'The Breakthirty Amazon Seller Central page.' },
    ],
    chips: ['Shopify development', 'CRO', 'SEO', 'Amazon Seller Central', 'Paid search & social', 'Email marketing'],
    headlines: ['Focus on growth, not the grind.', 'Services we offer.', 'Explore our Freemium Services.', 'Unlock Shopify’s full potential.', 'Convert more, earn more.', 'Climb the search engine ranks.', 'Craft emails that convert.', 'Maximize Ad Spend.'],
    brief: {
      title: 'Six services. One clear promise.',
      text: 'Breakthirty helps Shopify and Amazon sellers grow, and offers a long list of services to do it. The site needed to present all of it without overwhelming the store owners it is for, and give every visitor an easy first step.',
    },
    full: { image: img('breakthirty', 'full'), width: 1200, height: 4523, alt: 'The full Breakthirty homepage, from the hero to the contact form.' },
    built: [
      { title: 'One promise up top', text: '“Focus on growth, not the grind.” Every visitor knows what the agency does before they scroll.' },
      { title: 'Services you can browse', text: 'Six services grouped into one easy-to-browse set, each with a page of its own.' },
      { title: 'A low-pressure way in', text: 'Free audits as a first step, so store owners can try the agency before they commit.' },
    ],
    approach: {
      title: 'One promise. Then the proof.',
      text: 'We led with a single promise, grouped the services so they are easy to browse, and gave every service its own page that ends in a conversation.',
      decisions: ['A bright, confident visual style', 'A homepage that leads with one promise', 'Free audits as the easiest first step', 'A service page template that works for all six services'],
    },
    story: {
      title: 'From promise to conversation.',
      intro: 'We designed the homepage to move store owners from one clear promise to an easy first step.',
      beats: [
        { title: 'The promise', text: '“We Help You Focus on Growth While We Handle The Grind!” The whole offer, in one line.', media: { image: img('breakthirty', 'hero'), alt: 'The Breakthirty homepage hero.' } },
        { title: 'Every service, at a glance', text: '“Services we offer.” Six services, grouped so owners find theirs quickly.', media: { image: img('breakthirty', 'beat-services'), alt: 'Services we offer on Breakthirty.' } },
        { title: 'Brands that trust them', text: 'A logo row of brands they have worked with, right where visitors start to wonder.', media: { image: img('breakthirty', 'beat-trusted'), alt: 'Trusted by brands worldwide.' } },
        { title: 'A free first step', text: '“Explore our Freemium Services.” Free audits make it easy to start.', media: { image: img('breakthirty', 'beat-freemium'), alt: 'Explore our Freemium Services.' } },
        { title: 'Each service, its own story', text: 'Shopify, conversion, SEO, email and ads, each introduced with a short, confident headline.', media: { image: img('breakthirty', 'beat-shopify'), alt: 'Unlock Shopify’s full potential.' } },
        { title: 'Let’s talk', text: '“Let’s connect and discuss.” Every path ends in a short form.', media: { image: img('breakthirty', 'beat-contact'), alt: 'Let’s connect and discuss on Breakthirty.' } },
      ],
    },
    pages: {
      title: 'Six services. One template.',
      items: [
        { name: 'Shopify development', headline: 'Make your shopify store a revenue-generating machine', line: 'A service page that shows the work and the impact.', image: img('breakthirty', 'page-shopify') },
        { name: 'CRO', headline: 'Get more conversions, not just traffic', line: 'The same template, tuned for conversion work.', image: img('breakthirty', 'page-cro') },
        { name: 'SEO', headline: 'Get More Traffic to Your Website', line: 'Search services, explained in plain words.', image: img('breakthirty', 'page-seo') },
        { name: 'Amazon Seller Central', headline: 'Make Your Products Stand Out and Sell on Amazon', line: 'A page for Amazon sellers, from listings to A+ content.', image: img('breakthirty', 'page-amazon') },
        { name: 'Blog', headline: 'Blogs', line: 'A home for the agency’s articles and updates.', image: img('breakthirty', 'page-blog') },
        { name: 'Contact', headline: 'Get in touch', line: 'A simple way to start the conversation.', image: img('breakthirty', 'page-contact') },
      ],
    },
    results: {
      title: 'A broad offer, made simple.',
      text: 'A bright, confident site that explains a broad offer simply and gives every visitor an easy first step.',
      stats: [
        { value: '6', unit: 'services', label: 'Each with a page of its own' },
        { value: '1', unit: 'template', label: 'Behind every service page' },
        { value: '1', unit: 'promise', label: 'Leading the homepage' },
        { value: 'Free', unit: 'audits', label: 'As the easiest first step' },
      ],
    },
    closing: { headline: 'Got a lot to offer? Let’s make it simple.', line: 'We design and build websites for startups, agencies and small businesses worldwide.', message: 'We saw the Breakthirty case study. We offer a lot of services too.' },
  },
  {
    slug: 'beyond-hut',
    eyebrow: 'Case study · Remote staffing',
    title: 'Beyond Hut: Making a new kind of hire feel safe, from scratch',
    accent: 'Beyond',
    subtitle: 'Beyond Hut places trained remote staff with UK property businesses. We designed and built a site that makes a new kind of hire feel safe, simple and clearly worth it.',
    meta: [
      { k: 'Client', v: 'Beyond Hut' },
      { k: 'Industry', v: 'Remote property staffing' },
      { k: 'Services', v: 'Web design, Development, Messaging' },
      { k: 'Scope', v: 'Built from scratch' },
    ],
    hero: { image: img('beyond-hut', 'hero'), alt: 'The Beyond Hut homepage: Build Your Dream Property Team, Without The Extra Overhead.' },
    sides: [
      { image: img('beyond-hut', 'page-pricing'), alt: 'The Beyond Hut pricing page.' },
      { image: img('beyond-hut', 'page-real-estate'), alt: 'The Beyond Hut page for estate agencies.' },
    ],
    chips: ['Admin operations', 'Tenant support', 'Listings', 'Appointments', 'Trained remote staff', 'UK property teams'],
    headlines: ['Build Your Dream Property Team.', 'Without The Extra Overhead.', 'Your Shortcut To A More Profitable Agency.', 'The Beyond Hut Way.', 'Talent Placement Roles We Fill.', '4 Simple Steps.', 'Ready to Stop Drowning in Calls?', 'We Go Beyond.'],
    brief: {
      title: 'A new kind of hire. No doubts.',
      text: 'Beyond Hut places trained remote staff with UK property businesses. The site had to make a new kind of hire feel safe, simple and clearly worth it, before anyone booked a call.',
    },
    full: { image: img('beyond-hut', 'full'), width: 1200, height: 5675, alt: 'The full Beyond Hut homepage, from the hero to the final call to action.' },
    built: [
      { title: 'Value up front', text: 'The key benefits in one strip near the top, so the case is made in seconds.' },
      { title: 'The numbers, side by side', text: 'A cost comparison that answers “is this worth it?” before anyone has to ask.' },
      { title: 'Four steps to a team', text: 'A simple journey from the first call to a working team, so hiring feels easy.' },
    ],
    approach: {
      title: 'Answer the doubt. Then show the way.',
      text: 'We put the value first, made the cost case visible, and turned onboarding into four simple steps.',
      decisions: ['Lead with the outcome: a team without the overhead', 'A side-by-side cost comparison', 'A clear list of the roles they fill', 'A separate path for estate agencies and for job seekers'],
    },
    story: {
      title: 'From doubt to booked call.',
      intro: 'We designed the homepage to answer every reason not to hire remotely, one section at a time.',
      beats: [
        { title: 'The promise', text: '“Build Your Dream Property Team, Without The Extra Overhead.” The outcome, before the offer.', media: { image: img('beyond-hut', 'hero'), alt: 'The Beyond Hut homepage hero.' } },
        { title: 'Why it pays', text: '“Your Shortcut To A More Profitable Agency.” The benefits, in one glance.', media: { image: img('beyond-hut', 'beat-shortcut'), alt: 'Your Shortcut To A More Profitable Agency.' } },
        { title: 'The cost, compared', text: 'In-house hiring and Beyond Hut, side by side, so the saving is plain to see.', media: { image: img('beyond-hut', 'beat-cost'), alt: 'The Beyond Hut cost comparison.' } },
        { title: 'Roles they fill', text: '“Talent Placement Roles We Fill.” Every role, so owners can picture their team.', media: { image: img('beyond-hut', 'beat-roles'), alt: 'Talent Placement Roles We Fill.' } },
        { title: 'Four simple steps', text: '“How We Get You Started In Just 4 Simple Steps.” From first call to working team.', media: { image: img('beyond-hut', 'beat-steps'), alt: 'How We Get You Started In Just 4 Simple Steps.' } },
        { title: 'The nudge', text: '“Ready to Stop Drowning in Calls?” A closing question that speaks to the real pain.', media: { image: img('beyond-hut', 'beat-cta'), alt: 'Ready to Stop Drowning in Calls?' } },
      ],
    },
    pages: {
      title: 'One message. Every audience.',
      items: [
        { name: 'Estate agencies', headline: 'Build Your Estate Team for 70 % Less.', line: 'A dedicated page for estate agencies and the pressures they feel.', image: img('beyond-hut', 'page-real-estate') },
        { name: 'Pricing', headline: 'Pricing That Doesn’t Make You Think Twice.', line: 'Clear plans with a short FAQ, so pricing never slows a decision.', image: img('beyond-hut', 'page-pricing') },
        { name: 'About', headline: 'We Go Beyond. That’s the Difference.', line: 'The mission and values behind the team.', image: img('beyond-hut', 'page-about') },
        { name: 'Job seekers', headline: 'Smart Careers Start Here.', line: 'A separate path for the people Beyond Hut places.', image: img('beyond-hut', 'page-job-seekers') },
        { name: 'Get started', headline: 'Streamline your sales, Scale with confidence.', line: 'A focused page to book the first call.', image: img('beyond-hut', 'page-get-started') },
        { name: 'Blog', headline: 'Stay Updated With Stories That Matter', line: 'Articles for agency owners, in the same system.', image: img('beyond-hut', 'page-blog') },
      ],
    },
    results: {
      title: 'Worth it, at a glance.',
      text: 'A calm, trustworthy site that answers “is this worth it?” before anyone has to ask.',
      stats: [
        { value: '4', unit: 'steps', label: 'From first call to working team' },
        { value: '2', unit: 'audiences', label: 'Agencies and job seekers' },
        { value: '1', unit: 'comparison', label: 'That makes the cost case' },
        { value: '1', unit: 'promise', label: 'Leading the homepage' },
      ],
    },
    closing: { headline: 'Selling something new? Let’s make it feel safe.', line: 'We design and build websites for startups and small businesses worldwide.', message: 'We saw the Beyond Hut case study. Our offer is new to people too.' },
  },
  {
    slug: 'cayano',
    eyebrow: 'Case study · Property',
    title: 'Cayano: One site for landlords and tenants, built from scratch',
    accent: 'Cayano:',
    subtitle: 'A London lettings and management agency works with two audiences with very different needs. We designed and built one site that serves both well.',
    meta: [
      { k: 'Client', v: 'Cayano' },
      { k: 'Industry', v: 'London lettings agency' },
      { k: 'Services', v: 'Web design, Development, Property search' },
      { k: 'Scope', v: 'Built from scratch' },
    ],
    hero: { image: img('cayano', 'hero'), alt: 'The Cayano homepage: Effortless management. Comfortable living., over an aerial view of London.' },
    sides: [
      { image: img('cayano', 'page-landlords'), alt: 'The Cayano page for landlords.' },
      { image: img('cayano', 'page-listing'), alt: 'A Cayano property listing in Greenwich.' },
    ],
    chips: ['Lettings', 'Property management', 'Trusted local expertise', 'Reliable tenant placement', 'Responsive maintenance', 'Transparent reporting'],
    headlines: ['Effortless management.', 'Comfortable living.', 'Tailored Services for Effortless Living.', 'Our Properties for rent.', 'Because Home Shouldn’t Be a Headache.', 'We treat your property like our own.', 'Start your search with confidence.'],
    brief: {
      title: 'Two audiences. One home.',
      text: 'Cayano works with landlords and tenants, two audiences with very different needs. It wanted one site that serves both well, with valuation booking and property search close at hand.',
    },
    full: { image: img('cayano', 'full'), width: 1200, height: 4153, alt: 'The full Cayano homepage, from the hero to customer reviews.' },
    built: [
      { title: 'Two clear paths', text: 'Landlords and tenants each get their own path, from the first screen.' },
      { title: 'Valuation up front', text: 'Valuation booking sits right in the hero, the step landlords look for first.' },
      { title: 'Search built in', text: 'A property search and listing pages, so tenants can browse without leaving the site.' },
    ],
    approach: {
      title: 'Two paths. One feeling.',
      text: 'We gave landlords and tenants their own paths, put the key actions up front, and set it all against full-bleed aerial London imagery.',
      decisions: ['Separate landlord and tenant journeys', 'Valuation booking in the hero', 'Property search and listing pages', 'Full-bleed aerial London imagery'],
    },
    story: {
      title: 'Every visitor, their next step.',
      intro: 'We designed the homepage so landlords and tenants each find their next step quickly.',
      beats: [
        { title: 'The promise', text: '“Effortless management. Comfortable living.” A line for landlords and a line for tenants.', media: { image: img('cayano', 'hero'), alt: 'The Cayano homepage hero.' } },
        { title: 'What they do', text: '“Tailored Services for Effortless Living.” Lettings and property management, side by side.', media: { image: img('cayano', 'beat-services'), alt: 'Tailored Services for Effortless Living.' } },
        { title: 'Homes to rent', text: '“Our Properties for rent.” Real listings, right on the homepage.', media: { image: img('cayano', 'beat-properties'), alt: 'Our Properties for rent on Cayano.' } },
        { title: 'Why Cayano', text: '“Because Home Shouldn’t Be a Headache.” Local expertise, tenant placement, maintenance, reporting and communication.', media: { image: img('cayano', 'beat-headache'), alt: 'Because Home Shouldn’t Be a Headache.' } },
        { title: 'What customers say', text: 'Reviews close the page, so trust comes from other landlords and tenants.', media: { image: img('cayano', 'beat-reviews'), alt: 'What our customers saying on Cayano.' } },
      ],
    },
    pages: {
      title: 'Two journeys. One site.',
      items: [
        { name: 'Landlords', headline: 'We treat your property like our own.', line: 'Why to let through Cayano, with landlord fees laid out clearly.', image: img('cayano', 'page-landlords') },
        { name: 'Tenants', headline: 'Register as a Tenant', line: 'A path for tenants to start their search with confidence.', image: img('cayano', 'page-tenants') },
        { name: 'Properties', headline: 'Properties', line: 'Every property to rent, in one searchable list.', image: img('cayano', 'page-properties') },
        { name: 'Listing', headline: 'Flat Tyler Street Greenwich, London, SE10', line: 'A listing page with photos, details and an overview.', image: img('cayano', 'page-listing') },
        { name: 'About', headline: 'About Us', line: 'The team’s promise: make living in their homes better.', image: img('cayano', 'page-about') },
        { name: 'Report an issue', headline: 'Report an issue', line: 'A simple form for tenants when something needs fixing.', image: img('cayano', 'page-inquire') },
      ],
    },
    results: {
      title: 'Every visitor, served.',
      text: 'A clear, modern agency site where every visitor finds their next step quickly.',
      stats: [
        { value: '2', unit: 'journeys', label: 'One for landlords, one for tenants' },
        { value: '5', unit: 'promises', label: 'Behind “Why Cayano”' },
        { value: '1', unit: 'search', label: 'For every property to rent' },
        { value: '4', unit: 'homes', label: 'Featured right on the homepage' },
      ],
    },
    closing: { headline: 'Serving more than one audience? Let’s give each a path.', line: 'We design and build websites for startups and small businesses worldwide.', message: 'We saw the Cayano case study. We serve more than one audience too.' },
  },
];

export const builtCaseBySlug = (slug: string) => BUILT_CASES.find((c) => c.slug === slug);
