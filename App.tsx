import React, { useState, useEffect, lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Partners } from './components/Partners';
import { WhyUs } from './components/WhyUs';
import { Services } from './components/Services';
import { Stats } from './components/Stats';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { Seo } from './components/Seo';
import { Loader } from './components/Loader';
import { lazyPage } from './components/lazyPage';
import { initSmoothScroll, destroySmoothScroll, scrollToTop } from './components/smoothScroll';
import { NavContext } from './components/nav';
import { ROUTE_META, View, viewFromPath, slugFromPath, caseMeta, serviceMeta } from './seo';

// The scroll universe (and three.js inside it) loads as its own chunk
const Universe = lazy(() => import('./components/Universe').then(m => ({ default: m.Universe })));
// Same footprint as the real section, so nothing jumps while it loads
const UniverseFallback = () => <section id="work" aria-hidden className="relative h-[1090vh] bg-[#050505]" style={{ marginBottom: '-70vh' }} />;
const Contact = lazyPage(() => import('./components/Contact'), (m) => m.Contact);
const Studio = lazyPage(() => import('./components/Studio'), (m) => m.Studio);
const Privacy = lazyPage(() => import('./components/Privacy'), (m) => m.Privacy);
const Terms = lazyPage(() => import('./components/Terms'), (m) => m.Terms);
const WorkIndex = lazyPage(() => import('./components/work/WorkPages'), (m) => m.WorkIndex);
const CaseStudyPage = lazyPage(() => import('./components/work/WorkPages'), (m) => m.CaseStudyPage);
const ServicesIndex = lazyPage(() => import('./components/services/ServicePages'), (m) => m.ServicesIndex);
const ServicePage = lazyPage(() => import('./components/services/ServicePages'), (m) => m.ServicePage);
const JunoCaseStudy = lazyPage(() => import('./components/work/juno/JunoCaseStudy'), (m) => m.JunoCaseStudy);
const JournalIndex = lazyPage(() => import('./components/journal/JournalPages'), (m) => m.JournalIndex);
const JournalTeaser = lazyPage(() => import('./components/journal/JournalTeaser'), (m) => m.JournalTeaser);
const JournalPost = lazyPage(() => import('./components/journal/JournalPages'), (m) => m.JournalPost);

/** Loads the code for the page at `pathname`, so the first render matches the pre-rendered HTML */
export const preloadRoute = (pathname: string) => {
  const view = viewFromPath(pathname);
  const slug = slugFromPath(pathname);
  const pages: { preload: () => Promise<void> }[] = {
    home: [JournalTeaser],
    studio: [Studio, JournalTeaser],
    work: slug ? [slug === 'juno' ? JunoCaseStudy : CaseStudyPage] : [WorkIndex, JournalTeaser],
    services: [slug ? ServicePage : ServicesIndex],
    journal: [slug ? JournalPost : JournalIndex],
    contact: [Contact],
    privacy: [Privacy],
    terms: [Terms],
  }[view];
  return Promise.all(pages.map((p) => p.preload())).catch(() => {});
};

// `initialView` lets the build-time pre-renderer render each page
const App: React.FC<{ initialView?: View; initialSlug?: string | null }> = ({ initialView = 'home', initialSlug = null }) => {
  const [view, setView] = useState<View>(initialView);
  const [slug, setSlug] = useState<string | null>(initialSlug);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initSmoothScroll();
    return destroySmoothScroll;
  }, []);

  // Handle URL synchronization on mount and popstate
  useEffect(() => {
    const handleUrlChange = () => {
      setView(viewFromPath(window.location.pathname));
      setSlug(slugFromPath(window.location.pathname));
    };

    // Check initial URL
    handleUrlChange();

    // Listen for browser back/forward navigation
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  // Every internal link lands here, so Google sees one real path per page
  const go = (path: string) => {
    const pathname = path.split(/[?#]/)[0] || '/';
    setView(viewFromPath(pathname));
    setSlug(slugFromPath(pathname));
    if (pathname !== window.location.pathname) window.history.pushState({}, '', pathname);
    scrollToTop();
  };

  const changeView = (newView: View) => go(newView === 'home' ? '/' : `/${newView}`);
  // Journal posts live at /journal/<slug>
  const openPost = (next: string) => go(`/journal/${next}`);

  return (
    <NavContext.Provider value={go}>
    <div className="relative min-h-screen bg-white text-black selection:bg-[#703FEC] selection:text-white">
      
      {/* Loading Screen Overlay */}
      <AnimatePresence>
        {isLoading && <Loader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>


      <Navbar currentView={view} />
      
      <main>
        {view === 'home' && (
          <>
            <Seo {...ROUTE_META.home} view="home" />
            <Hero />
            <Partners />
            <WhyUs />
            <Suspense fallback={<UniverseFallback />}>
              <Universe />
            </Suspense>
            <Services />
            <Stats />
            <Pricing />
            <Suspense fallback={null}>
              <JournalTeaser onOpen={openPost} onAll={() => changeView('journal')} />
            </Suspense>
            <FAQ />
          </>
        )}
        
        <Suspense fallback={null}>
          {view === 'studio' && (
            <>
              <Seo {...ROUTE_META.studio} view="studio" />
              <Studio />
              <JournalTeaser onOpen={openPost} onAll={() => changeView('journal')} />
            </>
          )}

          {view === 'work' && !slug && (
            <>
              <Seo {...ROUTE_META.work} view="work" />
              <WorkIndex />
              <JournalTeaser onOpen={openPost} onAll={() => changeView('journal')} />
            </>
          )}

          {view === 'work' && slug && (
            <>
              <Seo {...caseMeta(slug)} view={`work/${slug}`} />
              {slug === 'juno' ? <JunoCaseStudy /> : <CaseStudyPage slug={slug} />}
            </>
          )}

          {view === 'services' && !slug && (
            <>
              <Seo {...ROUTE_META.services} view="services" />
              <ServicesIndex />
            </>
          )}

          {view === 'services' && slug && (
            <>
              <Seo {...serviceMeta(slug)} view={`services/${slug}`} />
              <ServicePage slug={slug} />
            </>
          )}

          {view === 'journal' && !slug && (
            <>
              <Seo {...ROUTE_META.journal} view="journal" />
              <JournalIndex onOpen={openPost} />
            </>
          )}

          {view === 'journal' && slug && (
            <JournalPost slug={slug} onOpen={openPost} />
          )}

          {view === 'contact' && (
            <>
              <Seo {...ROUTE_META.contact} view="contact" />
              <Contact isStandalone={true} />
            </>
          )}

          {view === 'privacy' && (
            <>
              <Seo {...ROUTE_META.privacy} view="privacy" />
              <Privacy />
            </>
          )}

          {view === 'terms' && (
            <>
              <Seo {...ROUTE_META.terms} view="terms" />
              <Terms />
            </>
          )}
        </Suspense>
      </main>

      <Footer setView={changeView as any} currentView={view} />
    </div>
    </NavContext.Provider>
  );
};

export default App;