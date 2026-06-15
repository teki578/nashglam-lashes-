/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Eye, Camera, RefreshCw, Sparkles, Sliders, Check, HelpCircle, ArrowRight } from 'lucide-react';
import { EyeShape, LashVibe, LashStyleType, LashProduct } from '../types';
import { STYLING_REC_MATRIX, LASH_PRODUCTS } from '../data';

const MODEL_IMAGE = '/src/assets/images/makeup_model_portrait_1781406443084.jpg';

interface InteractiveCustomizerProps {
  onAddCustomSetToCart: (product: LashProduct, curl: string, length: string) => void;
  onBookCustomSet: (product: LashProduct) => void;
}

export default function InteractiveCustomizer({
  onAddCustomSetToCart,
  onBookCustomSet,
}: InteractiveCustomizerProps) {
  // Mode selection: "quiz" vs "tryon"
  const [activeTab, setActiveTab] = useState<'quiz' | 'tryon'>('quiz');

  // --- QUIZ STATE ---
  const [quizEyeShape, setQuizEyeShape] = useState<EyeShape>(EyeShape.ALMOND);
  const [quizVibe, setQuizVibe] = useState<LashVibe>(LashVibe.NATURAL);
  const quizRecommendation = STYLING_REC_MATRIX[quizEyeShape]?.[quizVibe] || STYLING_REC_MATRIX.Almond.Natural;

  // --- TRY-ON STATE ---
  const [tryonStyle, setTryonStyle] = useState<LashStyleType>(LashStyleType.HYBRID);
  const [tryonColor, setTryonColor] = useState<'black' | 'espresso' | 'gold'>('black');
  
  // Try-on calibration settings
  const [useWebcam, setUseWebcam] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  // manual calibration state so users can perfectly fit lashes on themselves or the model image
  const [lashScale, setLashScale] = useState(100); // 70 to 140%
  const [verticalPos, setVerticalPos] = useState(50); // 0 to 100% (y displacement)
  const [horizontalSpan, setHorizontalSpan] = useState(50); // 0 to 100% (distance between eyes)
  const [lashCurve, setLashCurve] = useState(1.0); // 0.6 to 1.6 (bend factor)

  const videoRef = useRef<HTMLVideoElement>(null);

  // Clean up camera stream and manage video bindings
  const stopWebcam = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setUseWebcam(false);
  };

  useEffect(() => {
    return () => {
      // stop webcam on unmount
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  // Ensure webcam stream binds correctly when video ref is mounted
  useEffect(() => {
    if (useWebcam && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [useWebcam, cameraStream]);

  // Request camera access
  const handleStartWebcam = async () => {
    setCameraError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError("Camera access is not supported by your browser or in this embed frame. Feel free to preview style mappings using our high-fidelity beauty model!");
      setUseWebcam(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false
      });
      setCameraStream(stream);
      setUseWebcam(true);
    } catch (err: any) {
      console.error("Camera access failed", err);
      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError' || err?.message?.includes('Permission dismissed')) {
        setCameraError("Camera permission request was dismissed or denied. Please update the browser settings or use our default digital beauty model instead.");
      } else {
        setCameraError("Unable to access front camera. Check your permission settings, or explore styles on our pre-loaded beauty model.");
      }
      setUseWebcam(false);
    }
  };

  // Toggle mode
  const handleToggleSource = () => {
    if (useWebcam) {
      stopWebcam();
    } else {
      handleStartWebcam();
    }
  };

  // Reset calibration sliders to midpoints
  const handleResetCalibration = () => {
    setLashScale(100);
    setVerticalPos(50);
    setHorizontalSpan(50);
    setLashCurve(1.0);
  };

  // Find related product card
  const getRecommendedProduct = (): LashProduct => {
    const sId = quizRecommendation.recommendedServiceId;
    return LASH_PRODUCTS.find(p => p.id === sId) || LASH_PRODUCTS[0];
  };

  const recommendedProduct = getRecommendedProduct();

  // Color mappings
  const lashColorHex = {
    black: '#1c1917', // stone-900 / soft matte noir
    espresso: '#451a03', // amber-950 / sweet chocolate
    gold: '#db2777', // pink-600 / luxury rose gold glamour glow
  };

  // Render Lash SVG path according to custom parameters
  const renderLashGraphic = (isLeft: boolean) => {
    const direction = isLeft ? 1 : -1;
    // Generate organic curves using cubic bezier paths
    const startX = 20;
    const endX = 140;
    const baseLineY = 80;
    
    // Scale curve paths dynamically with multipliers
    const bendVal = 50 * lashCurve;
    
    const fillStyle = 'none';
    const strokeColor = lashColorHex[tryonColor];
    
    // Create an elegant array of lashes
    const lashes = [];
    const count = tryonStyle === LashStyleType.CLASSIC ? 16 
                : tryonStyle === LashStyleType.HYBRID ? 24 
                : tryonStyle === LashStyleType.WET_SET ? 28 
                : 32; // Volume

    for (let i = 0; i <= count; i++) {
      const fraction = i / count;
      // Position on eye arc (sinusoidal)
      const x = startX + (endX - startX) * fraction;
      // Slight dip on edges, crown center
      const yArc = baseLineY - Math.sin(fraction * Math.PI) * 15;
      
      // Lash length variables
      let lengthMultiplier = 1.0;
      // Cat-eye style grows longer toward the exterior edge
      if (tryonStyle === LashStyleType.VOLUME) {
        // volume has full even length
        lengthMultiplier = 0.9 + Math.sin(fraction * Math.PI) * 0.4;
      } else if (tryonStyle === LashStyleType.WET_SET) {
        lengthMultiplier = i % 4 === 0 ? 1.35 : 0.8 + Math.sin(fraction * Math.PI) * 0.35;
      } else if (tryonStyle === LashStyleType.HYBRID) {
        // wispy texture (random spikiness)
        lengthMultiplier = i % 3 === 0 ? 1.3 : 0.8 + Math.sin(fraction * Math.PI) * 0.3;
      } else {
        // classic (even graduation)
        lengthMultiplier = 0.7 + Math.sin(fraction * Math.PI) * 0.3;
      }

      // Left eye exterior is left, right eye exterior is right
      const isExterior = isLeft ? fraction > 0.6 : fraction < 0.4;
      if (isExterior && tryonStyle === LashStyleType.VOLUME) {
        lengthMultiplier *= 1.25;
      }

      const totalLength = (20 + (lashScale - 100) * 0.15) * lengthMultiplier;
      
      // Control points for smooth organic curve sweeping outward
      const sweepFactor = (isLeft ? 1 : -1) * (15 + fraction * 20) * lashCurve;
      const cp1x = x + sweepFactor * 0.3;
      const cp1y = yArc - totalLength * 0.4;
      const cp2x = x + sweepFactor * 0.7;
      const cp2y = yArc - totalLength * 0.82;
      const targetX = x + sweepFactor;
      const targetY = yArc - totalLength;

      lashes.push(
        <path
          key={i}
          d={`M ${x} ${yArc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${targetX} ${targetY}`}
          stroke={strokeColor}
          strokeWidth={tryonStyle === LashStyleType.WET_SET ? 2.5 : tryonStyle === LashStyleType.VOLUME ? 2.2 : 1.5}
          strokeLinecap="round"
          fill="none"
          opacity={tryonStyle === LashStyleType.WET_SET ? 0.92 : 0.85}
        />
      );
    }

    return (
      <svg viewBox="0 0 160 100" className="w-full h-full drop-shadow-lg overflow-visible">
        {/* Subtle eyeliner backing path */}
        <path
          d={`M ${startX} ${baseLineY} Q 80 ${baseLineY - 18} ${endX} ${baseLineY}`}
          stroke={strokeColor}
          strokeWidth={tryonStyle === LashStyleType.WET_SET ? 4.5 : tryonStyle === LashStyleType.VOLUME ? 5.2 : 3}
          fill="none"
          strokeLinecap="round"
          opacity={0.92}
        />
        
        {/* Draw all the lashes fibers */}
        {lashes}
      </svg>
    );
  };

  return (
    <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
        
        {/* LEFT COLUMN: Controls and Config options */}
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono font-medium tracking-widest text-pink-500 uppercase bg-pink-50 px-2.5 py-1 rounded-full border border-pink-205/30">
              Lash Fitting Studio
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 tracking-tight font-medium">
              Consultation & Design
            </h2>
            <p className="font-sans text-stone-500 text-sm max-w-xl">
              Take our micro-mapping styling quiz or toggle the interactive virtual lens of our boutique to design your ultimate custom-length eyelash extensions below.
            </p>
          </div>

          {/* TAB TOGGLE: QUIZ VS TRYON */}
          <div className="flex border-b border-stone-200 bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                activeTab === 'quiz'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-pink-500" />
              <span>CUSTOM DESIGN QUIZ</span>
            </button>
            <button
              onClick={() => setActiveTab('tryon')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                activeTab === 'tryon'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Eye className="w-4 h-4 text-pink-500" />
              <span>FITTING STUDIO (TRY-ON)</span>
            </button>
          </div>

          {/* CONTENT ACCORDING TO TAB */}
          {activeTab === 'quiz' ? (
            <div className="space-y-6">
              
              {/* Quiz Selection Controls */}
              <div className="space-y-5">
                {/* 1. Eye Shape Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-widest text-stone-700 flex items-center space-x-1.5">
                    <span>1. SELECT YOUR EYE SHAPE</span>
                    <HelpCircle className="w-3.5 h-3.5 text-stone-400" />
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {Object.values(EyeShape).map((shape) => (
                      <button
                        key={shape}
                        type="button"
                        onClick={() => setQuizEyeShape(shape)}
                        className={`py-3 px-4 border rounded-xl text-left transition-all relative overflow-hidden flex flex-col cursor-pointer ${
                          quizEyeShape === shape
                            ? 'border-pink-500 bg-pink-50/40 shadow-xs text-stone-900'
                            : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                        }`}
                      >
                        <span className="text-sm font-semibold tracking-wide">{shape} Shape</span>
                        <span className="text-[11px] text-stone-400 mt-0.5 font-light">
                          {shape === EyeShape.ALMOND && 'Highly symmetrical, soft outer slope'}
                          {shape === EyeShape.ROUND && 'Radiant, deep open round structure'}
                          {shape === EyeShape.HOODED && 'Folded crease framing upper lashes'}
                          {shape === EyeShape.MONOLID && 'Smooth elegant layout without crease'}
                        </span>
                        {quizEyeShape === shape && (
                          <div className="absolute right-3.5 top-3.5 bg-pink-600 text-white rounded-full p-0.5">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Lash Vibe Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold tracking-widest text-stone-700">
                    2. SELECT YOUR DESIRED VIBE
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {Object.values(LashVibe).map((vibe) => (
                      <button
                        key={vibe}
                        type="button"
                        onClick={() => setQuizVibe(vibe)}
                        className={`py-2 px-3 border rounded-lg text-center transition-all text-xs font-medium cursor-pointer ${
                          quizVibe === vibe
                            ? 'border-pink-500 bg-pink-50 text-pink-900 shadow-xs'
                            : 'border-stone-200 bg-white text-stone-500 hover:border-stone-300'
                        }`}
                      >
                        {vibe}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quiz Results Card */}
              <motion.div
                key={quizEyeShape + quizVibe}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#fcfaf7] border border-stone-300/40 rounded-xl p-5 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                  <div>
                    <h4 className="text-xs font-mono font-semibold text-pink-600 tracking-wider">
                      RECOMMENDED FORMULA
                    </h4>
                    <p className="text-xl font-serif font-semibold text-stone-900 mt-0.5">
                      The {quizRecommendation.lashVibe} Mapping
                    </p>
                  </div>
                  <div className="px-3 py-1 bg-pink-100 border border-pink-300/60 rounded-full text-[11px] font-mono font-medium text-pink-900 self-start sm:self-center">
                    Curl: <span className="font-bold">{quizRecommendation.curl}</span>
                  </div>
                </div>

                <div className="text-sm font-sans text-stone-700 leading-relaxed border-t border-stone-200/60 pt-3">
                  {quizRecommendation.reasonText}
                </div>

                <div className="grid grid-cols-2 gap-4 bg-white/70 p-3 rounded-lg text-xs font-mono border border-stone-200/45">
                  <div>
                    <span className="text-stone-400 block text-[10px]">LASH TYPE</span>
                    <span className="text-stone-800 font-semibold">{quizRecommendation.styleType} Set</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">MAPPED PATTERN</span>
                    <span className="text-stone-800 font-semibold">{quizRecommendation.lengthPattern}</span>
                  </div>
                </div>

                {/* Embedded mapping vector preview */}
                <div className="border border-stone-200 bg-white py-4 rounded-lg flex items-center justify-center">
                  <div className="relative w-48 h-12 flex items-center justify-center overflow-visible">
                    {/* Simplified eye design line */}
                    <svg viewBox="0 0 160 100" className="w-full h-full overflow-visible">
                      {/* Simple cute iris */}
                      <circle cx="80" cy="80" r="14" fill="#a78bfa" opacity={0.25} />
                      <circle cx="80" cy="80" r="6" fill="#1c1917" />
                      {/* Eyelid baseline line */}
                      <path d="M 20 80 Q 80 62 140 80" stroke="#78716c" strokeWidth={1.5} fill="none" opacity={0.4} />
                      
                      {/* Custom mapped lashes based on result */}
                      <path d="M 20 80 Q 80 65 140 80" stroke="#1c1917" strokeWidth={quizRecommendation.styleType === LashStyleType.CLASSIC ? 3 : 5} fill="none" />
                      
                      {/* Stylized custom spike strokes */}
                      {Array.from({ length: 15 }).map((_, i) => {
                        const fr = i / 14;
                        const lx = 20 + 120 * fr;
                        const lyArc = 80 - Math.sin(fr * Math.PI) * 15;
                        const isTail = fr > 0.6;
                        
                        let strokeH = 14;
                        if (quizRecommendation.styleType === LashStyleType.VOLUME) strokeH = 20;
                        if (quizRecommendation.styleType === LashStyleType.HYBRID && i % 3 === 0) strokeH = 22;
                        if (isTail && quizRecommendation.lashVibe.toLowerCase().includes('cat')) strokeH = 24;

                        // Curl sweeps
                        const sweep = isLeft => (12 + fr * 15);
                        return (
                          <path
                            key={i}
                            d={`M ${lx} ${lyArc} Q ${lx + 10} ${lyArc - strokeH * 0.4} ${lx + 15} ${lyArc - strokeH}`}
                            stroke="#1c1917"
                            strokeWidth={quizRecommendation.styleType === LashStyleType.VOLUME ? 2.2 : 1.3}
                            fill="none"
                            opacity={0.8}
                          />
                        );
                      })}
                    </svg>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 pt-2">
                  <button
                    onClick={() => onAddCustomSetToCart(recommendedProduct, quizRecommendation.curl, '12mm')}
                    className="flex-1 py-3 bg-stone-900 border border-stone-900 rounded-xl text-xs font-semibold tracking-wider text-white hover:bg-stone-800 transition-all cursor-pointer text-center"
                  >
                    ADD REC SET TO BAG (${recommendedProduct.price})
                  </button>
                  <button
                    onClick={() => onBookCustomSet(recommendedProduct)}
                    className="flex-1 py-3 bg-transparent border border-stone-300 hover:border-stone-400 rounded-xl text-xs font-semibold tracking-wider text-stone-700 hover:text-stone-900 hover:bg-stone-50 transition-all cursor-pointer flex items-center justify-center space-x-1"
                  >
                    <span>BOOK DESIGN APPOINTMENT</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </motion.div>
            </div>
          ) : (
            /* --- TRY-ON STUDIO TAB CONTENT --- */
            <div className="space-y-5">
              
              {/* Style selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold tracking-widest text-stone-700">
                  CHOOSE LASH FITTING STYLE
                </label>
                <div className="grid grid-cols-4 gap-1.5 p-1 bg-stone-100 rounded-lg">
                  {Object.values(LashStyleType).map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setTryonStyle(style)}
                      className={`py-2 text-[10px] font-bold tracking-wider rounded-md uppercase transition-all cursor-pointer ${
                        tryonStyle === style
                          ? 'bg-white text-stone-900 shadow-xs'
                          : 'text-stone-500 hover:text-stone-900'
                      }`}
                    >
                      {style.replace(' Lash', '')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color style selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold tracking-widest text-stone-700">
                  EYELASH COLOR PIGMENTS
                </label>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setTryonColor('black')}
                    className="flex items-center space-x-1.5 py-1.5 px-3.5 border rounded-full text-xs font-medium bg-white hover:bg-stone-50 cursor-pointer"
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-stone-900 border border-stone-400/30" />
                    <span className={tryonColor === 'black' ? 'font-bold text-stone-900' : 'text-stone-600'}>Matte Noir</span>
                  </button>
                  <button
                    onClick={() => setTryonColor('espresso')}
                    className="flex items-center space-x-1.5 py-1.5 px-3.5 border rounded-full text-xs font-medium bg-white hover:bg-stone-50 cursor-pointer"
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-amber-955 border border-stone-400/30" />
                    <span className={tryonColor === 'espresso' ? 'font-bold text-stone-900' : 'text-stone-600'}>Espresso Silk</span>
                  </button>
                  <button
                    onClick={() => setTryonColor('gold')}
                    className="flex items-center space-x-1.5 py-1.5 px-3.5 border rounded-full text-xs font-medium bg-white hover:bg-stone-50 cursor-pointer"
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-pink-600 border border-stone-400/30" />
                    <span className={tryonColor === 'gold' ? 'font-bold text-stone-900' : 'text-stone-600'}>Rose Gold Gloss</span>
                  </button>
                </div>
              </div>

              {/* Calibration Alignment sliders */}
              <div className="bg-white border border-stone-200 rounded-xl p-4 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-widest text-stone-800 flex items-center space-x-1">
                    <Sliders className="w-3.5 h-3.5 text-pink-600" />
                    <span>LASH ALIGNMENT CALIBRATION</span>
                  </span>
                  <button
                    onClick={handleResetCalibration}
                    className="text-[10px] font-mono tracking-wider font-semibold text-stone-400 hover:text-pink-600 flex items-center space-x-1 cursor-pointer"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                    <span>RESET</span>
                  </button>
                </div>

                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono text-stone-500">
                      <span>Lash Scale (Length)</span>
                      <span className="font-semibold text-stone-800">{Math.round((tryonStyle === LashStyleType.CLASSIC ? 11 : tryonStyle === LashStyleType.HYBRID ? 12 : tryonStyle === LashStyleType.WET_SET ? 13 : 14) * (lashScale/100))}mm</span>
                    </div>
                    <input
                      type="range"
                      min="70"
                      max="140"
                      value={lashScale}
                      onChange={(e) => setLashScale(Number(e.target.value))}
                      className="w-full accent-pink-600 h-1 bg-stone-100 rounded-lg appearance-none cursor-ew-resize"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono text-stone-500">
                      <span>Vertical Alignment</span>
                      <span className="font-semibold text-stone-800">{verticalPos}%</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="85"
                      value={verticalPos}
                      onChange={(e) => setVerticalPos(Number(e.target.value))}
                      className="w-full accent-pink-600 h-1 bg-stone-100 rounded-lg appearance-none cursor-ew-resize"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono text-stone-500">
                      <span>Eye Distance Span</span>
                      <span className="font-semibold text-stone-800">{horizontalSpan}%</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="80"
                      value={horizontalSpan}
                      onChange={(e) => setHorizontalSpan(Number(e.target.value))}
                      className="w-full accent-pink-600 h-1 bg-stone-100 rounded-lg appearance-none cursor-ew-resize"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono text-stone-500">
                      <span>Lash Bend Curvature (Curl)</span>
                      <span className="font-semibold text-stone-800">x{lashCurve.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="1.7"
                      step="0.1"
                      value={lashCurve}
                      onChange={(e) => setLashCurve(Number(e.target.value))}
                      className="w-full accent-pink-600 h-1 bg-stone-100 rounded-lg appearance-none cursor-ew-resize"
                    />
                  </div>
                </div>
              </div>

              {/* Purchase Curated set aligned with Try-on selection */}
              <div className="bg-stone-900 rounded-xl p-4 text-stone-50 border border-stone-800 flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-sm">
                <div>
                  <span className="text-[10px] font-mono text-stone-400 block tracking-widest">FITTED SELECTION</span>
                  <span className="text-sm font-semibold tracking-wide text-white block mt-0.5">{tryonStyle} Customized Set</span>
                  <span className="text-xs text-pink-500 font-mono">Mapped at approx. {Math.round((tryonStyle === LashStyleType.CLASSIC ? 11 : 13) * (lashScale/100))}mm</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      const matchedProd = LASH_PRODUCTS.find(p => p.type === tryonStyle) || LASH_PRODUCTS[0];
                      onAddCustomSetToCart(matchedProd, 'Elegance D-Curl', `${Math.round(12 * (lashScale/100))}mm`);
                    }}
                    className="px-4 py-2.5 rounded-lg bg-pink-600 text-stone-50 text-xs font-bold font-sans tracking-wider hover:bg-pink-500 transition-all cursor-pointer"
                  >
                    ADD SET TO BAG
                  </button>
                  <button
                    onClick={() => {
                      const matchedProd = LASH_PRODUCTS.find(p => p.type === tryonStyle) || LASH_PRODUCTS[0];
                      onBookCustomSet(matchedProd);
                    }}
                    className="p-2.5 rounded-lg bg-stone-800 text-stone-300 text-xs font-semibold font-mono hover:bg-stone-700 transition-all cursor-pointer"
                    title="Book design salon appointment"
                  >
                    BOOK NOW
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Immersive Try-On Interface Viewport */}
        <div className="w-full lg:w-[420px] mt-8 lg:mt-0 flex flex-col items-center">
          
          <div className="relative w-full max-w-[360px] aspect-[3/4] bg-stone-900 rounded-2xl overflow-hidden shadow-md group border border-stone-200 dark:border-stone-800">
            
            {/* Viewport content */}
            {useWebcam ? (
              <div className="absolute inset-0 w-full h-full bg-black">
                <video
                  ref={videoRef}
                  playsInline
                  autoPlay
                  muted
                  className="w-full h-full object-cover scale-x-[-1]" // mirrors user look
                />
              </div>
            ) : (
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={MODEL_IMAGE}
                  alt="Neutral beauty model fallback"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {/* HIGH-FIDELITY OVERLAY LASHES */}
            {/* Left and Right eyes positioning boxes */}
            <div className="absolute inset-0 z-20 pointer-events-none">
              
              {/* Left Eye Eyelash Overlay Container */}
              <div
                className="absolute w-24 h-16 transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  // calculate coordinates mapped nicely onto eyes
                  // Model eyes are localized around 35% x-axis (left) and 38% y-axis (vertical)
                  left: `${useWebcam ? 50 - (horizontalSpan - 50) * 0.3 - 15 : 35.5}%`,
                  top: `${useWebcam ? verticalPos : 38.5}%`,
                  transform: `translate(-50%, -50%) scale(${(lashScale / 100) * (useWebcam ? 1 : 0.95)})`,
                  opacity: 0.95,
                }}
              >
                {renderLashGraphic(true)}
              </div>

              {/* Right Eye Eyelash Overlay Container */}
              <div
                className="absolute w-24 h-16 transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  // Model eyes are localized around 64.5% x-axis (right) and 38% y-axis (vertical)
                  left: `${useWebcam ? 50 + (horizontalSpan - 50) * 0.3 + 15 : 64.5}%`,
                  top: `${useWebcam ? verticalPos : 38.5}%`,
                  transform: `translate(-50%, -50%) scale(${(lashScale / 100) * (useWebcam ? 1 : 0.95)}) scaleX(-1)`, // horizontal flip
                  opacity: 0.95,
                }}
              >
                {renderLashGraphic(false)}
              </div>

            </div>

            {/* Camera interface details & styling */}
            <div className="absolute inset-x-0 top-0 p-4 bg-gradient-to-b from-black/60 to-transparent z-10 flex items-center justify-between text-white">
              <span className="flex items-center space-x-1.5 text-[10px] uppercase font-mono tracking-widest text-[#f5f5f4]/80">
                <div className={`w-2 h-2 rounded-full ${useWebcam ? 'bg-emerald-500 animate-pulse' : 'bg-pink-400'}`} />
                <span>{useWebcam ? 'LIVE CAMERA LENS' : 'FITTING MODEL PORTRAIT'}</span>
              </span>
              <span className="text-[9px] font-mono text-[#f5f5f4]/50">300dpi / Mirror</span>
            </div>

            {/* Error notifications */}
            {cameraError && (
              <div className="absolute top-12 inset-x-4 p-2.5 bg-rose-950/90 border border-rose-800/80 text-rose-100 text-[11px] rounded-lg z-30 leading-snug flex items-start justify-between gap-1.5 shadow-md">
                <span className="flex-1">{cameraError}</span>
                <button
                  type="button"
                  onClick={() => setCameraError(null)}
                  className="text-rose-400 hover:text-white font-bold px-1 focus:outline-none cursor-pointer self-start text-[12px]"
                  aria-label="Dismiss error"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Source switch triggers */}
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-10 flex justify-between items-center">
              <button
                type="button"
                onClick={handleToggleSource}
                className="flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 py-2 px-4 rounded-xl text-xs font-semibold backdrop-blur-md transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4 text-pink-400" />
                <span>{useWebcam ? 'Use Digital Model' : 'Enable My Camera'}</span>
              </button>

              <span className="text-[10px] text-white/50 font-mono italic">
                Manual Scale Fit (10x Lens)
              </span>
            </div>

          </div>

          <p className="text-[11px] font-sans text-center text-stone-400 mt-3 max-w-[320px]">
            {useWebcam 
              ? "Drag the sliders on the left to perfectly fit the luxury lashes onto your eyes."
              : "Previewing customized lashes maps on our stock digital beauty design avatar."}
          </p>

        </div>

      </div>
    </div>
  );
}
