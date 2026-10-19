/**
 * Copy and media for the Juno case study at /work/juno.
 * Media lives in /public/work/juno/. To add a video, drop the file in that folder
 * and set its `video` path here; the still stays as the poster.
 * Anything in [TODO: ...] is a placeholder and renders visibly.
 */

const DIR = '/work/juno';

import type { Media } from '../rich/blocks';
export type { Media };

export const HERO = {
  eyebrow: 'Case Study · AI SaaS',
  title: 'Juno: Turning an abstract AI product into a story buyers get in 30 seconds',
  subtitle: 'Juno had a powerful AI product and a site that undersold it. We rebuilt the story, the design system and all nine pages around one idea: show the work, don’t describe it.',
  meta: [
    { k: 'Client', v: 'Juno' },
    { k: 'Industry', v: 'AI / B2B SaaS' },
    { k: 'Services', v: 'Brand direction, Web design, Design system, Development' },
    { k: 'Timeline', v: '1 week' },
  ],
  media: {
    image: `${DIR}/juno-homepage-hero.webp`,
    video: null,
    file: 'juno-homepage-hero.mp4 (16:9)',
    alt: 'The Juno homepage hero: a glowing mascot orbited by tasks like Investor update and Triage 6 bugs, above the headline Knows your company. Gets things done.',
  } as Media,
};

export const CHALLENGE = {
  text: 'Juno had a powerful product and a website that didn’t explain it. “AI assistant” is a crowded, vague category, and B2B buyers need to understand a product like this and trust it before they hand it real work.',
  before: [
    { image: `${DIR}/juno-before-home.webp`, video: null, file: 'juno-before-home.webp', alt: 'The previous runjuno.ai homepage: the mascot above Knows your company. Gets things done. on a plain dark gradient.' },
    { image: `${DIR}/juno-before-inner.webp`, video: null, file: 'juno-before-inner.webp', alt: 'The previous runjuno.ai features page: So much built in. above a grid of feature cards.' },
  ] as Media[],
};

/** Before and after, shown as a drag slider: the old homepage against ours */
export const SHIFT = {
  before: { image: `${DIR}/juno-before-home.webp`, alt: 'Before: the old runjuno.ai homepage.' },
  after: { image: `${DIR}/juno-homepage-hero.webp`, alt: 'After: the Juno homepage we designed.' },
  intro: 'In one week, we kept the promise and changed everything around it: what visitors see first, how the product proves itself, and how all nine pages hold together.',
  changes: [
    { title: 'Pain before pitch', text: 'The old homepage opened on the promise. Ours opens on the overdue alerts every founder recognizes, then makes Juno the answer.' },
    { title: 'Shown, not told', text: 'Apps, Juno’s own computer and automations now run as live UI in one sequence, so visitors watch the product work.' },
    { title: 'One story, nine pages', text: 'One cast and one design system run through every page, where the old site introduced new sample brands section by section.' },
  ],
};

export const GOALS = [
  'Explain Juno without jargon',
  'Build trust in an AI that acts on your behalf',
  'Feel premium and confident, not like another generic AI landing page',
];

export const APPROACH = {
  text: 'We started with tone and design guidelines, then designed the homepage, then rolled the system out across all nine pages.',
  decisions: [
    'Dark mode only',
    'A storytelling, animation-heavy homepage',
    'A mascot that animates but never changes shape',
    'Placeholder logos and testimonials so the structure could ship before content was ready',
  ],
};

export const STORY_INTRO = 'We built the homepage to read like a story, not a feature list.';

/** Each beat: what we did, what the old homepage did, and what the page says now */
export const BEATS: { title: string; before: string; text: string; media: Media }[] = [
  {
    title: 'We opened on the pain',
    before: 'The old homepage opened straight on the product promise.',
    text: '“You started a company. Now it runs you.” A pile of overdue Slack, Gmail, HubSpot, and Linear alerts makes the pain instantly familiar.',
    media: { image: `${DIR}/juno-beat-1-chaos.webp`, video: null, file: 'juno-beat-1-chaos.mp4', alt: 'Stacked alert cards from Slack, Gmail, HubSpot and Linear beside the headline You started a company. Now it runs you.' },
  },
  {
    title: 'Then made Juno the answer',
    before: 'The product arrived before the problem did.',
    text: '“What if someone took this off your plate? That’s Juno.”',
    media: { image: `${DIR}/juno-beat-2-reveal.webp`, video: null, file: 'juno-beat-2-reveal.mp4', alt: 'The Juno mascot at the center of a ring of connected app icons, under the headline Finally, someone has the whole picture.' },
  },
  {
    title: 'We showed it working',
    before: 'Juno’s own computer sat near the end of the page, after the integrations.',
    text: 'Apps built from a sentence, Juno’s own computer for tools with no integration, and automations that run on a schedule, back to back.',
    media: { image: `${DIR}/juno-beat-3-computer.webp`, video: null, file: 'juno-beat-3-capabilities.mp4', alt: 'Juno working on its own computer, filling in an app store submission with a live activity log beside it.' },
  },
  {
    title: 'One stack, one teammate',
    before: 'We kept this line from the old site.',
    text: '“Your whole stack. One Juno.” Ask in one tool, get it done in another.',
    media: { image: `${DIR}/juno-beat-4-integrations.webp`, video: null, file: 'juno-beat-4-integrations.mp4', alt: 'Juno connected to Slack, Gmail, Google Drive, Notion, HubSpot, Linear and other tools.' },
  },
  {
    title: 'We turned the FAQ into a demo',
    before: 'The old homepage had no FAQ at all.',
    text: 'Juno answers the questions in a chat, so the FAQ itself demonstrates the product.',
    media: { image: `${DIR}/juno-beat-5-faq.webp`, video: null, file: 'juno-beat-5-faq.mp4', alt: 'A list of questions on the left and Juno answering the selected one in a chat card on the right.' },
  },
  {
    title: 'And closed on action',
    before: 'It ended on “Imagine having Juno on your team.”',
    text: '“Put Juno to work.”',
    media: { image: `${DIR}/juno-beat-6-cta.webp`, video: null, file: 'juno-beat-6-cta.mp4', alt: 'The closing section of the Juno homepage with the headline Put Juno to work and a Request access button.' },
  },
];

/** Extra stills for beat 3, shown as a strip under the main clip */
export const CAPABILITY_STILLS = [
  { image: `${DIR}/juno-beat-3-apps.webp`, alt: 'Imagine it. Make it an app: Juno turning a sentence into a working storefront.', caption: 'Apps from a sentence' },
  { image: `${DIR}/juno-beat-3-computer.webp`, alt: 'Juno’s own computer submitting an app for review.', caption: 'A computer of its own' },
  { image: `${DIR}/juno-beat-3-automations.webp`, alt: 'Set it once. Leave it to Juno: a schedule of automations and a delivered growth report.', caption: 'Automations on a schedule' },
];

export const PAGES = [
  { name: 'Product', headline: 'Inside Juno.', line: 'A full product tour told through one feature launch.', image: `${DIR}/juno-page-product.webp` },
  { name: 'Features', headline: 'So much built in.', line: '16 features in a ⌃⌘J command-palette browser, grouped by what they do for you.', image: `${DIR}/juno-page-features.webp` },
  { name: 'Automations', headline: 'Off your plate. On Juno’s.', line: '12 recurring jobs, framed as worries you can hand off.', image: `${DIR}/juno-page-automations.webp` },
  { name: 'Apps', headline: 'The app your team wishes it had.', line: 'Six working mini-apps, including an ROI calculator that actually calculates.', image: `${DIR}/juno-page-apps.webp` },
  { name: 'Download', headline: 'Keep Juno close.', line: 'The keyboard shortcut is the hero, not the app icon.', image: `${DIR}/juno-page-download.webp` },
  { name: 'Contact', headline: 'Let’s talk.', line: 'A form styled like writing an email.', image: `${DIR}/juno-page-contact.webp` },
  { name: 'Privacy and Terms', headline: 'Privacy policy.', line: 'One readable template with a sticky table of contents.', image: `${DIR}/juno-page-privacy.webp` },
];

export const DETAILS: { title: string; text: string; media: Media }[] = [
  { title: 'Needs your yes', text: 'An approval card repeats on every page, so trust is shown, not just claimed.', media: { image: `${DIR}/juno-detail-approval-card.webp`, video: null, file: 'juno-detail-approval-card.webp', alt: 'Juno’s run log for an app store submission, ending in a Needs your yes card asking: Submit Orbit 2.4.0 for app review? with Approve and Review buttons.' } },
  { title: 'One fictional company', text: 'The same people (Maya, Sam, Leo, Priya), customer (Northwind), and launch (Scheduled Reports) run through all nine pages. The old homepage brought in new sample brands section by section.', media: { image: `${DIR}/juno-detail-shared-cast.webp`, video: null, file: 'juno-detail-shared-cast.webp', alt: 'The recurring cast of the Juno site: Maya Chen, Sam Rivera, Leo Park, Priya Shah and the customer Northwind, shown in Slack, HubSpot, Linear and customer update cards.' } },
  { title: 'Live UI instead of screenshots', text: 'Animation explains; it never just decorates.', media: { image: `${DIR}/juno-detail-live-ui.webp`, video: null, file: 'juno-detail-live-ui.mp4', alt: 'Juno’s live command palette, typing Ask Juno to build a launch page, with 16 features grouped by what they do.' } },
  { title: 'Copy voice', text: 'Short, human lines over feature lists.', media: { image: `${DIR}/juno-detail-copy-samples.webp`, video: null, file: 'juno-detail-copy-samples.webp', alt: 'Short headlines from the Juno site: Knows your company. Gets things done. Off your plate. On Juno’s. Keep Juno close. Put Juno to work.' } },
];

/** Taken from the Juno codebase (app/globals.css) */
export const DESIGN_SYSTEM = {
  colors: [
    { name: 'Background', value: '#07090d' },
    { name: 'Surface', value: '#0e1218' },
    { name: 'Surface 2', value: '#151a22' },
    { name: 'Text', value: '#f4f6f8' },
    { name: 'Muted', value: '#9aa6b8' },
    { name: 'Blue', value: '#324cff' },
    { name: 'Cyan', value: '#50e5ff' },
    { name: 'Violet', value: '#8f7cff' },
    { name: 'Success', value: '#3dd68c' },
    { name: 'Warning', value: '#ffb547' },
    { name: 'Danger', value: '#ff6568' },
  ],
  type: [
    { name: 'Display XL', size: '48 to 88px', sample: 'Knows your company.' },
    { name: 'Display L', size: '40 to 64px', sample: 'Put Juno to work.' },
    { name: 'Heading 2', size: '28 to 36px', sample: 'Your whole stack.' },
    { name: 'Heading 3', size: '20px', sample: 'Needs your yes' },
    { name: 'Body', size: '16 to 18px', sample: 'Juno keeps up with your company.' },
    { name: 'Eyebrow', size: '12px', sample: 'JUNO’S COMPUTER' },
  ],
  font: 'Geist Sans and Geist Mono',
  radii: ['8px', '12px', '20px', '28px'],
  motion: [
    { name: 'Snap', curve: 'cubic-bezier(0.3, 0, 0, 1)', use: 'Quick UI responses' },
    { name: 'Base', curve: 'cubic-bezier(0.2, 0.8, 0.2, 1)', use: 'Most transitions' },
    { name: 'Calm', curve: 'cubic-bezier(0.16, 1, 0.3, 1)', use: 'Large, story-scale moves' },
  ],
  components: ['Task cards', 'Approval cards', 'Chat mockups'],
  /** Core components, shown with real shots from the site */
  shots: [
    { name: 'Approval cards', image: `${DIR}/juno-detail-approval-card.webp`, alt: 'An approval card asking Submit Orbit 2.4.0 for app review?, under Juno’s run log.' },
    { name: 'Task cards', image: `${DIR}/juno-detail-shared-cast.webp`, alt: 'Task and status cards from Slack, HubSpot, Linear and a customer update.' },
    { name: 'Chat mockups', image: `${DIR}/juno-beat-5-faq.webp`, alt: 'Juno answering a question in a chat card.' },
  ],
};

export const RESULTS = {
  line: 'The Juno team loved it.',
  // DRAFT: wording pending Zain's approval before launch.
  quote: 'Our product was hard to explain, and our old site made people work to get it. Natwic turned it into a story buyers understand in seconds, and they rebuilt all nine pages in a week.',
  author: 'Zain',
  role: 'CTO, Juno',
  /** Delivery facts from the project. Swap in live metrics once Juno has data. */
  stats: [
    { value: '1', unit: 'week', label: 'From kickoff to a launch-ready site' },
    { value: '9', unit: 'pages', label: 'Rebuilt on one design system' },
    { value: '6', unit: 'beats', label: 'In a homepage told as a story' },
    { value: '1', unit: 'cast', label: 'Running through every page' },
  ],
};

export const CLOSING = {
  headline: 'Have a product that’s hard to explain? Let’s make it obvious.',
  line: 'We design and build websites for startups and SaaS teams worldwide.',
};

/** Real headlines from the Juno site, for the marquee */
export const HEADLINES = [
  'Knows your company.', 'Gets things done.', 'You started a company. Now it runs you.', 'That’s Juno.',
  'Imagine it. Make it an app.', 'Set it once. Leave it to Juno.', 'Your whole stack. One Juno.', 'Off your plate. On Juno’s.',
  'So much built in.', 'Keep Juno close.', 'Questions, answered.', 'Put Juno to work.',
];

/** Tasks that orbit Juno in its own hero */
export const TASKS = ['Investor update', 'Triage 6 bugs', 'Release notes to #launch', 'Follow up with Northwind', 'Weekly metrics report', 'Answer 4 setup questions'];

/** Side images for the hero stage */
export const HERO_SIDES = {
  left: { image: `${DIR}/juno-detail-live-ui.webp`, alt: 'Juno’s command palette with 16 features.' },
  right: { image: `${DIR}/juno-detail-approval-card.webp`, alt: 'Juno asking for approval before submitting an app.' },
};
