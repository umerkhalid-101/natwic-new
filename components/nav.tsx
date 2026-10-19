/** In-app navigation: real <a href> links for crawlers, plain clicks handled without a page load. */

import React, { createContext, useContext } from 'react';

// Real links for crawlers; plain clicks stay in the app
export const spaClick = (go: () => void) => (e: React.MouseEvent) => {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
  e.preventDefault();
  go();
};

/** Opens an internal path ("/work/unita") inside the app. Provided by App. */
export const NavContext = createContext<(path: string) => void>(() => {});
export const useNav = () => useContext(NavContext);

type LinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { href: string };

/** An internal link. `onClick` runs first (closing a menu, saving a brief) before the page changes. */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(({ href, onClick, ...rest }, ref) => {
  const go = useNav();
  return (
    <a
      ref={ref}
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) spaClick(() => go(href))(e);
      }}
      {...rest}
    />
  );
});
Link.displayName = 'Link';
