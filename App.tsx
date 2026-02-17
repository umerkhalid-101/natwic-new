import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Partners } from './components/Partners';
import { SelectedWork } from './components/SelectedWork';
import { WhyUs } from './components/WhyUs';
import { AboutUs } from './components/AboutUs';
import { Services } from './components/Services';
import { Stats } from './components/Stats';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Studio } from './components/Studio';
import { Seo } from './components/Seo';

type View = 'home' | 'contact' | 'studio';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');

  // Handle URL synchronization on mount and popstate
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view');
      if (viewParam === 'studio') setView('studio');
      else if (viewParam === 'contact') setView('contact');
      else setView('home');
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
    const url = new URL(window.location.href);
    
    if (newView === 'home') {
      url.searchParams.delete('view');
    } else {
      url.searchParams.set('view', newView);
    }
    
    window.history.pushState({}, '', url);
    window.scrollTo(0, 0);
  };

  // Structured Data (JSON-LD) for Organization
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Natwic Studio",
    "image": "https://lh3.googleusercontent.com/d/1TNWPq9K4wbLxAey0l4zm8fNPya-DOx62",
    "url": "https://natwic.studio",
    "telephone": "+1 234 567 890",
    "priceRange": "$$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "124 Creative Boulevard, Suite 400",
      "addressLocality": "London",
      "addressCountry": "UK"
    },
    "sameAs": [
      "https://www.linkedin.com/company/natwic",
      "https://www.instagram.com/natwic"
    ]
  };

  return (
    <div className="relative min-h-screen bg-white text-black selection:bg-[#703FEC] selection:text-white">
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Navbar setView={changeView} currentView={view} />
      
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
            <AboutUs />
            <SelectedWork />
            <Services />
            <Stats />
            <Pricing setView={changeView} />
            <FAQ />
          </>
        )}
        
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

        {view === 'contact' && (
          <>
            <Seo 
              title="Contact Us | Natwic®" 
              description="Start your legacy with Natwic. Get in touch for high-end web design, branding, and digital strategy."
              view="contact"
            />
            <Contact isStandalone={true} setView={changeView} />
          </>
        )}
      </main>

      <Footer setView={changeView} currentView={view} />
    </div>
  );
};

export default App;
