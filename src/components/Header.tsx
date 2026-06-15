/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ShoppingBag, Eye, Calendar, Sun, Moon } from 'lucide-react';
import { Appointment } from '../types';

interface HeaderProps {
  cartItemCount: number;
  onOpenCart: () => void;
  onScrollTo: (elementId: string) => void;
  bookedAppointmentsCount: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  confirmedAppointment: Appointment | null;
  onClearConfirmed: () => void;
}

export default function Header({
  cartItemCount,
  onOpenCart,
  onScrollTo,
  bookedAppointmentsCount,
  isDarkMode,
  onToggleDarkMode,
  confirmedAppointment,
  onClearConfirmed,
}: HeaderProps) {
  return (
    <>
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-stone-950/95 border-stone-800/80 text-stone-100' 
          : 'bg-stone-50/95 border-stone-200/60 text-stone-900 shadow-xs'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Brand Logo - serif & elegant */}
            <div className="flex items-center space-x-2">
              <span className={`font-serif text-2xl tracking-widest font-medium transition-colors ${
                isDarkMode ? 'text-stone-100' : 'text-stone-900'
              }`}>
                NASHGLAM <span className="font-light italic text-pink-500">LASHES</span>
              </span>
            </div>

            {/* Quick Section Menu */}
            <nav className={`hidden md:flex items-center space-x-8 font-sans text-sm tracking-widest font-medium transition-colors ${
              isDarkMode ? 'text-stone-300' : 'text-stone-600'
            }`}>
              <button
                onClick={() => onScrollTo('hero')}
                className="hover:text-pink-500 transition-colors cursor-pointer"
              >
                WELCOME
              </button>
              <button
                onClick={() => onScrollTo('catalog')}
                className="hover:text-pink-500 transition-colors cursor-pointer"
              >
                LASH CARE SHOP
              </button>
              <button
                onClick={() => onScrollTo('reviews')}
                className="flex items-center space-x-1 hover:text-pink-500 transition-colors cursor-pointer"
              >
                <span>CLIENT REVIEWS</span>
              </button>
              <button
                onClick={() => onScrollTo('booking')}
                className="flex items-center space-x-1 hover:text-pink-500 transition-colors cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-pink-500" />
                <span>RESERVE SLOT</span>
              </button>
            </nav>

            {/* Actions: Booking & Cart triggers */}
            <div className="flex items-center space-x-4">
              
              {/* Dark & Light Theme mode selector */}
              <button
                type="button"
                onClick={onToggleDarkMode}
                className={`p-2.5 rounded-full border transition-all cursor-pointer ${
                  isDarkMode 
                    ? 'bg-stone-900 border-stone-800 text-pink-500 hover:text-pink-400 hover:bg-stone-800' 
                    : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-150 hover:border-stone-300'
                }`}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle Theme Mode"
              >
                {isDarkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
              </button>

              {/* Quick appointment count badge */}
              {bookedAppointmentsCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={() => onScrollTo('booking')}
                  className={`hidden sm:flex items-center space-x-1.5 py-1 px-3 rounded-full border text-xs font-medium cursor-pointer ${
                    isDarkMode 
                      ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300' 
                      : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  }`}
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{bookedAppointmentsCount} Reserved</span>
                </motion.div>
              )}

              {/* Shopping cart button */}
              <button
                onClick={onOpenCart}
                className={`relative p-2.5 rounded-full border transition-all cursor-pointer ${
                  isDarkMode 
                    ? 'bg-stone-900 border-stone-800 text-stone-100 hover:bg-stone-800' 
                    : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100 hover:border-stone-300'
                }`}
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <motion.span
                    key={cartItemCount}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-5 h-5 px-1 bg-pink-600 text-white text-[10px] font-bold rounded-full border border-stone-50"
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </button>

              {/* Book Now primary action */}
              <button
                onClick={() => onScrollTo('booking')}
                className={`md:inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-transparent text-xs font-sans font-semibold tracking-widest text-[#f5f5f4] hover:bg-pink-700 hover:text-stone-50 hover:shadow-md transition-all active:scale-95 cursor-pointer ${
                  isDarkMode ? 'bg-pink-600 hover:bg-pink-500' : 'bg-stone-900 hover:bg-pink-700'
                }`}
              >
                BOOK NOW
              </button>

            </div>
          </div>
        </div>
      </header>

      {/* Moving news bundle marquee */}
      <div className={`w-full overflow-hidden text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold py-2.5 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-stone-900 border-b border-stone-800 text-pink-400' 
          : 'bg-stone-900 border-b border-stone-900 text-stone-100'
      }`}>
        <div className="flex whitespace-nowrap">
          <div className="animate-marquee flex items-center space-x-12 sm:space-x-16">
            <span className="flex items-center gap-1.5 font-mono shrink-0">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-pink-500" />
              GRAND OPENING: NashGlam Lash Studio is now fully based in Terrebonne!
            </span>
            <span className="flex items-center gap-1.5 font-mono shrink-0">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-pink-500" />
              Lash extensions crafted with care, from a home studio in Terrebonne!
            </span>
            <span className="flex items-center gap-1.5 font-mono shrink-0">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-pink-500" />
              Enjoy dedicated 1:1 premium beauty mapping in our bespoke styling space!
            </span>
            <span className="flex items-center gap-1.5 font-mono shrink-0">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-pink-500" />
              Reserve Today — Formaldehyde-free luxury cashmere silk lashes!
            </span>

            {/* Duplicated for seamless circular scroll */}
            <span className="flex items-center gap-1.5 font-mono shrink-0">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-pink-500" />
              GRAND OPENING: NashGlam Lash Studio is now fully based in Terrebonne!
            </span>
            <span className="flex items-center gap-1.5 font-mono shrink-0">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-pink-500" />
              Lash extensions crafted with care, from a home studio in Terrebonne!
            </span>
            <span className="flex items-center gap-1.5 font-mono shrink-0">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-pink-500" />
              Enjoy dedicated 1:1 premium beauty mapping in our bespoke styling space!
            </span>
            <span className="flex items-center gap-1.5 font-mono shrink-0">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-pink-500" />
              Reserve Today — Formaldehyde-free luxury cashmere silk lashes!
            </span>
          </div>
        </div>
      </div>

      {confirmedAppointment && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="w-full bg-emerald-600 dark:bg-emerald-700 text-stone-100 text-xs font-sans py-3.5 px-4 sm:px-6 lg:px-8 border-b border-emerald-500/30 shadow-inner flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-center sm:text-left overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 justify-center sm:justify-start">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-800 text-emerald-100 font-bold text-[10px] shrink-0">✓</span>
            <div>
              <span className="font-extrabold tracking-wider uppercase font-mono mr-1.5 text-emerald-100">APPOINTMENT CONFIRMED:</span>
              <span className="font-medium">Your lash session is secured with <strong className="font-extrabold text-white">{confirmedAppointment.artist.name}</strong> on <strong className="font-extrabold text-white">{confirmedAppointment.date}</strong> at <strong className="font-extrabold text-[#fdf2f8]">{confirmedAppointment.timeSlot}</strong>!</span>
              <span className="block mt-0.5 text-[11px] opacity-90 leading-relaxed">
                📬 A confirmation email has been dispatched to <strong className="font-semibold text-white">{confirmedAppointment.customerEmail}</strong>. <strong>Exact home studio location:</strong> 1420-A Avenue du Lux, Terrebonne, QC.
              </span>
            </div>
          </div>
          <button
            onClick={onClearConfirmed}
            className="self-center px-3 py-1 bg-emerald-900 text-white hover:bg-emerald-950 border border-transparent rounded-lg text-[10px] font-sans font-bold tracking-wider transition-all uppercase cursor-pointer"
          >
            DISMISS
          </button>
        </motion.div>
      )}
    </>
  );
}
