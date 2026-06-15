/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Clock, Scissors, Star, ShoppingBag, Calendar, Check } from 'lucide-react';
import { LashProduct } from '../types';

interface SetCardProps {
  key?: string;
  product: LashProduct;
  onAddToCart: (product: LashProduct, curl: string, length: string) => void;
  onBookSelected: (product: LashProduct) => void;
}

export default function SetCard({
  product,
  onAddToCart,
  onBookSelected,
}: SetCardProps) {
  const [selectedCurl, setSelectedCurl] = useState(product.curlOptions[0]);
  const [selectedLength, setSelectedLength] = useState(product.lengthOptions[1] || product.lengthOptions[0]);
  const [showQuickSuccess, setShowQuickSuccess] = useState(false);

  const handleAddToCartInternal = () => {
    onAddToCart(product, selectedCurl, selectedLength);
    setShowQuickSuccess(true);
    setTimeout(() => {
      setShowQuickSuccess(false);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-xs flex flex-col h-full group hover:shadow-md transition-all">
      
      {/* Product Image Showcase with beautiful tag */}
      <div className="relative aspect-video w-full overflow-hidden bg-stone-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-all duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-stone-900/10 to-transparent" />
        
        {/* Dynamic price bubble */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm shadow-xs border border-stone-100 py-1.5 px-3.5 rounded-full">
          <span className="font-serif text-lg font-bold text-stone-900">${product.price}</span>
        </div>

        {/* Mini duration tag */}
        <div className="absolute bottom-3 left-4 flex items-center space-x-1.5 bg-black/50 text-white/90 text-[10px] font-mono tracking-widest uppercase py-1 px-2.5 rounded-md backdrop-blur-xs">
          <Clock className="w-3 h-3 text-pink-500" />
          <span>{product.durationMin} MINS</span>
        </div>
      </div>

      {/* Content layout */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Title and descriptions */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-pink-500">
              {product.type} EXTENSIONS
            </span>
            <div className="flex items-center text-pink-500">
              <Star className="w-3 h-3 fill-pink-500" />
              <span className="text-[10px] font-bold text-stone-500 ml-1">TOP-RATED</span>
            </div>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-stone-900 font-medium tracking-tight">
            {product.name}
          </h3>
          <p className="font-sans text-stone-500 text-xs sm:text-sm leading-relaxed font-light">
            {product.description}
          </p>
        </div>

        {/* Benefits list */}
        <div className="space-y-1.5 border-t border-b border-stone-100 py-3 bg-stone-50/50 -mx-6 px-6">
          <span className="text-[10px] font-mono font-semibold text-stone-400 block tracking-wider">
            RECOMMENDED FOR:
          </span>
          <div className="space-y-1 mt-1">
            {product.benefits.slice(0, 3).map((benefit, idx) => (
              <div key={idx} className="flex items-start text-xs text-stone-600">
                <Check className="w-3.5 h-3.5 text-pink-600 mr-2 mt-0.5 shrink-0" />
                <span className="font-sans font-light">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Client Customization Dropdowns */}
        <div className="grid grid-cols-2 gap-3.5 pt-1.5">
          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">
              SELECT CURL
            </label>
            <select
              value={selectedCurl}
              onChange={(e) => setSelectedCurl(e.target.value)}
              className="w-full bg-stone-100 hover:bg-stone-200/70 border-0 rounded-lg text-xs font-medium text-stone-800 py-2.5 px-3 focus:ring-1 focus:ring-pink-500 transition-all outline-none"
            >
              {product.curlOptions.map((curl) => (
                <option key={curl} value={curl}>
                  {curl}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">
              SELECT LENGTH
            </label>
            <select
              value={selectedLength}
              onChange={(e) => setSelectedLength(e.target.value)}
              className="w-full bg-stone-100 hover:bg-stone-200/70 border-0 rounded-lg text-xs font-medium text-stone-800 py-2.5 px-3 focus:ring-1 focus:ring-pink-500 transition-all outline-none"
            >
              {product.lengthOptions.map((length) => (
                <option key={length} value={length}>
                  {length} (Perfect)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions bar */}
        <div className="flex space-x-2.5 pt-3">
          
          <button
            onClick={handleAddToCartInternal}
            className={`flex-1 py-3 px-3 rounded-xl border border-transparent text-xs font-sans font-bold tracking-wider transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
              showQuickSuccess 
                ? 'bg-emerald-700 text-stone-50' 
                : 'bg-stone-900 text-stone-50 hover:bg-pink-600'
            }`}
          >
            {showQuickSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300 animate-bounce" />
                <span>ADDED TO BAG</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>ADD CUT TO BAG</span>
              </>
            )}
          </button>

          <button
            onClick={() => onBookSelected(product)}
            className="px-4 py-3 bg-stone-100 border border-stone-200 hover:bg-stone-200/70 text-stone-700 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center space-x-1.5"
            title="Pre-select this set to schedule appointment"
          >
            <Calendar className="w-4 h-4 text-pink-600" />
            <span>BOOK AT STYLING</span>
          </button>

        </div>

      </div>
    </div>
  );
}
