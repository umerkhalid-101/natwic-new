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
import { initSmoothScroll, destroySmoothScroll, scrollToTop } from './components/smoothScroll';
import { ROUTE_META, View, viewFromPath, slugFromPath, caseMeta } from './seo';

// The scroll universe (and three.js inside it) loads as its own chunk
const Universe = lazy(() => import('./components/Universe').then(m => ({ default: m.Universe })));
// Same footprint as the real section, so nothing jumps while it loads
const UniverseFallback = () => <section id="work" aria-hidden className="relative h-[1090vh] bg-[#050505]" style={{ marginBottom: '-70vh' }} />;
const Contact = lazy(() => import('./components/Contact').then(m => ({ default: m.Contact })));
const Studio = lazy(() => import('./components/Studio').then(m => ({ default: m.Studio })));
const Privacy = lazy(() => import('./components/Privacy').then(m => ({ default: m.Privacy })));
const Terms = lazy(() => import('./components/Terms').then(m => ({ default: m.Terms })));
const WorkIndex = lazy(() => import('./components/work/WorkPages').then(m => ({ default: m.WorkIndex })));
const CaseStudyPage = lazy(() => import('./components/work/WorkPages').then(m => ({ default: m.CaseStudyPage })));

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

  // Custom setter that updates the URL so Google can index specific pages
  const changeView = (newView: View) => {
    setView(newView);
    setSlug(null);
    const path = newView === 'home' ? '/' : `/${newView}`;
    window.history.pushState({}, '', path);
    scrollToTop();
  };

  // Case studies live at /work/<slug>
  const openCase = (next: string) => {
    setView('work');
    setSlug(next);
    window.history.pushState({}, '', `/work/${next}`);
    scrollToTop();
  };

  return (
    <div className="relative min-h-screen bg-white text-black selection:bg-[#703FEC] selection:text-white">
      
      {/* Loading Screen Overlay */}
      <AnimatePresence>
        {isLoading && <Loader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>


      <Navbar setView={changeView as any} currentView={view as 'home' | 'contact' | 'studio'} />
      
      <main>
        {view === 'home' && (
          <>
            <Seo {...ROUTE_META.home} view="home" />
            <Hero setView={changeView} />
            <Partners />
            <WhyUs onStart={() => changeView('contact')} />
            <Suspense fallback={<UniverseFallback />}>
              <Universe setView={changeView} />
            </Suspense>
            <Services setView={changeView} />
            <Stats />
            <Pricing setView={changeView} />
            <FAQ />
          </>
        )}
        
        <Suspense fallback={null}>
          {view === 'studio' && (
            <>
              <Seo {...ROUTE_META.studio} view="studio" />
              <Studio setView={changeView} />
            </>
          )}

          {view === 'work' && !slug && (
            <>
              <Seo {...ROUTE_META.work} view="work" />
              <WorkIndex onOpen={openCase} onContact={() => changeView('contact')} />
            </>
          )}

          {view === 'work' && slug && (
            <>
              <Seo {...caseMeta(slug)} view={`work/${slug}`} />
              <CaseStudyPage slug={slug} onOpen={openCase} onAll={() => changeView('work')} onHome={() => changeView('home')} onContact={() => changeView('contact')} />
            </>
          )}

          {view === 'contact' && (
            <>
              <Seo {...ROUTE_META.contact} view="contact" />
              <Contact isStandalone={true} setView={changeView as any} />
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
  );
};

export default App;