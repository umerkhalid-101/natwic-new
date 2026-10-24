/** Copy for the service pages; only the lazy-loaded service pages import this. Anything in [BRACKETS] is a placeholder. */

type Block = { title: string; text: string };

export type ServiceContent = {
  slug: string;
  /** The page's one H1, carrying the primary keyword */
  h1: string;
  /** schema.org serviceType */
  serviceType: string;
  intro: string[];
  forWho: Block[];
  included: Block[];
  process: Block[];
  /** One line under 'Contact us for pricing' */
  pricing: string;
  /** Case study slugs to link, 2 to 3 */
  cases: string[];
  faqs: { q: string; a: string }[];
};

const REMOTE_FAQ = {
  q: 'Can we work together if we’re in a different time zone?',
  a: 'Yes. We’re based in Dubai and work remotely with clients in other time zones. We agree on a weekly call time that suits both sides, share progress in writing between calls, and keep everything in one shared project space so you can check in whenever your day starts.',
};

export const SERVICE_CONTENT: ServiceContent[] = [
  {
    slug: 'web-design',
    h1: 'Web design agency for startups',
    serviceType: 'Startup website design',
    intro: [
      'Your website is often the first proof that your startup is real. Investors check it before a meeting, early users check it before they sign up, and future hires check it before they apply. If it’s vague, slow or looks unfinished, people quietly leave.',
      'Natwic is a web design agency for startups. We plan, design and build marketing sites that make a new product easy to understand and easy to try. We work remotely with founders around the world, so you get a focused team on your schedule, wherever you are.',
    ],
    forWho: [
      { title: 'Pre-launch founders', text: 'You have a product taking shape and need a site that explains it clearly, collects a waitlist and looks credible enough to share with investors.' },
      { title: 'Newly funded startups', text: 'You’ve raised and the site you built in a weekend no longer matches the company. You need something that scales with your story and your team.' },
      { title: 'Teams without a designer', text: 'Your engineers are busy on the product. You want one partner to handle the website end to end, from structure and copy direction to design and build.' },
      { title: 'Founders launching on a date', text: 'You have a launch, a demo day or a funding round coming up and need a sharp site shipped on time, without cutting corners on quality.' },
    ],
    included: [
      { title: 'Positioning and structure', text: 'We start with who the site is for and what they need to believe, then plan the pages and the order of sections around that.' },
      { title: 'Copy direction', text: 'Clear headlines and section copy that say what you do in plain words. We draft with you, so the voice still sounds like your team.' },
      { title: 'Custom design', text: 'Layouts, type and color built around your product, not a template. Every page is designed for mobile first, then desktop.' },
      { title: 'Development', text: 'A fast, accessible build with clean code, proper metadata and analytics in place, so the site is ready for search and ready to measure.' },
      { title: 'A CMS you can edit', text: 'Your team can update pages, add blog posts and change copy without waiting on a developer.' },
      { title: 'Launch support', text: 'We handle the go-live checklist with you and stay on for a short period afterward to fix anything that comes up.' },
    ],
    process: [
      { title: 'Discover', text: 'A kickoff call to understand your product, audience and goals. We review your current site, competitors and any brand assets you already have.' },
      { title: 'Plan', text: 'We agree on the sitemap, the content for each page and the scope. You see a clear plan before any design starts.' },
      { title: 'Design', text: 'We design the key pages first, review them with you, then roll the system out across the rest of the site.' },
      { title: 'Build and launch', text: 'We build, test on real devices, connect your CMS and analytics, and launch. You get a short handover so your team knows how to run it.' },
    ],
    pricing: 'Every project starts with a fixed quote based on an agreed scope, so you know the cost before work begins.',
    cases: ['breakthirty', 'beyond-hut', 'cayano'],
    faqs: [
      { q: 'How long does a startup website take?', a: 'Most marketing sites run in focused sprints of two to four weeks. A larger site with many page types or custom features can take longer. We agree on a timeline during planning and build the schedule around your launch date.' },
      { q: 'Do you write the copy?', a: 'We give copy direction for every page and draft headlines and key sections with you. If you need full copywriting, we can include it in the scope.' },
      { q: 'Will we be able to update the site ourselves?', a: 'Yes. We set up a CMS so your team can edit text, swap images and publish new pages or posts without touching code.' },
      { q: 'Do we need a brand identity first?', a: 'No. If you have a logo and colors, we design around them. If you don’t, we can create a lightweight identity alongside the site or run a full branding project first.' },
      { q: 'What happens after launch?', a: 'We stay on for a short support period to fix anything that comes up. After that, we can stay on for ongoing updates, new pages and improvements.' },
      REMOTE_FAQ,
    ],
  },
  {
    slug: 'branding',
    h1: 'Startup branding and brand identity design',
    serviceType: 'Brand identity design',
    intro: [
      'Early on, your brand has one job: make people trust a company they’ve never heard of. A clear identity helps you look established in a pitch, stand out in a crowded market and stay consistent as more people start creating things in your name.',
      'Natwic is a startup branding agency. We design brand identities that are distinctive but practical: a logo, typography, color and a small set of rules your team can actually follow. We work remotely with founders in different countries, so the process fits around your calendar.',
    ],
    forWho: [
      { title: 'New companies', text: 'You have a name and an idea, maybe a placeholder logo, and you want an identity that feels intentional before you launch.' },
      { title: 'Startups that outgrew their look', text: 'The brand you started with no longer matches the product, the market or the price you charge. It’s time for a considered refresh.' },
      { title: 'Founders preparing to raise', text: 'You want your deck, website and product to look like they come from the same confident company when investors see them.' },
      { title: 'Small teams creating content', text: 'Several people make slides, posts and documents. You need simple rules and templates so everything looks consistent without a designer on every task.' },
    ],
    included: [
      { title: 'Brand strategy', text: 'A short workshop to define who you serve, what makes you different and how you want to come across. This guides every design decision.' },
      { title: 'Logo and mark', text: 'A primary logo, a compact mark for small spaces and versions for light and dark backgrounds.' },
      { title: 'Typography and color', text: 'A type pairing and color palette chosen for clarity on screens, with guidance on how to use them together.' },
      { title: 'Visual elements', text: 'Supporting graphics, icon style and image direction so your brand feels like a system rather than just a logo.' },
      { title: 'Brand guidelines', text: 'A concise guide that shows your team how to use the identity correctly, with examples of what to do and what to avoid.' },
      { title: 'Starter templates', text: 'Ready-to-use templates for the things you make most often, such as a pitch deck, social posts or documents.' },
    ],
    process: [
      { title: 'Discover', text: 'We learn about your company, audience and competitors, and agree on the personality and positioning the brand should express.' },
      { title: 'Explore', text: 'We present a small number of distinct creative directions, each with a clear rationale, so you can react to real options.' },
      { title: 'Refine', text: 'We develop the chosen direction into a complete identity, testing it on real applications like your website, deck and social profiles.' },
      { title: 'Deliver', text: 'You receive organized files, guidelines and templates, plus a walkthrough so your team knows how to use everything.' },
    ],
    pricing: 'We quote a fixed price for an agreed scope before we start. If you need a website as well, we can plan both together.',
    cases: ['juno', 'unita', 'breakthirty'],
    faqs: [
      { q: 'How long does a branding project take?', a: 'A focused identity project usually takes a few weeks from kickoff to final files. Larger projects with extensive strategy work or many applications take longer. We share a timeline before we begin.' },
      { q: 'Do you help with naming?', a: 'Our focus is visual identity. If you’re still choosing a name, we can share feedback on your shortlist and how each option might work visually.' },
      { q: 'What files will we receive?', a: 'Logo files in the formats you need for web and print, color and type specifications, brand guidelines and any templates included in the scope.' },
      { q: 'Can you refresh our existing logo instead of replacing it?', a: 'Yes. Sometimes the right move is to keep what people already recognize and make it cleaner and more consistent. We’ll recommend an approach after the discovery stage.' },
      { q: 'Can you design our website too?', a: 'Yes. Doing the brand and the website with one team keeps everything consistent and saves time on handover.' },
      REMOTE_FAQ,
    ],
  },
  {
    slug: 'saas-website-design',
    h1: 'SaaS website design agency',
    serviceType: 'SaaS website design',
    intro: [
      'Selling software online is hard because visitors can’t touch the product. Your website has to explain what it does, show why it matters and make the first step feel easy, usually within a few seconds of someone landing.',
      'Natwic is a SaaS website design agency for early-stage teams. We design and build marketing sites that turn a complex product into a clear story, with real product visuals and a path to sign-up or demo. We work remotely across time zones with SaaS founders wherever they’re based.',
    ],
    forWho: [
      { title: 'SaaS founders before launch', text: 'You’re about to open a beta or launch publicly and need a site that explains the product and captures sign-ups from day one.' },
      { title: 'Products that are hard to explain', text: 'Your product is technical or does a lot. You need help finding the simplest way to describe it and the right visuals to show it.' },
      { title: 'Teams moving upmarket', text: 'You’re starting to sell to larger customers and need pages for security, integrations, pricing and use cases that answer their questions.' },
      { title: 'Product-led growth teams', text: 'Your funnel depends on self-serve sign-ups, so the website has to do the selling and hand people into the product smoothly.' },
    ],
    included: [
      { title: 'Messaging and structure', text: 'We work out the core value, the main use cases and the objections visitors have, then structure the homepage and key pages around them.' },
      { title: 'Product storytelling', text: 'Product screens, short animations and interactive demos that show the product working instead of describing it.' },
      { title: 'Conversion paths', text: 'Clear calls to action for trial, demo or waitlist, designed so every page leads somewhere useful.' },
      { title: 'Pricing and feature pages', text: 'Pricing tables, comparison layouts and feature pages that make plans and differences easy to understand.' },
      { title: 'Scalable page templates', text: 'Reusable templates for use cases, integrations, changelog and blog, so you can add pages as the product grows.' },
      { title: 'Fast, measurable build', text: 'A quick, accessible site with analytics and event tracking in place, so you can see what drives sign-ups.' },
    ],
    process: [
      { title: 'Discover', text: 'We get a product walkthrough, talk about your customers and review your funnel data if you have it.' },
      { title: 'Message', text: 'We agree on the core story, page structure and the product visuals each page needs before design starts.' },
      { title: 'Design', text: 'We design the homepage and key templates first, review them with you, then extend the system to the rest of the site.' },
      { title: 'Build and launch', text: 'We build, connect your CMS and analytics, test sign-up flows end to end, and launch with a short handover.' },
    ],
    pricing: 'You get a fixed quote for an agreed scope before we start, and we can phase larger sites so the most important pages launch first.',
    cases: ['juno', 'unita'],
    faqs: [
      { q: 'Do you design product UI as well as the marketing site?', a: 'Yes. We design product interfaces and dashboards too, and keeping both with one team makes the website and the product feel like one experience.' },
      { q: 'How do you show a product that is still changing?', a: 'We design product visuals that can be updated easily, and favor simplified screens and short loops over detailed screenshots that go stale quickly.' },
      { q: 'Can the site connect to our app and CRM?', a: 'Yes. We can connect sign-up and demo forms to your app, CRM or email tools so leads go straight where your team works.' },
      { q: 'How long does a SaaS website take?', a: 'A focused launch site usually runs in sprints of two to four weeks. Larger sites with many templates take longer. We plan around your launch date.' },
      { q: 'Will our team be able to add pages?', a: 'Yes. We build reusable templates in a CMS so your team can publish new feature, use case and blog pages on their own.' },
      REMOTE_FAQ,
    ],
  },
  {
    slug: 'webflow-nextjs-development',
    h1: 'Webflow development agency and Next.js websites',
    serviceType: 'Website development',
    intro: [
      'A great design only works if it’s built well. Slow pages, broken layouts on phones and a CMS nobody can use undo all the work that went into the design.',
      'Natwic builds marketing sites in Webflow and Next.js. Webflow suits teams who want to edit everything visually. Next.js suits teams who need more control, custom features or a site that lives close to their product code. We help you pick the right one, then build it properly. If you already have a site, we’ll also tell you honestly whether a full rebuild is worth it or whether targeted fixes will get you most of the way there. We work remotely with teams around the world and overlap with your working hours for reviews.',
    ],
    forWho: [
      { title: 'Teams with designs ready', text: 'You already have designs from an in-house designer or another studio and need a reliable team to build them accurately.' },
      { title: 'Marketing teams that want independence', text: 'You want to launch pages and campaigns without waiting on engineering, which usually points to Webflow.' },
      { title: 'Product teams with custom needs', text: 'You need custom functionality, integrations or a site that shares components with your app, which usually points to Next.js.' },
      { title: 'Startups leaving a hard-to-edit site', text: 'Your current site is slow, fragile or locked in a system your team struggles with, and you want to move to something better.' },
    ],
    included: [
      { title: 'Platform recommendation', text: 'An honest recommendation between Webflow and Next.js based on your team, budget and roadmap, not on what we prefer to build.' },
      { title: 'Pixel-accurate build', text: 'Careful implementation of the design across screen sizes, including interactions and animations that stay smooth on phones.' },
      { title: 'CMS setup', text: 'Collections and fields structured around your content, so adding posts, case studies or landing pages is straightforward.' },
      { title: 'Performance and SEO basics', text: 'Optimized images, clean markup, metadata, sitemaps and redirects, so the site is fast and search engines can read it.' },
      { title: 'Integrations', text: 'Forms, analytics, CRM and email tools connected and tested, so leads and data go where they should.' },
      { title: 'Handover and training', text: 'Documentation and a walkthrough so your team can edit and extend the site confidently.' },
    ],
    process: [
      { title: 'Review', text: 'We review your designs or requirements, flag anything that needs clarifying and recommend a platform.' },
      { title: 'Plan', text: 'We agree on the CMS structure, integrations, scope and timeline before building.' },
      { title: 'Build', text: 'We build in stages and share staging links regularly so you can review progress on real devices.' },
      { title: 'Launch', text: 'We set up hosting, domains and redirects, run final checks and launch, then hand over with training.' },
    ],
    pricing: 'We quote a fixed price after reviewing your designs or requirements, so the cost is clear before we start.',
    cases: ['breakthirty', 'cayano', 'beyond-hut'],
    faqs: [
      { q: 'Should we choose Webflow or Next.js?', a: 'Webflow is usually best when a marketing team wants to edit and launch pages visually. Next.js is usually best when you need custom features, deep integrations or shared code with your product. We’ll recommend one after a short review.' },
      { q: 'Can you build from designs made by someone else?', a: 'Yes. We review the files first and raise any gaps, such as missing mobile layouts, before we start.' },
      { q: 'Can you migrate our existing site?', a: 'Yes. We can move content from your current platform, set up redirects from old URLs and keep your search rankings as intact as possible.' },
      { q: 'Who hosts the site?', a: 'Webflow sites are hosted on Webflow. Next.js sites are usually hosted on a platform like Vercel. The accounts are set up in your name so you always own the site.' },
      { q: 'Do you offer ongoing support?', a: 'Yes. After launch, we can stay on for updates, new pages and improvements on a flexible basis.' },
      REMOTE_FAQ,
    ],
  },
  {
    slug: 'website-redesign',
    h1: 'Website redesign services',
    serviceType: 'Website redesign',
    intro: [
      'Companies change faster than their websites. The product has grown, the audience is different and the pricing has moved, but the site still describes the company you were two years ago. Visitors notice, and so do the people you’re trying to hire.',
      'Natwic offers website redesign services for startups and small businesses. We look at what your current site does well, fix what holds it back and rebuild it around who you are today. We plan the move carefully so you keep the search traffic you’ve earned. We work remotely with clients in different countries and time zones.',
    ],
    forWho: [
      { title: 'Outdated sites', text: 'Your site looks dated, is hard to use on phones or no longer reflects the quality of your product.' },
      { title: 'Companies that changed direction', text: 'You’ve pivoted, added products or moved to a new audience, and the site’s structure and message no longer fit.' },
      { title: 'Sites that don’t convert', text: 'People visit but don’t sign up, book or get in touch, and you want to understand why and fix it.' },
      { title: 'Teams stuck with a hard-to-edit site', text: 'Every small change needs a developer, so the site falls behind. You want a modern CMS your team can use.' },
    ],
    included: [
      { title: 'Audit of the current site', text: 'A review of content, structure, performance, analytics and search visibility, so we know what to keep and what to change.' },
      { title: 'New structure and messaging', text: 'A sitemap and page plan built around your current product and audience, with clearer copy direction throughout.' },
      { title: 'Fresh design', text: 'A modern, mobile-first design that fits your brand, or an updated brand if the redesign calls for one.' },
      { title: 'Rebuild on a better platform', text: 'A fast, accessible build on a CMS your team can edit, whether that’s Webflow, Next.js or another fit.' },
      { title: 'SEO-safe migration', text: 'Redirects from old URLs, preserved metadata and a pre-launch checklist to protect the rankings you already have.' },
      { title: 'Post-launch checks', text: 'We monitor the site after launch for broken links, errors and traffic changes, and fix issues quickly.' },
    ],
    process: [
      { title: 'Audit', text: 'We review your current site and data and share what’s working, what isn’t and what we recommend.' },
      { title: 'Plan', text: 'We agree on the new structure, content plan, URL mapping and scope before design begins.' },
      { title: 'Design', text: 'We design the key pages, review them with you and extend the system across the site.' },
      { title: 'Rebuild and launch', text: 'We build, migrate content, set up redirects, test everything and launch, then monitor closely for the first weeks.' },
    ],
    pricing: 'You get a fixed quote after the audit and planning stage, so the cost reflects your actual site rather than a guess.',
    cases: ['cayano', 'beyond-hut', 'breakthirty'],
    faqs: [
      { q: 'Will a redesign hurt our search rankings?', a: 'Not if it’s planned well. We map every important old URL to its new page, keep metadata that performs and check everything before launch. Some short-term movement can happen, and a careful migration keeps it small.' },
      { q: 'Can we keep parts of our current site?', a: 'Yes. If some pages, content or design elements work well, we keep them. A redesign doesn’t have to start from zero.' },
      { q: 'Do we need to rebrand at the same time?', a: 'Not necessarily. Many redesigns work within the existing brand. If the brand is part of the problem, we can refresh it as part of the project.' },
      { q: 'How long does a redesign take?', a: 'It depends on the size of the site. Smaller sites can move in a few weeks, while larger sites with lots of content take longer. We share a timeline after the audit.' },
      { q: 'Can you redesign the site while keeping it live?', a: 'Yes. We build the new site on a staging link while your current site stays up, then switch over on launch day.' },
      REMOTE_FAQ,
    ],
  },
  {
    slug: 'social-media',
    h1: 'Social media management services',
    serviceType: 'Social media management',
    intro: [
      'Social media for business is often the first place people check whether a company is active and worth trusting. A profile that hasn’t posted in months, or posts that look nothing like the website, makes a good product look neglected.',
      'Natwic offers social media management services for startups and small businesses. We plan what to say, design posts that match your brand and keep your channels publishing on a steady schedule. Because we also design websites and brands, everything you post looks like it comes from the same company. We work remotely with clients around the world.',
    ],
    forWho: [
      { title: 'Founders with no time to post', text: 'You know social matters, but running the product comes first. You want someone to own it without needing daily direction from you.' },
      { title: 'Startups after a launch or rebrand', text: 'You have a new brand or website and want your social channels to look the same and keep the momentum going.' },
      { title: 'Small businesses that post now and then', text: 'You post when you remember, it looks different every time, and you want a consistent presence that brings people back.' },
      { title: 'Teams with a marketing lead but no designer', text: 'Someone plans the content, but there’s no one to turn ideas into polished, on-brand posts every week.' },
    ],
    included: [
      { title: 'Social media strategy', text: 'Which channels to focus on, who you’re talking to, and the handful of topics you want to be known for.' },
      { title: 'Content calendar', text: 'A monthly plan of posts, agreed with you in advance, so nothing goes out that you haven’t seen.' },
      { title: 'On-brand post design', text: 'Graphics, carousels and short videos designed around your brand, with templates your team can reuse.' },
      { title: 'Captions and copy', text: 'Clear captions in your voice, written for each platform rather than copied across all of them.' },
      { title: 'Scheduling and publishing', text: 'We schedule and publish posts on your accounts, so your channels stay active every week.' },
      { title: 'Monthly reporting', text: 'A short report on what was posted, what performed best and what we’ll change next month.' },
    ],
    process: [
      { title: 'Discover', text: 'We review your current channels, audience and competitors, and agree on goals and the channels worth your time.' },
      { title: 'Plan', text: 'We set up the content pillars, tone and visual templates, then build the first month’s calendar for your approval.' },
      { title: 'Create', text: 'We design and write each month’s posts in batches, and you review and approve them before anything goes live.' },
      { title: 'Publish and improve', text: 'We schedule and publish, track what works, and adjust the plan every month.' },
    ],
    pricing: 'Social media management runs on a monthly plan with an agreed number of posts and channels, so you know the cost each month before we start.',
    cases: ['juno', 'breakthirty'],
    faqs: [
      { q: 'Which social media platforms do you manage?', a: 'We focus on the channels that matter for your business, usually LinkedIn and Instagram, with X, TikTok or Facebook when your audience is there. We recommend where to start during the strategy stage.' },
      { q: 'Do we approve posts before they go live?', a: 'Yes. You see each month’s calendar and posts in advance and approve them before anything is published.' },
      { q: 'Do you reply to comments and messages?', a: 'No. Your team handles comments and direct messages, because you know your customers and products best. We focus on planning, creating and publishing the content, and we can suggest simple reply guidelines so responses stay on brand.' },
      { q: 'Do you run paid social ads?', a: 'No. We focus on organic social media for business: the strategy, the posts and steady publishing. If you run ads with another partner, our post designs and templates can be reused for them.' },
      { q: 'Can you create content if we don’t have a brand yet?', a: 'Yes. We can set up a simple visual style before the first posts, or run a full branding project first so social, website and product all match.' },
      { q: 'How soon will we see results?', a: 'Most accounts need a few months of consistent posting before engagement builds. We report monthly so you can see what’s working and where the plan is changing.' },
      REMOTE_FAQ,
    ],
  },
];

export const contentFor = (slug: string) => SERVICE_CONTENT.find((s) => s.slug === slug);

/** The /services hub */
export const HUB_CONTENT = {
  h1: 'Web design and branding services',
  intro: 'Natwic designs and builds websites and brands for startups, SaaS teams and small businesses. Pick the service that fits where you are now, or combine them into one project with one team.',
  remote: [
    { title: 'Remote by default', text: 'We’re based in Dubai and work with clients in other countries. Everything runs through shared files, staging links and written updates, so you can follow progress at any time.' },
    { title: 'Calls that fit your day', text: 'We agree on a regular call time that overlaps with your working hours, wherever you are.' },
    { title: 'One team, start to finish', text: 'The same people plan, design and build your project, so nothing gets lost between handovers.' },
  ],
};
