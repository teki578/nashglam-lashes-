/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Sparkles, HelpCircle, Heart, ShieldCheck } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

interface BeautyFaqsProps {
  isDarkMode?: boolean;
}

export default function BeautyFaqs({ isDarkMode = false }: BeautyFaqsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: 'How should I prepare for my lash appointment?',
      answer: 'Please arrive with completely clean eyes and clean skin—strictly no mascara, eyeliner, heavy facial oils, or lash curls. Avoid caffeine for 3-4 hours prior, as it can cause natural micro-fluttering of your eyelids during the precise application. If you wear contact lenses, we highly recommend bringing your storage case to remove them before under-eye gel pad application.'
    },
    {
      question: 'How do I wash my lash extensions, and are they waterproof?',
      answer: "Lash extensions are waterproof after our initial medical seal is dried using nano-misters, but proper luxury hygiene is paramount to prevent build-ups! Wash them daily after the first 24 hours using an oil-free Lash Foam Cleanser. Gently brush them through with a clean mascara wand only when they are 100% dry. Avoid heavy water pressure directly on your face during showers."
    },
    {
      question: 'How long do extension sets last, and when should I get fills?',
      answer: 'Your natural eyelashes shed organically at a rate of 2-5 lashes per day, mirroring standard body hair growth. Consequently, extensions typically last 4-6 weeks depending on retention care. We recommend scheduling Lash Fills every 2 to 3 weeks (with at least 40% of original extensions remaining) to clean, remove outgrown shafts, and fill new lash sprouts.'
    },
    {
      question: 'Will eyelash extensions damage my natural lash hair?',
      answer: 'Absolutely not when applied by our certified advanced lash technicians. We strictly map custom diameters and lengths that match your natural follicle holding capacity. Our hand-fanned silk fibers are featherlight and applied using surgical-grade, low-fume medical-grade adhesive—leaving your underlying lash roots perfectly healthy and safe.'
    },
  ];

  return (
    <div className={`transition-colors duration-300 border p-6 sm:p-8 rounded-2xl space-y-6 ${
      isDarkMode ? 'bg-stone-900 border-stone-800/80 text-stone-100 shadow-stone-950/20' : 'bg-[#f0ede6]/50 border-stone-200 text-stone-800'
    }`}>
      
      {/* FAQ Header */}
      <div className="text-center space-y-1.5 max-w-xl mx-auto">
        <div className={`inline-flex p-1.5 rounded-full border ${isDarkMode ? 'bg-pink-950/40 border-pink-800/50 text-pink-300' : 'bg-pink-50 border-pink-200 text-pink-750 text-pink-700'}`}>
          <ShieldCheck className="w-4 h-4" />
        </div>
        <h2 className={`font-serif text-2xl sm:text-3xl tracking-tight font-medium ${isDarkMode ? 'text-stone-50' : 'text-stone-900'}`}>
          Lash Safety & Maintenance Guide
        </h2>
        <p className={`font-sans text-xs sm:text-sm leading-normal font-light ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>
          Everything you need to know about our hypoallergenic materials, retention pacing, and professional eyelash care hygiene.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3.5 max-w-3xl mx-auto">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`border rounded-xl overflow-hidden transition-all shadow-2xs ${
                isDarkMode 
                   ? 'bg-stone-950 border-stone-800/80 hover:border-stone-800' 
                   : 'bg-white border-stone-200/80 hover:border-stone-300'
              }`}
            >
              {/* Question toggle header */}
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full py-4.5 px-5 flex items-center justify-between text-left focus:outline-none cursor-pointer"
              >
                <span className={`font-serif text-[15px] sm:text-base font-semibold ${isDarkMode ? 'text-stone-200' : 'text-stone-900'}`}>
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-pink-600 shrink-0 transform transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Answer content collapsible div */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    <div className={`px-5 pb-5 pt-1.5 text-xs sm:text-sm font-sans leading-relaxed font-light border-t ${
                      isDarkMode ? 'text-stone-300 border-stone-800' : 'text-stone-500 border-stone-100'
                    }`}>
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Mini tip footer */}
      <div className="flex items-center justify-center space-x-2 text-[11px] text-stone-400 font-sans italic max-w-md mx-auto text-center">
        <Heart className="w-3.5 h-3.5 text-pink-600 shrink-0 fill-pink-500/10" />
        <span>Tips: Use oil-free cosmetics. Brush lashes only when dry. Never pull extensions out manually.</span>
      </div>

    </div>
  );
}
