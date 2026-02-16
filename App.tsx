
import React from 'react';
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
import { Blog } from './components/Blog';
import { Footer } from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-white text-black selection:bg-[#703FEC] selection:text-white">
      <Navbar />
      
      <main>
        <Hero />
        
        {/* White background sections */}
        <Partners />
        <WhyUs />
        <AboutUs />
        
        {/* Switching context */}
        <SelectedWork />
        <Services />
        <Stats />
        
        <Pricing />
        <FAQ />
        <Blog />
      </main>

      <Footer />
    </div>
  );
};

export default App;
