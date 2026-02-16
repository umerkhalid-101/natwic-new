
import React from 'react';
import { motion } from 'framer-motion';

export const Pricing: React.FC = () => {
  const plans = [
    {
      name: 'Standard',
      price: '3450',
      period: '/project',
      badge: 'AFFORDABLE',
      features: [
        'Fast design & dev, built for scale',
        'Dedicated creative team',
        'Average 2–3 day turnaround',
        'Ongoing design-to-build support',
        'Fast design & dev, built for scale'
      ],
      footer: '2-4 weeks sprint',
      btnStyle: 'bg-zinc-900 text-white hover:bg-zinc-800'
    },
    {
      name: 'Pro',
      price: '6850',
      period: '/monthly',
      badge: 'POPULAR',
      isPopular: true,
      features: [
        'Unlimited tasks, one at time',
        'Slack channel and message',
        'Average 24h turnaround',
        'Ongoing design-to-build support',
        'Branding and dev sprints'
      ],
      footer: 'Monthly retainer',
      btnStyle: 'bg-white text-black hover:bg-zinc-100'
    }
  ];

  return (
    <section className="py-48 px-6 bg-black text-white rounded-[4rem] relative overflow-hidden">
      {/* Background Large Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none select-none opacity-20 overflow-hidden">
        <h2 className="text-[25vw] font-bold tracking-tighter leading-none mb-0">Pricing</h2>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col items-center relative z-10">
        {/* Availability Indicator */}
        <div className="flex items-center gap-2 mb-16">
          <div className="w-1.5 h-1.5 bg-[#F3350C] rounded-full animate-pulse" />
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em]">2 slots available</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
          {plans.map((plan, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white/5 backdrop-blur-[40px] border border-white/10 rounded-[3rem] p-10 md:p-14 flex flex-col shadow-2xl"
            >
              <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em] text-right mb-6">{plan.badge}</div>
              
              <h3 className="text-3xl font-semibold mb-8 tracking-tight">{plan.name}</h3>
              <div className="flex items-baseline gap-2 mb-12">
                <span className="text-7xl font-bold tracking-tighter">{plan.price}</span>
                <span className="text-zinc-500 text-sm font-medium">{plan.period}</span>
              </div>

              <div className="space-y-6 mb-16 flex-1">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-center gap-3.5 text-[13px] font-medium text-zinc-300">
                    <div className="w-4 h-4 rounded-full border border-zinc-700 flex items-center justify-center shrink-0">
                      <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
                    </div>
                    {feature}
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-800 border-dotted pt-8 mb-8 text-center text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                {plan.footer}
              </div>

              <button className={`w-full py-5 rounded-2xl font-bold uppercase tracking-widest text-[11px] transition-all hover:scale-[1.02] active:scale-95 ${plan.btnStyle}`}>
                Learn more
              </button>
              <p className="text-[9px] text-center mt-6 text-zinc-700 uppercase tracking-widest font-bold">
                7-day money-back guarantee
              </p>
            </motion.div>
          ))}
        </div>
        
        <p className="text-center mt-20 text-zinc-600 text-[10px] uppercase tracking-widest max-w-lg leading-relaxed opacity-60 font-medium">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum.
        </p>
      </div>
    </section>
  );
};
