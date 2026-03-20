import React, { useState, useEffect, lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Partners } from './components/Partners';
import { SelectedWork } from './components/SelectedWork';
import { WhyUs } from './components/WhyUs';
import { StudioPreview } from './components/StudioPreview';
import { Services } from './components/Services';
import { Stats } from './components/Stats';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { Seo } from './components/Seo';
import { Loader } from './components/Loader';

const Contact = lazy(() => import('./components/Contact').then(m => ({ default: m.Contact })));
const Studio = lazy(() => import('./components/Studio').then(m => ({ default: m.Studio })));
const Privacy = lazy(() => import('./components/Privacy').then(m => ({ default: m.Privacy })));
const Terms = lazy(() => import('./components/Terms').then(m => ({ default: m.Terms })));
const WorkComingSoon = lazy(() => import('./components/WorkComingSoon').then(m => ({ default: m.WorkComingSoon })));

type View = 'home' | 'contact' | 'studio' | 'privacy' | 'terms' | 'work';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [isLoading, setIsLoading] = useState(true);

  // Handle URL synchronization on mount and popstate
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname.replace(/^\//, '').replace(/\/$/, '') as View;
      if (['studio', 'contact', 'privacy', 'terms', 'work'].includes(path)) {
        setView(path);
      } else {
        setView('home');
      }
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
    const path = newView === 'home' ? '/' : `/${newView}`;
    window.history.pushState({}, '', path);
    window.scrollTo(0, 0);
  };

  // Structured Data (JSON-LD) for Organization
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Natwic Studio",
    "image": "https://lh3.googleusercontent.com/d/1TNWPq9K4wbLxAey0l4zm8fNPya-DOx62",
    "url": "https://www.natwic.com",
    "telephone": "+1 234 567 890",
    "priceRange": "$$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "124 Creative Boulevard, Suite 400",
      "addressLocality": "London",
      "addressCountry": "UK"
    },
    "sameAs": [
      "https://www.natwic.com",
      "https://www.linkedin.com/company/natwic",
      "https://www.instagram.com/natwic"
    ]
  };

  return (
    <div className="relative min-h-screen bg-white text-black selection:bg-[#703FEC] selection:text-white">
      
      {/* Loading Screen Overlay */}
      <AnimatePresence>
        {isLoading && <Loader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Navbar setView={changeView as any} currentView={view as 'home' | 'contact' | 'studio'} />
      
      <main>
        {view === 'home' && (
          <>
            <Seo 
              title="Natwic® Studio | Redefining Digital Excellence" 
              description="Not just a studio. We are Natwic. A high-fidelity creative partner building legacy-grade digital experiences for the world's most ambitious brands."
              view="home"
            />
            <Hero setView={changeView} />
            <Partners />
            <WhyUs />
            <StudioPreview setView={changeView} />
            <SelectedWork setView={changeView} />
            <Services />
            <Stats />
            <Pricing setView={changeView} />
            <FAQ />
          </>
        )}
        
        <Suspense fallback={null}>
          {view === 'studio' && (
            <>
              <Seo
                title="Our Studio | Natwic®"
                description="Meet the minds behind Natwic. A multidisciplinary team of designers, developers, and strategists redefining the digital landscape."
                view="studio"
              />
              <Studio setView={changeView} />
            </>
          )}

          {view === 'work' && (
            <>
              <Seo
                title="Selected Work | Natwic®"
                description="Explore our portfolio of high-end digital experiences. Coming Soon."
                view="work"
              />
              <WorkComingSoon setView={changeView as any} />
            </>
          )}

          {view === 'contact' && (
            <>
              <Seo
                title="Contact Us | Natwic®"
                description="Start your legacy with Natwic. Get in touch for high-end web design, branding, and digital strategy."
                view="contact"
              />
              <Contact isStandalone={true} setView={changeView as any} />
            </>
          )}

          {view === 'privacy' && (
            <>
              <Seo title="Privacy Policy | Natwic®" description="Natwic Studio Privacy Policy." view="privacy" />
              <Privacy />
            </>
          )}

          {view === 'terms' && (
            <>
              <Seo title="Terms of Service | Natwic®" description="Natwic Studio Terms of Service." view="terms" />
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