/**
 * Journal bylines that belong to real people on the team (same facts as /studio).
 * A post whose author isn't listed here gets no author box and stays a plain byline.
 */
export interface Author { name: string; role: string; focus: string; image: string }

const TEAM: Author[] = [
  { name: 'Umer Khalid', role: 'Founder', focus: 'Design & development', image: '/team/umer.webp' },
  { name: 'Faiq Ahmed', role: 'Co-founder', focus: 'Content, SEO & ads', image: '/team/faiq.webp' },
  { name: 'Hassan Daniyal Ghauri', role: 'Head of Business', focus: 'Partnerships', image: '/team/hassan.webp' },
  { name: 'Tanseer Khoso', role: 'Head of Design', focus: 'Brand design', image: '/team/tanseer.webp' },
];

/** Matches a full name or a first name, so `author: Umer` works too */
export const authorFor = (byline?: string): Author | undefined => {
  const b = byline?.trim().toLowerCase();
  if (!b) return undefined;
  return TEAM.find((a) => a.name.toLowerCase() === b || a.name.split(' ')[0].toLowerCase() === b);
};
