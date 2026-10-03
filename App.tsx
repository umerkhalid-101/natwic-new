import React, { useState, useEffect, lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Partners } from './components/Partners';
import { WhyUs } from './components/WhyUs';
import { Universe } from './components/Universe';
import { Services } from './components/Services';
import { Stats } from './components/Stats';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { Seo } from './components/Seo';
import { Loader } from './components/Loader';
import { initSmoothScroll, destroySmoothScroll, scrollToTop } from './components/smoothScroll';
import { ROUTE_META, View, viewFromPath } from './seo';

const Contact = lazy(() => import('./components/Contact').then(m => ({ default: m.Contact })));
const Studio = lazy(() => import('./components/Studio').then(m => ({ default: m.Studio })));
const Privacy = lazy(() => import('./components/Privacy').then(m => ({ default: m.Privacy })));
const Terms = lazy(() => import('./components/Terms').then(m => ({ default: m.Terms })));
const WorkComingSoon = lazy(() => import('./components/WorkComingSoon').then(m => ({ default: m.WorkComingSoon })));

// `initialView` lets the build-time pre-renderer render each page
const App: React.FC<{ initialView?: View }> = ({ initialView = 'home' }) => {
  const [view, setView] = useState<View>(initialView);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initSmoothScroll();
    return destroySmoothScroll;
  }, []);

  // Handle URL synchronization on mount and popstate
  useEffect(() => {
    const handleUrlChange = () => setView(viewFromPath(window.location.pathname));

    // Check initial URL
    handleUrlChange();

    // Listen for browser back/forward navigation
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  // Custom setter that updates the URL so Google can index specific pages
  const changeView = (newView: View) => {
    setView(newView);
    const path = newView === 'home' ? '/' : `/${newView}`;
    window.history.pushState({}, '', path);
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
            <Universe setView={changeView} />
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

          {view === 'work' && (
            <>
              <Seo {...ROUTE_META.work} view="work" />
              <WorkComingSoon setView={changeView as any} />
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

      {view !== 'work' && <Footer setView={changeView as any} currentView={view} />}
    </div>
  );
};

export default App;