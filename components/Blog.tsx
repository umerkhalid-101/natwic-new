
import React from 'react';
import { motion } from 'framer-motion';

const ARTICLES = [
  { date: "June 29, 2025", title: "Nurturing brands through intentional design", img: "https://picsum.photos/seed/blog1/800/600" },
  { date: "June 30, 2025", title: "The power of restraint in visual storytelling", img: "https://picsum.photos/seed/blog2/800/600" },
  { date: "July 1, 2025", title: "Balancing elegance and raw nature in brand expression", img: "https://picsum.photos/seed/blog3/800/600" }
];

export const Blog: React.FC = () => {
  return (
    <section id="blog" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div>
             <p className="text-xs font-mono text-zinc-500 mb-6 uppercase tracking-[0.4em]">Blog</p>
             <h2 className="text-5xl md:text-7xl font-black tracking-tighter">Latest articles</h2>
          </div>
          <button className="bg-white text-black text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-full hover:scale-105 transition-transform">
            View all
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTICLES.map((article, i) => (
            /* Use spread operator to bypass strict type checking for motion props */
            <motion.div 
              key={i}
              {...({
                whileHover: { y: -10 }
              } as any)}
              className="group cursor-pointer"
            >
              <div className="aspect-[4/3] rounded-3xl overflow-hidden mb-8 border border-zinc-900">
                <img src={article.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-4">{article.date}</p>
              <h3 className="text-xl font-bold leading-tight group-hover:text-zinc-300 transition-colors">
                {article.title}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
