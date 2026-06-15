/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, User, Phone, Mail, Clock, MessageSquare, CheckCircle, Award, Star, ArrowRight, CornerDownRight } from 'lucide-react';
import { LashProduct, LashArtist, Appointment } from '../types';
import { LASH_ARTISTS, LASH_PRODUCTS } from '../data';

interface BookingFormProps {
  selectedProduct: LashProduct | null;
  onBookingConfirmed: (appointment: Appointment) => void;
  onSelectProduct: (product: LashProduct) => void;
  isDarkMode?: boolean;
}

export default function BookingForm({
  selectedProduct,
  onBookingConfirmed,
  onSelectProduct,
  isDarkMode = false,
}: BookingFormProps) {
  const [activeArtist, setActiveArtist] = useState<LashArtist>(LASH_ARTISTS[0]);
  const [bookingStep, setBookingStep] = useState<'form' | 'deposit'>('form');
  
  // Custom Date Grid Generator (today + next 7 days layout for elite scannability)
  const [selectedDateIndex, setSelectedDateIndex] = useState(1);
  const [availableDates, setAvailableDates] = useState<{ label: string; dateStr: string; dayName: string }[]>([]);
  
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('11:00 AM');
  
  // Intake Forms state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Deposit Payment Card states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
    const matches = val.match(/.{1,4}/g);
    setCardNumber(matches ? matches.join(' ') : val);
  };

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 3) {
      setCardExpiry(`${val.slice(0, 2)}/${val.slice(2, 4)}`);
    } else {
      setCardExpiry(val);
    }
  };

  const handleCardCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCardCvc(val);
  };

  // Voucher Success State
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);

  // Generate the next 8 days for booking (excluding Saturdays)
  useEffect(() => {
    const dates = [];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    let addedDays = 0;
    let dayOffset = 0;
    while (addedDays < 8) {
      const d = new Date();
      d.setDate(d.getDate() + dayOffset);
      
      // If it is Saturday, skip it
      if (d.getDay() !== 6) {
        dates.push({
          label: `${d.getDate()} ${months[d.getMonth()]}`,
          dateStr: d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          dayName: weekdays[d.getDay()]
        });
        addedDays++;
      }
      dayOffset++;
    }
    setAvailableDates(dates);
  }, []);

  const defaultTimeSlots = [
    { time: '09:30 AM', available: true },
    { time: '11:00 AM', available: true },
    { time: '01:30 PM', available: false }, // simulated busy spot
    { time: '03:00 PM', available: true },
    { time: '04:30 PM', available: true },
    { time: '06:00 PM', available: false },
  ];

  const getDynamicTimeSlots = () => {
    const selectedDay = availableDates[selectedDateIndex]?.dayName;
    if (selectedDay === 'Fri') {
      return defaultTimeSlots.map(slot => {
        // Friday nights (4:30 PM and 6:00 PM) are unavailable
        if (slot.time === '04:30 PM' || slot.time === '06:00 PM') {
          return { ...slot, available: false };
        }
        return slot;
      });
    }
    return defaultTimeSlots;
  };

  const activeTimeSlots = getDynamicTimeSlots();

  const handleProceedToDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) {
      alert("Please select a lash look model style first.");
      return;
    }
    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      alert("Please enter a valid email address.");
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 7) {
      alert("Please enter your phone contact details.");
      return;
    }
    setBookingStep('deposit');
  };

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    if (!name.trim() || !email.trim() || !phone.trim()) {
      alert("Please provide name, email, and phone contact details to secure the booking.");
      return;
    }
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
      alert("Please enter a valid 16-digit card number to pay the $25.00 booking deposit.");
      return;
    }
    if (!cardExpiry || cardExpiry.length < 5) {
      alert("Please enter a valid expiration date (MM/YY).");
      return;
    }
    if (!cardCvc || cardCvc.length < 3) {
      alert("Please enter a valid CVV (3-digit security code).");
      return;
    }

    const newAppointment: Appointment = {
      id: `LASH-${Math.floor(100000 + Math.random() * 90000)}`, // random booking id
      style: selectedProduct,
      artist: activeArtist,
      date: availableDates[selectedDateIndex]?.dateStr || 'Tomorrow',
      timeSlot: selectedTimeSlot,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      totalPrice: selectedProduct.price,
    };

    setConfirmedBooking(newAppointment);
    onBookingConfirmed(newAppointment);
    
    // Clear forms but keep confirmation view
    setName('');
    setEmail('');
    setPhone('');
    setNotes('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvc('');
  };

  const handleResetAppointment = () => {
    setConfirmedBooking(null);
    setBookingStep('form');
    setCardNumber('');
    setCardExpiry('');
    setCardCvc('');
  };

  const handleDownloadICS = () => {
    if (!confirmedBooking) return;

    const parseBookingDateTime = (dateStr: string, timeStr: string): Date => {
      try {
        const parsed = new Date(`${dateStr} ${timeStr}`);
        if (!isNaN(parsed.getTime())) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
      return new Date();
    };

    const startDate = parseBookingDateTime(confirmedBooking.date, confirmedBooking.timeSlot);
    const endDate = new Date(startDate.getTime() + (confirmedBooking.style.durationMin || 90) * 60 * 1000);

    const pad = (num: number) => String(num).padStart(2, '0');
    const formatICSDate = (date: Date) => {
      const yyyy = date.getFullYear();
      const mm = pad(date.getMonth() + 1);
      const dd = pad(date.getDate());
      const hh = pad(date.getHours());
      const min = pad(date.getMinutes());
      const ss = pad(date.getSeconds());
      return `${yyyy}${mm}${dd}T${hh}${min}${ss}`;
    };

    const dtStart = formatICSDate(startDate);
    const dtEnd = formatICSDate(endDate);
    const dtStamp = formatICSDate(new Date());

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//NashGlam Lashes//Boutique Lash Booking//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `SUMMARY:NashGlam Lash Styling (${confirmedBooking.style.name})`,
      `UID:${confirmedBooking.id}@nashglamlashes.com`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `DTSTAMP:${dtStamp}`,
      `DESCRIPTION:Your upcoming lash styling appointment with Stylist ${confirmedBooking.artist.name} is confirmed!\\nStyle: ${confirmedBooking.style.name}\\nArtist: ${confirmedBooking.artist.name}\\nDate: ${confirmedBooking.date}\\nTime: ${confirmedBooking.timeSlot}\\nDeposit paid.\\nLooking forward to styling you!`,
      'LOCATION:NashGlam Home Studio, Terrebonne, QC',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `booking-${confirmedBooking.id}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const activeProduct = selectedProduct || LASH_PRODUCTS[0];

  return (
    <div className={`transition-all duration-300 border rounded-2xl p-6 sm:p-10 shadow-sm ${
      isDarkMode 
        ? 'bg-stone-900 border-stone-800 text-stone-100 shadow-stone-950/25' 
        : 'bg-stone-50 border-stone-200/80 text-stone-800 shadow-stone-100/40'
    }`}>
      <AnimatePresence mode="wait">
        
        {!confirmedBooking ? (
          /* --- BOOKING SCHEDULER LAYOUT --- */
          <motion.div
            key="scheduler"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className={`border-b pb-4 space-y-1 ${isDarkMode ? 'border-stone-800' : 'border-stone-200/60'}`}>
              <span className="text-xs font-mono font-medium tracking-widest text-pink-500 uppercase">
                Premium Concierge
              </span>
              <h2 className={`font-serif text-2xl sm:text-3xl font-medium ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>
                {bookingStep === 'form' ? 'Reserve Your Lash Therapy' : 'Secure Booking Deposit'}
              </h2>
              <p className={`font-sans text-xs sm:text-sm ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>
                {bookingStep === 'form' 
                  ? 'Each session includes a customized lash-bed diagnostic consultation, relaxing underbed collagen gel pads, micro-fanned lash mapping, and ultimate safety care.'
                  : 'To hold your custom-styled lashes slot with Nash inside our calendar space, a private non-refundable $25 deposit is secured.'}
              </p>
            </div>

            <form onSubmit={bookingStep === 'form' ? handleProceedToDeposit : handleBookSubmit} className="space-y-6">
              
              {bookingStep === 'form' ? (
                <>
                  {/* 1. SELECT SERVICE TREATMENT */}
                  <div className="space-y-2">
                    <label className={`text-xs font-semibold tracking-widest block ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>
                      1. SELECT TREATMENT LOOK
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {LASH_PRODUCTS.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => onSelectProduct(p)}
                          className={`flex items-center justify-between p-3.5 border rounded-xl transition-all text-left cursor-pointer ${
                            selectedProduct?.id === p.id
                              ? isDarkMode 
                                ? 'border-pink-500 bg-pink-95/30 bg-pink-950/30 text-stone-100 shadow-2xs' 
                                : 'border-pink-500 bg-pink-5/40 bg-pink-50/40 text-stone-900 shadow-2xs'
                              : isDarkMode 
                                ? 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700' 
                                : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                          }`}
                        >
                          <div>
                            <span className={`text-xs font-bold font-serif block ${selectedProduct?.id === p.id ? 'text-pink-500' : isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>{p.name}</span>
                            <span className="text-[10px] font-mono mt-0.5 text-stone-400 block uppercase">
                              {p.type} • {p.durationMin} mins
                            </span>
                          </div>
                          <span className={`text-sm font-bold ${selectedProduct?.id === p.id ? 'text-pink-500' : isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>${p.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. SELECT DATE CALENDAR & TIME SLOTS */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-1.5">
                    
                    {/* Custom mini calendar grid */}
                    <div className="space-y-2 lg:col-span-7">
                      <label className={`text-xs font-semibold tracking-widest flex items-center space-x-1 ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>
                        <Calendar className="w-4 h-4 text-pink-500" />
                        <span>2. SELECT BOOKING DATE</span>
                      </label>
                      
                      <div className="grid grid-cols-4 gap-2">
                        {availableDates.map((d, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setSelectedDateIndex(index)}
                            className={`p-2.5 border rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                              selectedDateIndex === index
                                ? isDarkMode
                                  ? 'bg-stone-100 border-stone-100 text-stone-950 scale-[1.02] shadow-sm font-bold'
                                  : 'bg-stone-900 border-stone-900 text-stone-50 scale-[1.02] shadow-xs'
                                : isDarkMode
                                  ? 'border-stone-800 bg-stone-950 text-stone-400 hover:bg-stone-800'
                                  : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-55 hover:bg-stone-50'
                            }`}
                          >
                            <span className="text-[10px] font-mono tracking-wider uppercase font-light">
                              {d.dayName}
                            </span>
                            <span className="text-xs font-semibold mt-1">
                              {d.label.split(' ')[0]}
                            </span>
                            <span className="text-[9px] opacity-75 font-mono">
                              {d.label.split(' ')[1]}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Micro time slots */}
                    <div className="space-y-2 lg:col-span-5">
                      <label className={`text-xs font-semibold tracking-widest flex items-center space-x-1 ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>
                        <Clock className="w-4 h-4 text-pink-500" />
                        <span>3. CHOOSE TIME</span>
                      </label>

                      <div className="grid grid-cols-3 gap-2">
                        {activeTimeSlots.map((slot) => (
                          <button
                            key={slot.time}
                            type="button"
                            disabled={!slot.available}
                            onClick={() => setSelectedTimeSlot(slot.time)}
                            className={`py-3 px-1 border text-center rounded-xl text-[11px] font-mono font-medium transition-all ${
                              !slot.available
                                ? isDarkMode
                                  ? 'bg-stone-800/40 border-stone-800 text-stone-600 line-through cursor-not-allowed'
                                  : 'bg-stone-100 border-stone-100 text-stone-300 line-through cursor-not-allowed'
                                : selectedTimeSlot === slot.time
                                ? isDarkMode
                                  ? 'border-pink-500 bg-pink-950/30 text-pink-300 font-bold shadow-2xs'
                                  : 'border-pink-500 bg-pink-50 text-pink-700 font-bold shadow-2xs'
                                : isDarkMode
                                  ? 'border-stone-800 bg-stone-950 text-stone-300 hover:bg-stone-800 cursor-pointer'
                                  : 'border-stone-200 bg-white text-stone-655 hover:bg-[#fcfbf9] cursor-pointer'
                            }`}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* 3. CLIENT CONTACT FORMS */}
                  <div className="space-y-3 pt-2">
                    <label className={`text-xs font-semibold tracking-widest block ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>
                      4. GUEST INTAKE DETAILS
                    </label>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="Your Full Name *"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={`w-full border rounded-xl py-3 pl-10 pr-4 text-xs outline-none focus:ring-1 focus:ring-pink-500 hover:border-stone-300 transition-all font-medium ${
                            isDarkMode
                              ? 'bg-stone-950 border-stone-800 text-stone-100 placeholder-stone-500 focus:border-pink-500'
                              : 'bg-white border-stone-200 text-stone-800 hover:border-stone-300 focus:border-pink-600'
                          }`}
                        />
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          required
                          placeholder="Email Address *"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={`w-full border rounded-xl py-3 pl-10 pr-4 text-xs outline-none focus:ring-1 focus:ring-pink-500 hover:border-stone-300 transition-all font-medium ${
                            isDarkMode
                              ? 'bg-stone-950 border-stone-800 text-stone-100 placeholder-stone-500 focus:border-pink-500'
                              : 'bg-white border-stone-200 text-stone-800 hover:border-stone-300 focus:border-pink-600'
                          }`}
                        />
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          type="tel"
                          required
                          placeholder="Mobile Phone Number *"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className={`w-full border rounded-xl py-3 pl-10 pr-4 text-xs outline-none focus:ring-1 focus:ring-pink-500 hover:border-stone-300 transition-all font-medium ${
                            isDarkMode
                              ? 'bg-stone-950 border-stone-800 text-stone-100 placeholder-stone-500 focus:border-pink-500'
                              : 'bg-white border-stone-200 text-stone-800 hover:border-stone-300 focus:border-pink-600'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="relative mt-2">
                      <div className="absolute top-3 left-3 text-stone-400">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <textarea
                        placeholder="Consultation notes, lash allergies, requested curl mapping details (optional)..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={2}
                        className={`w-full border rounded-xl py-3 pl-10 pr-4 text-xs outline-none focus:ring-1 focus:ring-pink-500 hover:border-stone-300 transition-all font-light ${
                          isDarkMode
                            ? 'bg-stone-950 border-stone-800 text-stone-100 placeholder-stone-500 focus:border-pink-500'
                            : 'bg-white border-stone-200 text-stone-800 hover:border-stone-300 focus:border-pink-600'
                        }`}
                      />
                    </div>
                  </div>

                  {/* FINAL DIRECT BOOKING BUTTON BAR */}
                  <div className={`border-t pt-4.5 flex items-center justify-end flex-wrap gap-4 -mx-8 px-8 -mb-10 p-6 rounded-b-2xl ${
                    isDarkMode 
                      ? 'bg-stone-950 border-stone-800/80 text-stone-300' 
                      : 'bg-[#fbfaf8] border-stone-200 text-stone-600'
                  }`}>
                    <button
                      type="submit"
                      className="px-8 py-3.5 bg-pink-600 hover:bg-pink-700 border border-transparent rounded-xl text-xs font-sans font-bold tracking-widest text-white hover:shadow-md transition-all active:scale-95 cursor-pointer flex items-center space-x-2"
                    >
                      <span>Confirm</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* STEP 2: SECURED BILLING & DEPOSIT CONFIRMATION */}
                  
                  {/* EDIT DETAILS TRIGGER */}
                  <button
                    type="button"
                    onClick={() => setBookingStep('form')}
                    className="flex items-center space-x-1.5 text-xs text-stone-400 hover:text-pink-500 transition-colors cursor-pointer font-bold uppercase tracking-wider font-mono outline-none pt-1"
                  >
                    <span>← Edit Intake Details</span>
                  </button>

                  {/* HIGH-RES BOOKING SUMMARY */}
                  <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-stone-950/45 border-stone-800' : 'bg-white border-stone-200'} space-y-3.5 shadow-xs`}>
                    <h4 className="text-[10px] font-mono text-pink-500 uppercase font-extrabold tracking-widest block text-center sm:text-left">
                      ★ RESERVATION INFORMATION SUMMARY ★
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs font-sans leading-relaxed text-center sm:text-left">
                      <div className="space-y-0.5">
                        <span className="text-[9px] text-stone-400 font-mono tracking-wider block uppercase">LASH LOOK TREATMENT</span>
                        <span className={`font-serif font-bold block ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>{activeProduct.name}</span>
                        <span className="text-[10px] text-pink-500 block font-mono font-bold">${activeProduct.price}.00</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[9px] text-stone-400 font-mono tracking-wider block uppercase">DATE & TIME</span>
                        <span className={`font-semibold block ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>{availableDates[selectedDateIndex]?.dateStr || 'Tomorrow'}</span>
                        <span className="text-pink-500 font-mono font-bold">{selectedTimeSlot}</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[9px] text-stone-400 font-mono tracking-wider block uppercase">MASTER STYLIST</span>
                        <span className={`font-semibold block ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>Nash</span>
                        <span className="text-stone-400 block text-[10px] font-light">Lead Stylist & Owner</span>
                      </div>
                    </div>
                  </div>

                  {/* DEPOSIT RULES & CHARGE */}
                  <div className="space-y-3 pt-1">
                    <label className={`text-xs font-semibold tracking-widest block ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>
                      PLEASE READ before proceeding!
                    </label>
                    
                    <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-2 ${
                      isDarkMode ? 'bg-stone-950 border-stone-800 text-stone-300' : 'bg-white border-stone-200 text-stone-600'
                    }`}>
                      <div className="font-extrabold text-pink-600 font-sans tracking-wider uppercase text-[10px]">
                        ★ DEPOSIT POLICY ★
                      </div>
                      <p className="font-sans font-light leading-normal">
                        A <strong className="font-semibold text-pink-500">$25.00 deposit</strong> is required to confirm your styled appointment. This deposit is <strong className="font-semibold text-pink-650 text-pink-600">non-refundable but transferable to a rescheduled appointment with 24 hours notice</strong>. If you reschedule prior to 24 hours before your booking, the $25.00 applies to your newly selected slot. However, if you cancel or reschedule late, the deposit will not be returned or applied.
                      </p>
                    </div>

                    {/* Card inputs container */}
                    <div className={`p-4.5 rounded-xl border max-w-md mx-auto space-y-3 ${
                      isDarkMode ? 'bg-stone-900/60 border-stone-800' : 'bg-stone-50 border-stone-200'
                    }`}>
                      <span className="text-[10px] font-mono text-stone-400 block tracking-widest uppercase text-center">SECURE ENCRYPTED CHECKOUT</span>
                      
                      <div className="relative">
                        <input
                          type="text"
                          required
                          maxLength={19}
                          placeholder="Card Number (e.g. 4111 2222 3333 4444) *"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          className={`w-full border rounded-xl py-2.5 px-3.5 text-xs outline-none focus:ring-1 focus:ring-pink-500 font-mono transition-all ${
                            isDarkMode
                              ? 'bg-stone-950 border-stone-800 text-stone-100 placeholder-stone-605 focus:border-pink-500'
                              : 'bg-white border-stone-200 text-stone-800 placeholder-stone-400 focus:border-pink-500'
                          }`}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          maxLength={5}
                          placeholder="MM/YY *"
                          value={cardExpiry}
                          onChange={handleCardExpiryChange}
                          className={`w-full border rounded-xl py-2.5 px-3.5 text-xs outline-none focus:ring-1 focus:ring-pink-500 text-center font-mono transition-all ${
                            isDarkMode
                              ? 'bg-stone-950 border-stone-800 text-stone-100 placeholder-stone-605 focus:border-pink-500'
                              : 'bg-white border-stone-200 text-stone-800 placeholder-stone-400 focus:border-pink-500'
                          }`}
                        />
                        <input
                          type="password"
                          required
                          maxLength={3}
                          placeholder="CVC *"
                          value={cardCvc}
                          onChange={handleCardCvcChange}
                          className={`w-full border rounded-xl py-2.5 px-3.5 text-xs outline-none focus:ring-1 focus:ring-pink-500 text-center font-mono transition-all ${
                            isDarkMode
                              ? 'bg-stone-950 border-stone-800 text-stone-100 placeholder-stone-605 focus:border-pink-500'
                              : 'bg-white border-stone-200 text-stone-800 placeholder-stone-400 focus:border-pink-500'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* FINAL CHECKOUT BOOK BUTTON */}
                  <div className={`border-t pt-4.5 flex items-center justify-between flex-wrap gap-4 -mx-8 px-8 -mb-10 p-6 rounded-b-2xl ${
                    isDarkMode 
                      ? 'bg-stone-950 border-stone-800/80 text-stone-300' 
                      : 'bg-[#fbfaf8] border-stone-200 text-stone-600'
                  }`}>
                    <div className="flex items-center space-x-3 text-stone-600 text-xs">
                      <Award className="w-8 h-8 text-pink-500 shrink-0" />
                      <div>
                        <span className={`font-bold block font-sans ${isDarkMode ? 'text-stone-200' : 'text-stone-900'}`}>Secured Deposit Charge</span>
                        <span className="font-light text-[11px] block text-stone-400">Formaldehyde-free luxury cashmere silk lashes.</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-8 py-3.5 bg-pink-600 hover:bg-pink-700 border border-transparent rounded-xl text-xs font-sans font-bold tracking-widest text-white hover:shadow-md transition-all active:scale-95 cursor-pointer flex items-center space-x-2"
                    >
                      <span>Let's get you booked!</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}

            </form>
          </motion.div>
        ) : (
          
          /* --- DESIGNER VOUCHER SUCCESS STATE --- */
          <motion.div
            key="voucher"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-6"
          >
            <div className={`p-3 rounded-full border flex items-center justify-center mb-4 transition-colors ${
              isDarkMode ? 'bg-emerald-950/40 border-emerald-800/40' : 'bg-emerald-50 border-emerald-200'
            }`}>
              <CheckCircle className="w-10 h-10 text-emerald-500 animate-bounce" />
            </div>

            <h3 className={`font-serif text-2xl font-bold block text-center ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>
              Appointment Confirmed!
            </h3>
            <p className={`font-sans text-xs text-center mt-1 max-w-sm ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>
              We have dispatched your styling sequence blueprint to <span className={`font-semibold ${isDarkMode ? 'text-stone-200' : 'text-stone-700'}`}>{confirmedBooking.customerEmail}</span>. Read your voucher below.
            </p>

            {/* Luxurious Printable-style Voucher */}
            <div className={`w-full max-w-sm border rounded-2xl shadow-md overflow-hidden font-mono mt-6 relative transition-colors ${
              isDarkMode 
                ? 'bg-stone-950 border-stone-800 text-stone-300' 
                : 'bg-white border-stone-300/80 text-stone-800'
            }`}>
              <div className="absolute top-0 inset-x-0 h-2.5 bg-gradient-to-r from-pink-600 via-stone-900 to-pink-500" />
              
              <div className="p-5 space-y-4">
                
                {/* Voucher Top Header */}
                <div className={`flex items-center justify-between border-b pb-3 text-[10px] ${isDarkMode ? 'border-stone-800/60' : 'border-stone-200/60'}`}>
                  <div>
                    <span className="font-bold block tracking-wider">LASH STUDIO VOUCHER</span>
                    <span className="text-stone-400">{confirmedBooking.id}</span>
                  </div>
                  <div className="text-right">
                    <span className="bg-emerald-100 text-emerald-800 font-bold py-1 px-2 rounded-full uppercase text-[8px] tracking-widest text-emerald-500 inline-block">
                      PAID DEPOSIT
                    </span>
                  </div>
                </div>

                {/* Treatment Style Details */}
                <div className="space-y-1.5 text-xs">
                  <span className="text-[9px] text-stone-400 block tracking-widest uppercase">TREATMENT & ARTIST</span>
                  <div className={`font-serif font-bold text-sm ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>{confirmedBooking.style.name}</div>
                  <div className="flex items-center text-[10px] text-stone-500 space-x-1">
                    <CornerDownRight className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                    <span>Stylist: <span className={`font-semibold ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>{confirmedBooking.artist.name}</span></span>
                  </div>
                </div>

                {/* Date & Time grids */}
                <div className={`grid grid-cols-2 gap-4 border-t border-b py-3 text-xs ${isDarkMode ? 'border-stone-800' : 'border-stone-100'}`}>
                  <div>
                    <span className="text-[9px] text-stone-400 block tracking-widest uppercase">SCHEDULED DATE</span>
                    <span className={`font-semibold ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>{confirmedBooking.date}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-stone-400 block tracking-widest uppercase">ARRIVAL TIME</span>
                    <span className="font-semibold text-pink-600">{confirmedBooking.timeSlot}</span>
                  </div>
                </div>

                {/* Client contacts */}
                <div className="space-y-1 text-xs">
                  <span className="text-[9px] text-stone-400 block tracking-widest uppercase">GUEST DETAILS</span>
                  <div className={`font-medium ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>{confirmedBooking.customerName}</div>
                  <div className="text-[10px] text-stone-450">{confirmedBooking.customerPhone}</div>
                </div>

                {/* Billing Summary on Voucher */}
                <div className={`border-t pt-3 space-y-1.5 text-xs ${isDarkMode ? 'border-stone-800' : 'border-stone-100'}`}>
                  <span className="text-[9px] text-stone-400 block tracking-widest uppercase">BILLING SUMMARY</span>
                  <div className="flex justify-between font-mono text-[11px]">
                    <span>Treatment Set Price:</span>
                    <span className={`font-semibold ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>${confirmedBooking.totalPrice}.00</span>
                  </div>
                  <div className="flex justify-between font-mono text-emerald-500 text-[11px]">
                    <span>Deposit Secured/Paid:</span>
                    <span className="font-bold">-$25.00</span>
                  </div>
                  <div className={`flex justify-between font-mono text-[11px] border-t pt-1 border-dashed ${isDarkMode ? 'border-stone-800' : 'border-stone-200'}`}>
                    <span>Remaining Salon Due:</span>
                    <span className="font-bold text-pink-500">${confirmedBooking.totalPrice - 25}.00</span>
                  </div>
                  <p className="text-[8px] text-pink-500 font-sans tracking-tight leading-normal font-light pt-1">
                    * Policy: Deposit is non-refundable but transferable to a rescheduled appointment with 24 hours notice.
                  </p>
                </div>

                {/* Barcode representation */}
                <div className={`pt-3 border-t flex flex-col items-center ${isDarkMode ? 'border-stone-800' : 'border-stone-100'}`}>
                  {/* barcode stripes */}
                  <div className="w-full h-8 flex items-end justify-between px-4">
                    {Array.from({ length: 28 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-xs ${isDarkMode ? 'bg-stone-305 bg-stone-300' : 'bg-stone-900'}`}
                        style={{
                          width: i % 3 === 0 ? '4px' : i % 5 === 0 ? '1px' : '2px',
                          height: i % 4 === 0 ? '70%' : i % 3 === 0 ? '100%' : '85%',
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-[8px] text-stone-400 font-mono tracking-widest uppercase mt-1.5">
                    * CONF-{confirmedBooking.id} *
                  </span>
                </div>

              </div>
            </div>

            <button
              onClick={handleDownloadICS}
              className={`mt-6 inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl border text-xs font-sans font-bold tracking-widest transition-all cursor-pointer ${
                isDarkMode 
                  ? 'bg-stone-900 border-stone-800 text-pink-400 hover:border-pink-500/50' 
                  : 'bg-white border-stone-200 text-pink-600 hover:shadow-xs hover:border-pink-500'
              }`}
            >
              <Calendar className="w-4 h-4 shrink-0 text-pink-500" />
              <span>ADD TO CALENDAR (.ICS)</span>
            </button>

            <button
              onClick={handleResetAppointment}
              className="mt-4 text-xs text-stone-500 hover:text-pink-600 font-sans tracking-wide border-b border-transparent hover:border-pink-500 pb-0.5 cursor-pointer"
            >
              Book Another Treatment Slot Or Service
            </button>
          </motion.div>
        )}
        
      </AnimatePresence>
    </div>
  );
}
