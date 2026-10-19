/// <reference types="vite/client" />

declare module 'virtual:journal-index' {
  /** Published journal posts, newest first: just enough to link to them */
  const posts: { slug: string; title: string; date: string }[];
  export default posts;
}
