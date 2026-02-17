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

type View = 'home' | 'contact' | 'studio';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');

  // Ensure scroll to top when changing views
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  return (
    <div className="relative min-h-screen bg-white text-black selection:bg-[#703FEC] selection:text-white">
      <Navbar setView={setView} currentView={view} />
      
      <main>
        {view === 'home' && (
          <>
            <Hero setView={setView} />
            <Partners />
            <WhyUs />
            <AboutUs />
            <SelectedWork />
            <Services />
            <Stats />
            <Pricing setView={setView} />
            <FAQ />
          </>
        )}
        
        {view === 'studio' && (
          <Studio setView={setView} />
        )}

        {view === 'contact' && (
          <Contact isStandalone={true} setView={setView} />
        )}
      </main>

      <Footer setView={setView} currentView={view} />
    </div>
  );
};

export default App;