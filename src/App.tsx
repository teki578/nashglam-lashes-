/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Shield, Bookmark, Instagram, Phone, Clock, MapPin, Star, Heart, CheckCircle2, ShoppingBag, Plus, Minus, Check } from 'lucide-react';
import Header from './components/Header';
import BookingForm from './components/BookingForm';
import ClientReviews from './components/ClientReviews';
import BeautyFaqs from './components/BeautyFaqs';
import CartDrawer from './components/CartDrawer';
import { LASH_PRODUCTS } from './data';
import { CartItem, Appointment, LashProduct } from './types';

import heroImg from './assets/images/lash_hero_banner_1781406354819.jpg';
import cleanKitImg from './assets/images/lash_clean_kit_1781410195486.jpg';

const HERO_IMAGE = heroImg;

const CLEAN_KIT_PRODUCT: LashProduct = {
  id: 'lash_clean_kit',
  name: 'Lash Cleaning Package',
  price: 20,
  type: 'Lash Care' as any,
  description: 'Expertly formulated to eliminate make-up residues, oils, and environmental build-up while extending extension retention up to 6+ weeks.',
  benefits: [
    'Deep cleansing bubble wash (60ml foaming bottle)',
    'Ultra-soft customized antimicrobial washing brush',
    'Two long-retention extension lash spoolies',
    'Elegant protective travel protection pouch'
  ],
  fullDescription: 'Keep your lashes stunning, sanitized, and perfectly separated! NashGlam’s custom formulated oil-free bubble wash removes debris without weakening the ultra-fine extension medical bonds, locking in your retention.',
  curlOptions: ['Fragrance-Free Pure', 'Calming Lavender', 'Elegant Rosewater'],
  lengthOptions: ['Champagne Gold Brush', 'Midnight Obsidian Brush', 'Rose Gold Brush'],
  thickness: 'pH-Balanced',
  durationMin: 0,
  image: cleanKitImg,
};

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('nashglam_appointments');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });
  const [lastConfirmedAppointment, setLastConfirmedAppointment] = useState<Appointment | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Set pre-filled product on booking scheduler
  const [selectedBookingProduct, setSelectedBookingProduct] = useState<LashProduct | null>(LASH_PRODUCTS[0]);

  // Lash cleaning package state
  const [selectedScent, setSelectedScent] = useState('Fragrance-Free Pure');
  const [selectedBrush, setSelectedBrush] = useState('Champagne Gold Brush');
  const [cleanKitQty, setCleanKitQty] = useState(1);
  const [showCleanKitAdded, setShowCleanKitAdded] = useState(false);

  const handleAddCleanKitToCart = () => {
    const itemId = `${CLEAN_KIT_PRODUCT.id}-${selectedScent}-${selectedBrush}`;
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === itemId);
      if (existing) {
        return prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + cleanKitQty } : item
        );
      }
      return [
        ...prevItems,
        {
          id: itemId,
          product: CLEAN_KIT_PRODUCT,
          selectedCurl: selectedScent,
          selectedLength: selectedBrush,
          quantity: cleanKitQty,
        },
      ];
    });

    setShowCleanKitAdded(true);
    setTimeout(() => {
      setShowCleanKitAdded(false);
    }, 2000);
  };

  // Handle scrolling to section anchor tags
  const handleScrollTo = (elementId: string) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // ADD PRODUCT/SET TO SHOPPING BAG
  const handleAddToCart = (product: LashProduct, curl: string, length: string) => {
    const itemId = `${product.id}-${curl}-${length}`;
    
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === itemId);
      if (existing) {
        return prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prevItems,
        {
          id: itemId,
          product,
          selectedCurl: curl,
          selectedLength: length,
          quantity: 1,
        },
      ];
    });
  };

  // UPDATE CART QUANTITY
  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.id === itemId) {
            const nextQty = item.quantity + delta;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  // BOOK AN APPOINTMENT (Synchronized to local app state and pre-selected style)
  const handleBookingConfirmed = (appointment: Appointment) => {
    setAppointments((prev) => {
      const updated = [...prev, appointment];
      localStorage.setItem('nashglam_appointments', JSON.stringify(updated));
      return updated;
    });
    setLastConfirmedAppointment(appointment);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRemoveAppointment = (appId: string) => {
    setAppointments((prev) => {
      const updated = prev.filter((app) => app.id !== appId);
      localStorage.setItem('nashglam_appointments', JSON.stringify(updated));
      return updated;
    });
  };

  const handleBookFromCatalog = (product: LashProduct) => {
    setSelectedBookingProduct(product);
    handleScrollTo('booking');
  };

  return (
    <div className={`min-h-screen font-sans antialiased selection:bg-pink-200 selection:text-pink-900 transition-colors duration-300 ${
      isDarkMode ? 'bg-stone-950 text-stone-200' : 'bg-stone-50 text-stone-800'
    }`}>
      
      {/* 1. BRAND HEADER */}
      <Header
        cartItemCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onScrollTo={handleScrollTo}
        bookedAppointmentsCount={appointments.length}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
        confirmedAppointment={lastConfirmedAppointment}
        onClearConfirmed={() => setLastConfirmedAppointment(null)}
      />

      <main className="pb-16">
        
        {/* 2. MAJESTIC HERO SHOWCASE VIEW */}
        <section id="hero" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-12 pb-14 sm:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:items-center">
            
            {/* Left Content Column */}
            <div className="space-y-6 lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
              
              {/* Premium tag */}
              <div className={`inline-flex items-center space-x-2 py-1.5 px-3.5 rounded-full border text-xs font-mono font-medium tracking-wider ${
                isDarkMode ? 'bg-pink-950/40 border-pink-900/50 text-pink-400' : 'bg-pink-50 border-pink-200 text-pink-800'
              }`}>
                <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-pulse animate-duration-1000" />
                <span>TERREBONNE HOME LASH STUDIO</span>
              </div>

              {/* Lash extensions crafted with care title segment */}
              <div className="space-y-3">
                <p className={`font-serif text-sm sm:text-base tracking-normal leading-relaxed font-normal ${isDarkMode ? 'text-stone-300' : 'text-stone-600'}`}>
                  Lash extensions crafted with care, <br />
                  from a home studio in Terrebonne.
                </p>
              </div>

              {/* Action buttons (Move directly under the studio description) */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={() => handleScrollTo('booking')}
                  className={`px-8 py-4 rounded-xl text-xs font-bold font-sans tracking-widest transition-all cursor-pointer shadow-md text-center ${
                    isDarkMode 
                      ? 'bg-pink-600 text-white hover:bg-pink-500 shadow-pink-950/30' 
                      : 'bg-pink-600 text-white hover:bg-pink-700 shadow-pink-600/20'
                  }`}
                >
                  BOOK YOUR SET
                </button>
                <button
                  onClick={() => handleScrollTo('catalog')}
                  className={`px-8 py-4 rounded-xl text-xs font-bold font-sans tracking-widest transition-all cursor-pointer text-center border ${
                    isDarkMode 
                      ? 'bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700' 
                      : 'bg-white border-stone-200 hover:border-stone-400 text-stone-700'
                  }`}
                >
                  SHOP LASH CLEAN KIT
                </button>
              </div>

            </div>

            {/* Right Graphics/Image Column with floating atmospheric elements */}
            <div className="lg:col-span-7 flex justify-center">
              <div className={`relative w-full max-w-[540px] aspect-[16/10] rounded-3xl overflow-hidden shadow-lg border flex items-center justify-center group ${
                isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-stone-200 border-stone-200/60'
              }`}>
                <img
                  src={HERO_IMAGE}
                  alt="Elegant luxury eyelashes close up details"
                  className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual Glassmorphed labels to reinforce craft details */}
                <div className="absolute top-4 left-4 bg-white/20 hover:bg-white/35 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white text-[10px] uppercase font-mono tracking-widest transition-all">
                  • 1:1 Elite Isolation
                </div>

                <div className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/35 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white text-[10px] uppercase font-mono tracking-widest transition-all">
                  • Long Retention Curvature
                </div>
                
                <div className="absolute bottom-12 left-4 bg-stone-900/40 hover:bg-stone-900/65 backdrop-blur-md px-3 py-1 rounded-md text-[#f5f5f4] text-[9px] uppercase font-mono tracking-widest transition-all">
                  CC-Curl • {LASH_PRODUCTS[1].thickness}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 4. LASH CARE & HYGIENE SHOP (RESETS THE BESPOKE CATALOG AND SELLS CLEANING KIT) */}
        <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-12">
             <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className={`text-xs font-mono font-medium tracking-widest uppercase px-3 py-1 rounded-full border ${
              isDarkMode ? 'bg-pink-950/40 border-pink-900/30 text-pink-400' : 'bg-pink-50 border-pink-200/40 text-pink-700'
            }`}>
              Hygiene Essentials
            </span>
            <h2 className={`font-serif text-3xl sm:text-4xl tracking-tight font-medium ${isDarkMode ? 'text-stone-50' : 'text-stone-900'}`}>
              NashGlam Lash Clean Kit
            </h2>
            <p className={`font-sans text-xs sm:text-sm font-light leading-relaxed ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>
              Maintain professional retention after your appointments. Our oil-free cleansing solution works to preserve fiber bonds and keep your lashes fluffy and clean.
            </p>
          </div>

          {/* Interactive purchasing box for Clean Kit product */}
          <div className={`rounded-3xl border overflow-hidden shadow-sm hover:shadow-md transition-all max-w-4xl mx-auto ${
            isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-2">
              
              {/* Product Visual */}
              <div className="relative bg-stone-100 aspect-square md:aspect-auto min-h-[350px]">
                <img
                  src={CLEAN_KIT_PRODUCT.image}
                  alt={CLEAN_KIT_PRODUCT.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                
                <div className="absolute top-4 left-4 bg-pink-600 text-white text-[9px] uppercase font-mono tracking-widest font-bold py-1 px-3 rounded-full shadow-sm">
                  ★ BEST-SELLER
                </div>

                <div className="absolute bottom-4 right-4 bg-black/60 text-white text-[10px] uppercase font-mono tracking-widest py-1 px-3 rounded-md backdrop-blur-xs">
                  pH 5.5 Tear-Free Formula
                </div>
              </div>

              {/* Purchase Details & Selections Form */}
              <div className="p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-pink-500">RETENTION MAXIMIZER</span>
                      <h3 className={`font-serif text-2xl font-semibold leading-tight mt-1 ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>
                        Lash Cleaning Package
                      </h3>
                    </div>
                    <span className="text-2xl font-serif font-black text-pink-600 block pl-3">
                      ${CLEAN_KIT_PRODUCT.price}
                    </span>
                  </div>

                  <p className={`text-xs sm:text-sm leading-relaxed font-sans font-light ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>
                    {CLEAN_KIT_PRODUCT.description}
                  </p>

                  {/* Benefits checklist */}
                  <div className={`space-y-2 p-4 rounded-xl border ${
                    isDarkMode ? 'bg-stone-950/60 border-stone-800' : 'bg-stone-50 border-stone-100'
                  }`}>
                    <span className="text-[9px] font-mono font-bold text-stone-400 uppercase tracking-widest block">PACKAGE INCLUSIONS:</span>
                    <div className="grid grid-cols-1 gap-2.5 mt-1.5">
                      {CLEAN_KIT_PRODUCT.benefits.map((benefit, idx) => (
                        <div key={idx} className={`flex items-start text-xs ${isDarkMode ? 'text-stone-300' : 'text-stone-600'}`}>
                          <Check className="w-3.5 h-3.5 text-pink-500 mr-2 mt-0.5 shrink-0" />
                          <span className="font-light">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Qty and Purchase action bar */}
                <div className="flex items-center gap-4 pt-4 border-t border-stone-100">
                  
                  {/* Qty controller */}
                  <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden bg-stone-50">
                    <button
                      type="button"
                      onClick={() => setCleanKitQty(Math.max(1, cleanKitQty - 1))}
                      className="p-3 text-stone-500 hover:bg-stone-100 hover:text-stone-800 cursor-pointer transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-9 text-center font-mono font-bold text-xs text-stone-800 select-none">
                      {cleanKitQty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCleanKitQty(cleanKitQty + 1)}
                      className="p-3 text-stone-500 hover:bg-stone-100 hover:text-stone-800 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Add cart trigger */}
                  <button
                    type="button"
                    onClick={handleAddCleanKitToCart}
                    className={`flex-1 py-3.5 px-6 rounded-xl border border-transparent text-xs font-sans font-bold tracking-widest transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                      showCleanKitAdded
                        ? 'bg-emerald-700 text-stone-50'
                        : 'bg-pink-600 hover:bg-pink-700 text-white shadow-pink-900/10'
                    }`}
                  >
                    {showCleanKitAdded ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300 animate-pulse" />
                        <span>ADDED TO YOUR BAG</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>ADD PACKAGE TO BAG</span>
                      </>
                    )}
                  </button>

                </div>

              </div>

            </div>
          </div>
        </section>

        {/* 5. SECURE LUXURY ONLINE BOOKING SCHEDULE */}
        <section id="booking" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <BookingForm
            selectedProduct={selectedBookingProduct}
            onBookingConfirmed={handleBookingConfirmed}
            onSelectProduct={(p) => setSelectedBookingProduct(p)}
            isDarkMode={isDarkMode}
          />
        </section>

        {/* 5.5 CLIENT REVIEWS & SUBMISSION FEEDBACK */}
        <section id="reviews" className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-b scroll-mt-20 transition-colors ${
          isDarkMode ? 'bg-stone-900/20 border-stone-800/60' : 'bg-stone-100/40 border-stone-200/50'
        }`}>
          <ClientReviews isDarkMode={isDarkMode} />
        </section>

        {/* 6. FAQS maintainer and guidelines */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <BeautyFaqs isDarkMode={isDarkMode} />
        </section>

      </main>

      {/* 7. HIGHLY REFINED LUXURY FOOTER - NO AI LABELS */}
      <footer className="bg-stone-900 border-t border-stone-800 text-stone-300 py-16 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <span className="font-serif text-xl tracking-widest text-stone-50 font-bold">
              NASHGLAM <span className="font-light italic text-pink-500">LASHES</span>
            </span>
            <p className="text-xs text-stone-400 font-light leading-relaxed">
              Dedicated exclusively to custom-designed eyelash aesthetics. Handcrafted fiber fans with professional isolation guarantees.
            </p>
            <div className="flex space-x-3 pt-2 text-stone-400">
              <a href="#instagram" className="hover:text-pink-500 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#booking" className="hover:text-pink-500 transition-colors">
                <Bookmark className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Location Col */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-mono tracking-widest font-semibold text-stone-200">
              STUDIO LOCATION
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                <span>
                  Private Home Studio <br />
                  Terrebonne, QC, Canada
                </span>
              </div>
              <div className="flex items-center space-x-2 pt-1 border-t border-stone-800">
                <Phone className="w-4 h-4 text-pink-500 shrink-0" />
                <span>(450) 555-0145</span>
              </div>
            </div>
          </div>

          {/* Operating hours Col */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-mono tracking-widest font-semibold text-stone-200">
              OPERATING HOURS
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                <span>
                  Mon - Fri: 09:00 AM - 08:00 PM <br />
                  Sat: Closed <br />
                  Sun: 10:00 AM - 06:00 PM
                </span>
              </div>
            </div>
          </div>

          {/* Safe hygiene certification logos */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-mono tracking-widest font-semibold text-stone-200">
              SAFETY ACCREDITATION
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-xs text-stone-400">
                <CheckCircle2 className="w-4 h-4 text-pink-500 shrink-0" />
                <span>NEESA Certified Stylists</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-stone-400">
                <CheckCircle2 className="w-4 h-4 text-pink-500 shrink-0" />
                <span>Formaldehyde-Free Bonding</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-stone-400">
                <CheckCircle2 className="w-4 h-4 text-pink-500 shrink-0" />
                <span>Sanitized Precision Tools</span>
              </div>
            </div>
          </div>

        </div>

        {/* Sub bottom credits */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-stone-800 text-center text-[10px] text-stone-500">
          <p>© {new Date().getFullYear()} NashGlam Lashes. All rights reserved. Elegant web design crafted for beauty excellence.</p>
        </div>
      </footer>

      {/* 8. SHOPPING BAG AND DEPOSIT CART DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveCartItem}
            appointments={appointments}
            onRemoveAppointment={handleRemoveAppointment}
            isDarkMode={isDarkMode}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
