import React from 'react';
import { motion } from 'motion/react';

export const StatsAndPartners = () => {
  return (
    <section className="bg-white text-neutral-900 py-24 border-t border-neutral-200 relative overflow-hidden font-sans">
       {/* Background noise texture or grid could go here */}
       
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-neutral-200 pb-16 mb-16">
          <div className="border-l border-neutral-200 pl-6">
            <span className="block text-4xl font-serif italic text-teal-600 mb-2">100+</span>
            <span className="text-xs uppercase tracking-widest text-neutral-500">Research Articles</span>
          </div>
          <div className="border-l border-neutral-200 pl-6">
            <span className="block text-4xl font-serif italic text-teal-600 mb-2">20+</span>
            <span className="text-xs uppercase tracking-widest text-neutral-500">Global Partners</span>
          </div>
          <div className="border-l border-neutral-200 pl-6">
            <span className="block text-4xl font-serif italic text-teal-600 mb-2">3</span>
            <span className="text-xs uppercase tracking-widest text-neutral-500">Specialized Labs</span>
          </div>
          <div className="border-l border-neutral-200 pl-6">
             <span className="block text-4xl font-serif italic text-teal-600 mb-2">∞</span>
            <span className="text-xs uppercase tracking-widest text-neutral-500">Possibilities</span>
          </div>
        </div>

        {/* Marquee-style or Minimalist Partner List */}
        <div className="relative">
           <p className="text-xs text-center uppercase tracking-[0.3em] text-neutral-400 mb-12">Trusted Collaboration</p>
           
           <div className="flex flex-wrap justify-center items-center gap-16 lg:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-700 text-neutral-900">
             {/* Styled Text Logos for minimalism */}
             <span className="font-serif text-2xl italic">recTAL</span>
             <span className="font-sans text-xl font-bold tracking-tighter border-2 border-current px-2 py-1">LYNXTER</span>
             <span className="font-serif text-xl">Universität des Saarlandes</span>
             <span className="font-mono text-xl tracking-widest">SONOS</span>
           </div>
        </div>
      </div>
    </section>
  );
};
