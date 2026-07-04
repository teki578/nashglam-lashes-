/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Heart, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface BeautyFaqsProps {
  isDarkMode?: boolean;
}

export default function BeautyFaqs({ isDarkMode = false }: BeautyFaqsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { t } = useLanguage();
  const f = t.faqs;

  return (
    <div className={`transition-colors duration-300 border p-6 sm:p-8 rounded-2xl space-y-6 ${
      isDarkMode ? 'bg-stone-900 border-stone-800/80 text-stone-100 shadow-stone-950/20' : 'bg-[#f0ede6]/50 border-stone-200 text-stone-800'
    }`}>
      
      {/* Header */}
      <div className="text-center space-y-1.5 max-w-xl mx-auto">
        <div className={`inline-flex p-1.5 rounded-full border ${isDarkMode ? 'bg-pink-950/40 border-pink-800/50 text-pink-300' : 'bg-pink-50 border-pink-200 text-pink-700'}`}>
          <ShieldCheck className="w-4 h-4" />
        </div>
        <h2 className={`font-serif text-2xl sm:text-3xl tracking-tight font-medium ${isDarkMode ? 'text-stone-50' : 'text-stone-900'}`}>
          {f.title}
        </h2>
        <p className={`font-sans text-xs sm:text-sm leading-normal font-light ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>
          {f.subtitle}
        </p>
      </div>

      {/* Accordion */}
      <div className="space-y-3.5 max-w-3xl mx-auto">
        {f.items.map((faq, idx) => {
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

      {/* Tip footer */}
      <div className="flex items-center justify-center space-x-2 text-[11px] text-stone-400 font-sans italic max-w-md mx-auto text-center">
        <Heart className="w-3.5 h-3.5 text-pink-600 shrink-0 fill-pink-500/10" />
        <span>{f.tip}</span>
      </div>

    </div>
  );
}
