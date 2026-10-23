/// <reference types="vite/client" />

declare module 'virtual:journal-index' {
  /** Published journal posts, newest first: just enough to link to them */
  const posts: { slug: string; title: string; date: string }[];
  export default posts;
}

declare module 'virtual:image-sizes' {
  /** [width, height] of each image in public/journal, keyed by its public path */
  const sizes: Record<string, [number, number]>;
  export default sizes;
}
