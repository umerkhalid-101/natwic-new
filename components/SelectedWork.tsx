import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const WorkItem: React.FC<{ work: { id: number; title: string; image: string; year: string; category: string } }> = ({ work }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.15, 1]);
  const textY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative group cursor-pointer overflow-hidden rounded-[2rem] md:rounded-[4rem] aspect-[16/10] bg-zinc-100"
    >
      <motion.div 
        style={{ y, scale }}
        className="absolute inset-0 w-full h-full"
      >
        <img 
          src={work.image} 
          alt={work.title} 
          className="w-full h-full object-cover transition-all duration-1000 grayscale group-hover:grayscale-0 group-hover:scale-105" 
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-[#703FEC]/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-1000 flex flex-col justify-end p-12 md:p-24">
        <motion.div 
          style={{ y: textY }}
          className="text-white transform translate-y-12 group-hover:translate-y-0 transition-transform duration-1000 ease-[0.16, 1, 0.3, 1]"
        >
          <p className="text-[10px] md:text-xs uppercase tracking-[0.6em] mb-8 font-semibold text-[#703FEC]">
            {work.category} — {work.year}
          </p>
          <h3 className="text-5xl md:text-[8rem] font-bold tracking-tight leading-[0.8]">
            {work.title}
          </h3>
          <div className="mt-16 overflow-hidden">
             <div className="w-24 h-[2px] bg-white group-hover:w-full transition-all duration-1000 ease-in-out origin-left" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export const SelectedWork: React.FC = () => {
  const works = [
    { id: 1, title: "Modernist Era", category: "Identity Design", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2000", year: "2025" },
    { id: 2, title: "Abstract Flow", category: "Product UX", image: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=2000", year: "2025" },
    { id: 3, title: "Digital Echo", category: "Campaign", image: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=2000", year: "2024" }
  ];

  return (
    <section id="work" className="py-48 px-4 md:px-12 bg-white text-black rounded-t-[4rem] md:rounded-t-[8rem] -mt-20 relative z-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-40 gap-24">
          <div className="max-w-4xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.8em] text-[#703FEC] mb-12">SELECTED ARCHIVE</p>
            <h2 className="text-7xl md:text-[11rem] font-bold tracking-tight leading-[0.75] mb-12">
              Bolder<br />Thinking.
            </h2>
          </div>
          <div className="max-w-lg pb-10">
            <p className="text-lg md:text-xl text-zinc-500 mb-16 font-medium leading-relaxed">
              We specialize in creating digital landmarks. Every project is a synthesis of market intelligence and high-fidelity craftsmanship.
            </p>
            <motion.div 
              whileHover={{ x: 20 }}
              className="flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.6em] border-b-2 border-black pb-8 cursor-pointer group w-fit"
            >
              See all projects 
              <span className="text-3xl group-hover:text-[#703FEC] transition-colors">→</span>
            </motion.div>
          </div>
        </div>

        <div className="flex flex-col gap-32 md:gap-56">
          {works.map((work) => (
            <WorkItem key={work.id} work={work} />
          ))}
        </div>
      </div>
    </section>
  );
};