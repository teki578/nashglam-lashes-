/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Plus, Minus, Trash2, Calendar, Sparkles, Check, BookmarkCheck } from 'lucide-react';
import { CartItem, Appointment } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  appointments: Appointment[];
  onRemoveAppointment: (id: string) => void;
  isDarkMode?: boolean;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  appointments,
  onRemoveAppointment,
  isDarkMode = false,
}: CartDrawerProps) {
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutFinished, setCheckoutFinished] = useState(false);

  const calculateSubtotal = () => {
    const productSum = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const appointmentSum = appointments.reduce((acc, app) => acc + app.totalPrice, 0);
    return productSum + appointmentSum;
  };

  const subtotal = calculateSubtotal();
  const tax = 0;
  const sanitizationFee = 0;
  const total = subtotal;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutFinished(true);
    }, 2000);
  };

  const handleResetCheckout = () => {
    setCheckoutFinished(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      {/* Dark overlay backdrop */}
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className={`w-screen max-w-md shadow-2xl h-full flex flex-col justify-between transition-colors duration-300 ${
            isDarkMode ? 'bg-[#1c1917] text-stone-100' : 'bg-stone-50 text-stone-800'
          }`}
        >
          {/* Header */}
          <div className={`p-6 border-b flex items-center justify-between transition-colors ${
            isDarkMode ? 'bg-[#0c0a09] border-stone-800 text-stone-100' : 'bg-white border-stone-200/60 text-stone-900'
          }`}>
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-pink-500" />
              <h2 className={`font-serif text-xl font-semibold ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>
                Your Luxury Bag
              </h2>
            </div>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-full border cursor-pointer transition-colors ${
                isDarkMode 
                  ? 'border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-900' 
                  : 'border-stone-200 text-stone-400 hover:text-stone-700 hover:bg-stone-50'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Core Content area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            <AnimatePresence mode="wait">
              
              {checkoutFinished ? (
                /* --- CHECKOUT SUCCESS OVERLAY --- */
                <motion.div
                  key="checkout-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center text-center py-8 space-y-4"
                >
                  <div className={`w-14 h-14 rounded-full border flex items-center justify-center transition-colors ${
                    isDarkMode ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-600'
                  }`}>
                    <Check className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className={`font-serif text-xl font-bold ${isDarkMode ? 'text-stone-50' : 'text-stone-900'}`}>Order Locked In!</h3>
                    <p className={`text-xs font-sans mt-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>
                      Your luxurious lash mapping order, reservation holds, and bespoke care preparations have been queued at the boutique frontdesk.
                    </p>
                  </div>
                  
                  {/* Mock invoice details */}
                  <div className={`border rounded-xl p-4 w-full text-xs font-mono text-left divide-y transition-colors ${
                    isDarkMode 
                      ? 'bg-[#0c0a09] border-stone-800 text-stone-300 divide-stone-800/85' 
                      : 'bg-white border-stone-200 text-stone-700 divide-stone-100'
                  }`}>
                    <div className={`pb-2.5 flex items-center justify-between text-[11px] font-bold ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>
                      <span>BOUTIQUE ORDER ID</span>
                      <span className="text-pink-500 font-semibold">#LASH-ORDER-{Math.floor(10000 + Math.random() * 90000)}</span>
                    </div>
                    <div className="py-2 flex justify-between">
                      <span>Total Processing Items</span>
                      <span className={`font-semibold ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>{cartItems.length + appointments.length}</span>
                    </div>
                    <div className="py-2 flex justify-between text-pink-500 font-bold">
                      <span>Grand Total Closed</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleResetCheckout}
                    className={`w-full py-3 rounded-xl text-xs font-sans font-bold tracking-widest cursor-pointer text-center transition-colors ${
                      isDarkMode ? 'bg-stone-100 hover:bg-stone-200 text-[#0c0a09]' : 'bg-stone-900 hover:bg-stone-800 text-stone-50'
                    }`}
                  >
                    CONTINUE STUDYING DESIGNS
                  </button>
                </motion.div>
              ) : (
                
                /* --- GENERAL CART ITEMS LISTING --- */
                <motion.div key="cart-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  
                  {/* Empty warning helper */}
                  {cartItems.length === 0 && appointments.length === 0 && (
                    <div className="flex flex-col items-center justify-center text-center py-16 space-y-3.5">
                      <div className={`p-3 rounded-full transition-colors ${isDarkMode ? 'bg-stone-900 text-stone-500' : 'bg-stone-100 text-stone-400'}`}>
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                      <div>
                        <p className={`font-serif text-lg font-medium ${isDarkMode ? 'text-stone-100' : 'text-stone-800'}`}>Your bag is currently empty</p>
                        <p className={`text-xs mt-1.5 max-w-xs font-sans font-light ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>
                          Pick a lash extension set, take the style consultation quiz, or reserve a luxury therapy slot to continue.
                        </p>
                      </div>
                      <button
                        onClick={onClose}
                        className={`mt-2 py-2 px-5 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                          isDarkMode ? 'bg-stone-100 hover:bg-stone-200 text-stone-950' : 'bg-stone-900 hover:bg-stone-800 text-[#f5f5f4]'
                        }`}
                      >
                        Browse Services Lookbook
                      </button>
                    </div>
                  )}

                  {/* 1. SECURED APPOINTMENTS LIST */}
                  {appointments.length > 0 && (
                    <div className="space-y-3">
                      <span className={`text-[10px] font-mono font-bold tracking-wider uppercase flex items-center space-x-1 ${
                        isDarkMode ? 'text-pink-400' : 'text-pink-600'
                      }`}>
                        <Calendar className="w-3.5 h-3.5" />
                        <span>RESERVED SLOTS ({appointments.length})</span>
                      </span>
                      
                      <div className="space-y-2.5">
                        {appointments.map((app) => (
                          <div
                            key={app.id}
                            className={`p-4 rounded-xl relative space-y-2.5 border transition-colors ${
                              isDarkMode 
                                ? 'bg-emerald-950/15 border-emerald-800/40' 
                                : 'bg-emerald-50/40 border-emerald-200'
                            }`}
                          >
                            <button
                              onClick={() => onRemoveAppointment(app.id)}
                              className="absolute top-3.5 right-3.5 text-stone-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                              title="Cancel secure hold"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                            <div className="pr-6">
                              <span className={`text-[9px] font-bold font-mono tracking-wider py-0.5 px-2 rounded-full uppercase ${
                                isDarkMode ? 'bg-emerald-950/80 text-emerald-300' : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                SECURED APPOINTMENT
                              </span>
                              <h4 className={`font-serif text-base font-semibold mt-1.5 ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>{app.style.name}</h4>
                              <p className={`text-[11px] font-mono mt-0.5 uppercase ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>
                                {app.date} at <span className="font-bold text-pink-500">{app.timeSlot}</span>
                              </p>
                            </div>

                            <div className={`flex items-center text-xs space-x-2 pt-1 border-t ${
                              isDarkMode ? 'border-emerald-900/40 text-stone-300' : 'border-emerald-200/50 text-stone-600'
                            }`}>
                              <img src={app.artist.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                              <span>Stylist: <span className={`font-semibold ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>{app.artist.name}</span></span>
                              <span className="mx-1 text-stone-400">•</span>
                              <span className={`font-bold ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>${app.totalPrice}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 2. SERVICES & PRODUCTS PRODUCTS LIST */}
                  {cartItems.length > 0 && (
                    <div className="space-y-3">
                      <span className={`text-[10px] font-mono font-bold tracking-wider uppercase flex items-center space-x-1 ${
                        isDarkMode ? 'text-stone-500' : 'text-stone-400'
                      }`}>
                        <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                        <span>CUSTOMIZED TREATMENTS ({cartItems.length})</span>
                      </span>

                      <div className="space-y-3.5">
                        {cartItems.map((item) => (
                          <div
                            key={item.id}
                            className={`p-4 rounded-xl flex space-x-3 relative border transition-colors ${
                              isDarkMode 
                                ? 'bg-[#0c0a09] border-stone-800 shadow-stone-950/25' 
                                : 'bg-white border-stone-200 shadow-2xs'
                            }`}
                          >
                            {/* Product photo */}
                            <img
                              src={item.product.image}
                              alt=""
                              className="w-16 h-16 rounded-lg object-cover bg-stone-100"
                            />

                            {/* Details info */}
                            <div className="flex-1 flex flex-col justify-between pr-5">
                              <div>
                                <h4 className={`font-serif text-[14px] font-semibold leading-tight ${
                                  isDarkMode ? 'text-stone-100' : 'text-stone-900'
                                }`}>
                                  {item.product.name}
                                </h4>
                                <div className="flex flex-wrap gap-2.5 mt-1 font-mono text-[10px] text-stone-400 leading-none">
                                  <span>CURL: <span className={isDarkMode ? 'font-bold text-stone-300' : 'font-bold text-stone-700'}>{item.selectedCurl}</span></span>
                                  <span>LEN: <span className={isDarkMode ? 'font-bold text-stone-300' : 'font-bold text-stone-700'}>{item.selectedLength}</span></span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-1.5">
                                <span className={`text-sm font-bold ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>
                                  ${item.product.price}
                                </span>
                                
                                {/* Quantity editor */}
                                <div className={`flex items-center space-x-2.5 border rounded-lg p-1 transition-colors ${
                                  isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-stone-50 border-stone-200'
                                }`}>
                                  <button
                                    onClick={() => onUpdateQuantity(item.id, -1)}
                                    className={`p-1 rounded-md text-stone-400 hover:text-stone-700 cursor-pointer transition-colors ${
                                      isDarkMode ? 'hover:bg-stone-800 hover:text-stone-200' : 'hover:bg-stone-100'
                                    }`}
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className={`font-mono text-xs font-bold ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => onUpdateQuantity(item.id, 1)}
                                    className={`p-1 rounded-md text-stone-400 hover:text-stone-700 cursor-pointer transition-colors ${
                                      isDarkMode ? 'hover:bg-stone-800 hover:text-stone-200' : 'hover:bg-stone-100'
                                    }`}
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Remove button */}
                            <button
                              onClick={() => onRemoveItem(item.id)}
                              className="absolute top-4 right-4 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </motion.div>
              )}

            </AnimatePresence>

          </div>

          {/* Subtotal fee summary footer */}
          {!checkoutFinished && (cartItems.length > 0 || appointments.length > 0) && (
            <div className={`p-6 border-t space-y-4 transition-colors ${
              isDarkMode ? 'bg-[#0c0a09] border-stone-800' : 'bg-white border-stone-200/60'
            }`}>
              
              <div className={`space-y-2 border-b pb-3 ${isDarkMode ? 'border-stone-800' : 'border-stone-100'}`}>
                <div className={`flex justify-between text-xs font-sans ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>
                  <span>Cart Subtotal</span>
                  <span className={`font-semibold ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>${subtotal.toFixed(2)}</span>
                </div>
              </div>

              <div className={`flex justify-between text-base font-serif font-bold ${
                isDarkMode ? 'text-stone-100' : 'text-stone-900'
              }`}>
                <span>Grand Due Total</span>
                <span className="text-pink-500 font-extrabold">${total.toFixed(2)}</span>
              </div>

              {/* Checkout locked triggers */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className={`w-full py-4.5 border border-transparent text-xs font-sans font-bold tracking-widest uppercase rounded-xl transition-all shadow-sm flex items-center justify-center space-x-2 cursor-pointer disabled:cursor-wait ${
                  isDarkMode 
                    ? 'bg-stone-100 hover:bg-stone-200 text-[#0c0a09] disabled:bg-stone-800 disabled:text-stone-500' 
                    : 'bg-stone-900 hover:bg-stone-800 text-[#f5f5f4] disabled:bg-stone-400'
                }`}
              >
                {isCheckingOut ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>LOCKED SECURING...</span>
                  </>
                ) : (
                  <>
                    <BookmarkCheck className="w-4 h-4" />
                    <span>FINALIZE & LOCK BAG DEPOSIT</span>
                  </>
                )}
              </button>

              <p className={`text-[10px] font-sans text-center leading-normal ${
                isDarkMode ? 'text-stone-500' : 'text-stone-400'
              }`}>
                Article fees are fully refundable up to 24 hours prior to appointment slot arrival.
              </p>
            </div>
          )}

        </motion.div>
      </div>
    </div>
  );
}
