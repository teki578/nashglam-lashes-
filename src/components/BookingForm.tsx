/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, User, Phone, Mail, Clock, MessageSquare, CheckCircle, Award, Star, ArrowRight, CornerDownRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { LashProduct, LashArtist, Appointment } from '../types';
import { LASH_ARTISTS, LASH_PRODUCTS } from '../data';
import { useLanguage } from '../i18n/LanguageContext';

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
  const { t, lang } = useLanguage();
  const b = t.booking;

  const [activeArtist, setActiveArtist] = useState<LashArtist>(LASH_ARTISTS[0]);
  const [bookingStep, setBookingStep] = useState<'form' | 'deposit'>('form');
  
  // Calendar Month and Selected Day state
  const getInitialSelectedDate = () => {
    // Minimum 48h in advance = 2 full calendar days ahead
    const d = new Date();
    d.setDate(d.getDate() + 2);
    const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    if (target.getDay() === 6) { // skip Saturday — not available
      target.setDate(target.getDate() + 1); // jump to Sunday
    }
    return target;
  };

  const [selectedDate, setSelectedDate] = useState<Date>(getInitialSelectedDate);
  const [currentYear, setCurrentYear] = useState(() => getInitialSelectedDate().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => getInitialSelectedDate().getMonth());
  
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('11:00 AM');
  const [selectedServiceOptionId, setSelectedServiceOptionId] = useState<string>('full');
  
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
  
  // Loaded booked state
  const [bookedAppointments, setBookedAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('nashglam_appointments');
    if (saved) {
      try {
        setBookedAppointments(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const getDynamicTimeSlots = (date: Date) => {
    const day = date.getDay(); // 0=Sun, 5=Fri, 6=Sat
    
    if (day === 6) {
      return []; // Saturday is CLOSED
    }
    
    // Sunday has different operating slots (10:00 AM - 06:00 PM)
    const slots = day === 0
      ? [
          { time: '10:00 AM' },
          { time: '11:30 AM' },
          { time: '01:00 PM' },
          { time: '02:30 PM' },
          { time: '04:00 PM' },
          { time: '05:30 PM' },
        ]
      : [
          { time: '09:30 AM' },
          { time: '11:00 AM' },
          { time: '01:30 PM' },
          { time: '03:00 PM' },
          { time: '04:30 PM' },
          { time: '06:00 PM' },
          { time: '07:30 PM' },
        ];
        
    const now = new Date();
    // 48-hour advance booking cutoff
    const cutoff48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    const cellDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    return slots.map(slot => {
      let isAvailable = true;

      // 1. Is this slot within the mandatory 48-hour advance booking window?
      const [timeStr, modifier] = slot.time.split(' ');
      let [hoursStr, minutesStr] = timeStr.split(':');
      let hours = parseInt(hoursStr, 10);
      const minutes = parseInt(minutesStr, 10);
      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
      const slotDateTime = new Date(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate(), hours, minutes);
      if (slotDateTime <= cutoff48h) {
        isAvailable = false;
      }
      
      // 2. Friday nights: 4:30 PM, 6:00 PM, 7:30 PM are unavailable
      if (day === 5) {
        if (slot.time === '04:30 PM' || slot.time === '06:00 PM' || slot.time === '07:30 PM') {
          isAvailable = false;
        }
      }
      
      // 3. Already booked?
      const targetDateStr = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      const isBooked = bookedAppointments.some(
        (app) => app.date === targetDateStr && app.timeSlot === slot.time
      );
      if (isBooked) {
        isAvailable = false;
      }
      
      return {
        time: slot.time,
        available: isAvailable
      };
    });
  };

  const activeTimeSlots = getDynamicTimeSlots(selectedDate);

  const handleManualDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) return;
    const [year, month, day] = val.split('-').map(Number);
    if (year && month && day) {
      const localDate = new Date(year, month - 1, day);
      
      const today = new Date();
      const todayTrunc = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const minBookingDate = new Date(todayTrunc.getTime() + 2 * 24 * 60 * 60 * 1000);
      
      if (localDate >= minBookingDate && localDate.getDay() !== 6) {
         setSelectedDate(localDate);
         setCurrentYear(localDate.getFullYear());
         setCurrentMonth(localDate.getMonth());
         
         const nextSlots = getDynamicTimeSlots(localDate);
         const firstAvailable = nextSlots.find(s => s.available);
         if (firstAvailable) {
           setSelectedTimeSlot(firstAvailable.time);
         }
      } else {
         alert(lang === 'fr' ? 'Date invalide. Minimum 48h à l\'avance, et fermé le samedi.' : 'Invalid date. Minimum 48h advance notice, and closed on Saturdays.');
      }
    }
  };

  const formatDateForInput = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleProceedToDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) {
      alert(b.alertSelectProduct);
      return;
    }
    if (!name.trim()) {
      alert(b.alertName);
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      alert(b.alertEmail);
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 7) {
      alert(b.alertPhone);
      return;
    }

    const findAvailable = activeTimeSlots.find(s => s.available);
    if (findAvailable && !activeTimeSlots.some(s => s.time === selectedTimeSlot && s.available)) {
      setSelectedTimeSlot(findAvailable.time);
    }
    
    setBookingStep('deposit');
  };

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    if (!name.trim() || !email.trim() || !phone.trim()) {
      alert(b.alertContactDetails);
      return;
    }
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
      alert(b.alertCardNumber);
      return;
    }
    if (!cardExpiry || cardExpiry.length < 5) {
      alert(b.alertExpiry);
      return;
    }
    if (!cardCvc || cardCvc.length < 3) {
      alert(b.alertCvc);
      return;
    }

    // Always store dates in en-US for consistent comparison
    const formattedDate = selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    const activeServiceOption = selectedProduct.serviceOptions?.find(o => o.id === selectedServiceOptionId);
    const finalPrice = activeServiceOption ? activeServiceOption.price : selectedProduct.price;

    const newAppointment: Appointment = {
      id: `LASH-${Math.floor(100000 + Math.random() * 90000)}`,
      style: selectedProduct,
      selectedServiceOption: activeServiceOption,
      artist: activeArtist,
      date: formattedDate,
      timeSlot: selectedTimeSlot,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      totalPrice: finalPrice,
    };

    const updated = [...bookedAppointments, newAppointment];
    setBookedAppointments(updated);
    localStorage.setItem('nashglam_appointments', JSON.stringify(updated));

    setConfirmedBooking(newAppointment);
    onBookingConfirmed(newAppointment);
    
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
      `DESCRIPTION:Your upcoming lash styling appointment with Stylist ${confirmedBooking.artist.name} is confirmed!\\nStyle: ${confirmedBooking.style.name} ${confirmedBooking.selectedServiceOption ? '(' + confirmedBooking.selectedServiceOption.label + ')' : ''}\\nArtist: ${confirmedBooking.artist.name}\\nDate: ${confirmedBooking.date}\\nTime: ${confirmedBooking.timeSlot}\\nDeposit paid.\\nLooking forward to styling you!`,
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

  // Display date in the current language
  const displayDate = (d: Date) =>
    d.toLocaleDateString(lang === 'fr' ? 'fr-CA' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' });

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
            <div className={`border-b pb-4 space-y-2 ${isDarkMode ? 'border-stone-800' : 'border-stone-200/60'}`}>
              <span className="text-xs font-mono font-medium tracking-widest text-pink-500 uppercase">
                {b.badge}
              </span>
              <h2 className={`font-serif text-2xl sm:text-3xl font-medium ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>
                {bookingStep === 'form' ? b.titleForm : b.titleDeposit}
              </h2>
              <p className={`font-sans text-xs sm:text-sm ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>
                {bookingStep === 'form' ? b.descForm : b.descDeposit}
              </p>
              {bookingStep === 'form' && (
                <div className={`inline-flex items-center space-x-1.5 py-1.5 px-3 rounded-full text-[10px] font-mono font-semibold tracking-widest border ${
                  isDarkMode
                    ? 'bg-amber-950/30 border-amber-800/40 text-amber-400'
                    : 'bg-amber-50 border-amber-200 text-amber-700'
                }`}>
                  <Clock className="w-3 h-3 shrink-0" />
                  <span>
                    {lang === 'fr'
                      ? '⚠ RÉSERVATIONS REQUISES MINIMUM 48H À L\'AVANCE'
                      : '⚠ BOOKINGS REQUIRE MINIMUM 48H ADVANCE NOTICE'}
                  </span>
                </div>
              )}
            </div>

            <form onSubmit={bookingStep === 'form' ? handleProceedToDeposit : handleBookSubmit} className="space-y-6">
              
              {bookingStep === 'form' ? (
                <>
                  {/* 1. SELECT SERVICE TREATMENT */}
                  <div className="space-y-2">
                    <label className={`text-xs font-semibold tracking-widest block ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>
                      {b.step1}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {LASH_PRODUCTS.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            onSelectProduct(p);
                            setSelectedServiceOptionId('full');
                          }}
                          className={`flex items-center justify-between p-3.5 border rounded-xl transition-all text-left cursor-pointer ${
                            selectedProduct?.id === p.id
                              ? isDarkMode 
                                ? 'border-pink-500 bg-pink-950/30 text-stone-100 shadow-2xs' 
                                : 'border-pink-500 bg-pink-50/40 text-stone-900 shadow-2xs'
                              : isDarkMode 
                                ? 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700' 
                                : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                          }`}
                        >
                          <div>
                            <span className={`text-xs font-bold font-serif block ${selectedProduct?.id === p.id ? 'text-pink-500' : isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>{p.name}</span>
                            <span className="text-[10px] font-mono mt-0.5 text-stone-400 block uppercase">
                              {p.type} • {p.durationMin} {b.mins}
                            </span>
                          </div>
                          <span className={`text-sm font-bold ${selectedProduct?.id === p.id ? 'text-pink-500' : isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>${p.price}.00</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Service Option Selection (Full Set vs Refill) */}
                  {selectedProduct?.serviceOptions && (
                    <div className="space-y-2 mt-4">
                      <label className={`text-[10px] uppercase font-bold tracking-widest block ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>
                        {lang === 'fr' ? 'SÉLECTIONNEZ LE TYPE DE SERVICE' : 'SELECT SERVICE TYPE'}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {selectedProduct.serviceOptions.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setSelectedServiceOptionId(opt.id)}
                            className={`flex items-center justify-between p-3 border rounded-xl transition-all text-left cursor-pointer ${
                              selectedServiceOptionId === opt.id
                                ? isDarkMode 
                                  ? 'border-pink-500 bg-pink-950/30 text-stone-100 shadow-2xs' 
                                  : 'border-pink-500 bg-pink-50/40 text-stone-900 shadow-2xs'
                                : isDarkMode 
                                  ? 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700' 
                                  : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                            }`}
                          >
                            <span className={`text-[11px] font-semibold ${selectedServiceOptionId === opt.id ? 'text-pink-500' : isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>
                              {opt.label}
                            </span>
                            <span className={`text-[12px] font-bold ${selectedServiceOptionId === opt.id ? 'text-pink-500' : isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>
                              ${opt.price}.00
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 2. SELECT DATE CALENDAR & TIME SLOTS */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-1.5">
                    
                    {/* Monthly calendar grid */}
                    <div className="space-y-2 lg:col-span-7">
                      <div className="flex items-center justify-between">
                        <label className={`text-xs font-semibold tracking-widest flex items-center space-x-1 ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>
                          <Calendar className="w-4 h-4 text-pink-500" />
                          <span>{b.step2}</span>
                        </label>
                        <input 
                          type="date"
                          value={formatDateForInput(selectedDate)}
                          onChange={handleManualDateChange}
                          min={formatDateForInput(new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000))}
                          className={`text-[10px] font-mono tracking-widest px-2.5 py-1.5 border rounded-lg outline-none transition-all cursor-pointer ${
                            isDarkMode 
                              ? 'bg-stone-900 border-stone-800 text-stone-300 focus:border-pink-500' 
                              : 'bg-white border-stone-200 text-stone-700 focus:border-pink-500 shadow-2xs'
                          }`}
                        />
                      </div>
                      
                      <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-stone-950/65 border-stone-800/85' : 'bg-white border-stone-200'} shadow-2xs`}>
                        {/* Month navigation header */}
                        <div className="flex items-center justify-between pb-3.5 pt-0.5">
                          <span className={`text-[11px] font-mono tracking-widest font-bold uppercase ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`}>
                            {b.months[currentMonth]} {currentYear}
                          </span>
                          <div className="flex space-x-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                if (currentMonth === 0) {
                                  setCurrentMonth(11);
                                  setCurrentYear(prev => prev - 1);
                                } else {
                                  setCurrentMonth(prev => prev - 1);
                                }
                              }}
                              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                isDarkMode ? 'border-stone-800 hover:bg-stone-800/80 text-stone-300' : 'border-stone-200 hover:bg-stone-100 text-stone-700'
                              }`}
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (currentMonth === 11) {
                                  setCurrentMonth(0);
                                  setCurrentYear(prev => prev + 1);
                                } else {
                                  setCurrentMonth(prev => prev + 1);
                                }
                              }}
                              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                isDarkMode ? 'border-stone-800 hover:bg-stone-800/80 text-stone-300' : 'border-stone-200 hover:bg-stone-100 text-stone-700'
                              }`}
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Weekday row */}
                        <div className="grid grid-cols-7 gap-1 text-center font-mono text-[9px] font-bold tracking-wider text-stone-400 uppercase border-b pb-2 mb-2.5 border-dashed border-stone-800/20 dark:border-stone-800/60">
                          {b.weekdays.map(d => <span key={d}>{d}</span>)}
                        </div>

                        {/* Calendar day cells */}
                        <div className="grid grid-cols-7 gap-1.5">
                          {(() => {
                            const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
                            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                            const cells = [];
                            
                            for (let i = 0; i < firstDayIndex; i++) {
                              cells.push(null);
                            }
                            for (let d = 1; d <= daysInMonth; d++) {
                              cells.push(new Date(currentYear, currentMonth, d));
                            }
                            
                            return cells.map((cellDate, idx) => {
                              if (!cellDate) {
                                return <div key={`empty-${idx}`} />;
                              }
                              
                              const cellDayNum = cellDate.getDate();
                              const isSat = cellDate.getDay() === 6;
                              const today = new Date();
                              const todayTrunc = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                              const cellTrunc = new Date(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate());
                              // Block any date within the 48h advance-booking window
                              const minBookingDate = new Date(todayTrunc.getTime() + 2 * 24 * 60 * 60 * 1000);
                              const isPast = cellTrunc < minBookingDate;
                              
                              const isSelected = selectedDate &&
                                selectedDate.getDate() === cellDate.getDate() &&
                                selectedDate.getMonth() === cellDate.getMonth() &&
                                selectedDate.getFullYear() === cellDate.getFullYear();
                                
                              const isToday = today.getDate() === cellDate.getDate() &&
                                today.getMonth() === cellDate.getMonth() &&
                                today.getFullYear() === cellDate.getFullYear();
                                
                              const isDisabled = isPast || isSat;
                              
                              let buttonStyle = "aspect-square rounded-lg flex flex-col items-center justify-center text-xs transition-all relative font-sans ";
                              
                              if (isDisabled) {
                                buttonStyle += isDarkMode
                                  ? "bg-stone-900/35 border border-transparent text-stone-600 line-through cursor-not-allowed opacity-35 "
                                  : "bg-stone-50 border border-transparent text-stone-300 line-through cursor-not-allowed opacity-50 ";
                              } else if (isSelected) {
                                buttonStyle += isDarkMode
                                  ? "bg-pink-600 border border-pink-500 text-stone-100 font-bold scale-[1.03] shadow-xs cursor-pointer "
                                  : "bg-stone-900 border border-stone-800 text-stone-50 font-bold scale-[1.03] shadow-xs cursor-pointer ";
                              } else {
                                buttonStyle += isDarkMode
                                  ? "border border-stone-800 bg-stone-900 hover:bg-stone-800 hover:border-stone-700 text-stone-300 cursor-pointer "
                                  : "border border-stone-200 bg-white hover:bg-stone-100/60 text-stone-700 cursor-pointer ";
                              }
                              
                              return (
                                <button
                                  key={`day-${idx}`}
                                  type="button"
                                  disabled={isDisabled}
                                  onClick={() => {
                                    setSelectedDate(cellDate);
                                    const nextSlots = getDynamicTimeSlots(cellDate);
                                    const firstAvailable = nextSlots.find(s => s.available);
                                    if (firstAvailable) {
                                      setSelectedTimeSlot(firstAvailable.time);
                                    }
                                  }}
                                  className={buttonStyle}
                                >
                                  {isToday && !isSelected && (
                                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-pink-500 animate-pulse" />
                                  )}
                                  {isSelected && (
                                    <span className="text-[8px] font-mono leading-none opacity-80">
                                      {b.monthsShort[cellDate.getMonth()]}
                                    </span>
                                  )}
                                  <span className={isSelected ? "font-bold text-xs" : "text-xs"}>
                                    {cellDayNum}
                                  </span>
                                </button>
                              );
                            });
                          })()}
                        </div>
                      </div>
                    </div>

                    {/* Time slots */}
                    <div className="space-y-2 lg:col-span-5">
                      <label className={`text-xs font-semibold tracking-widest flex items-center space-x-1 ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>
                        <Clock className="w-4 h-4 text-pink-500" />
                        <span>{b.step3}</span>
                      </label>

                      <div className="grid grid-cols-2 gap-2">
                        {activeTimeSlots.map((slot) => (
                          <button
                            key={slot.time}
                            type="button"
                            disabled={!slot.available}
                            onClick={() => setSelectedTimeSlot(slot.time)}
                            className={`py-3 px-1 border text-center rounded-xl text-[11px] font-mono font-medium transition-all ${
                              !slot.available
                                ? isDarkMode
                                  ? 'bg-stone-800/40 border-stone-800/70 text-stone-600 line-through cursor-not-allowed opacity-40'
                                  : 'bg-stone-100 border-stone-100 text-stone-300 line-through cursor-not-allowed opacity-50'
                                : selectedTimeSlot === slot.time
                                ? isDarkMode
                                  ? 'border-pink-500 bg-pink-950/35 text-pink-300 font-bold shadow-2xs'
                                  : 'border-pink-500 bg-pink-50 text-pink-700 font-bold shadow-2xs'
                                : isDarkMode
                                  ? 'border-stone-800 bg-stone-900 text-stone-300 hover:bg-stone-800/80 cursor-pointer'
                                  : 'border-stone-200 bg-white text-stone-650 hover:bg-[#fcfbf9] cursor-pointer'
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
                      {b.step4}
                    </label>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          placeholder={b.namePlaceholder}
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
                          placeholder={b.emailPlaceholder}
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
                          placeholder={b.phonePlaceholder}
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
                        placeholder={b.notesPlaceholder}
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

                  {/* CONFIRM BUTTON */}
                  <div className={`border-t pt-4.5 flex items-center justify-end flex-wrap gap-4 -mx-8 px-8 -mb-10 p-6 rounded-b-2xl ${
                    isDarkMode 
                      ? 'bg-stone-950 border-stone-800/80 text-stone-300' 
                      : 'bg-[#fbfaf8] border-stone-200 text-stone-600'
                  }`}>
                    <button
                      type="submit"
                      className="px-8 py-3.5 bg-pink-600 hover:bg-pink-700 border border-transparent rounded-xl text-xs font-sans font-bold tracking-widest text-white hover:shadow-md transition-all active:scale-95 cursor-pointer flex items-center space-x-2"
                    >
                      <span>{b.confirm}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* STEP 2: DEPOSIT */}
                  
                  <button
                    type="button"
                    onClick={() => setBookingStep('form')}
                    className="flex items-center space-x-1.5 text-xs text-stone-400 hover:text-pink-500 transition-colors cursor-pointer font-bold uppercase tracking-wider font-mono outline-none pt-1"
                  >
                    <span>{b.editDetails}</span>
                  </button>

                  {/* BOOKING SUMMARY */}
                  <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-stone-950/45 border-stone-800' : 'bg-white border-stone-200'} space-y-3.5 shadow-xs`}>
                    <h4 className="text-[10px] font-mono text-pink-500 uppercase font-extrabold tracking-widest block text-center sm:text-left">
                      {b.reservationSummary}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs font-sans leading-relaxed text-center sm:text-left">
                      <div className="space-y-0.5">
                        <span className="text-[9px] text-stone-400 font-mono tracking-wider block uppercase">{b.lashLook}</span>
                        <span className={`font-serif font-bold block ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>{activeProduct.name}</span>
                        <span className="text-[10px] text-pink-500 block font-mono font-bold">${activeProduct.price}.00</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[9px] text-stone-400 font-mono tracking-wider block uppercase">{b.dateTime}</span>
                        <span className={`font-semibold block ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>
                          {displayDate(selectedDate)}
                        </span>
                        <span className="text-pink-500 font-mono font-bold">{selectedTimeSlot}</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[9px] text-stone-400 font-mono tracking-wider block uppercase">{b.masterStylist}</span>
                        <span className={`font-semibold block ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>Nash</span>
                        <span className="text-stone-400 block text-[10px] font-light">{b.leadStylist}</span>
                      </div>
                    </div>
                  </div>

                  {/* DEPOSIT POLICY */}
                  <div className="space-y-3 pt-1">
                    <label className={`text-xs font-semibold tracking-widest block ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>
                      {b.pleaseRead}
                    </label>
                    
                    <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-2 ${
                      isDarkMode ? 'bg-stone-950 border-stone-800 text-stone-300' : 'bg-white border-stone-200 text-stone-600'
                    }`}>
                      <div className="font-extrabold text-pink-600 font-sans tracking-wider uppercase text-[10px]">
                        {b.depositPolicy}
                      </div>
                      <p className="font-sans font-light leading-normal" dangerouslySetInnerHTML={{ __html: b.depositText }} />
                    </div>

                    {/* Card inputs */}
                    <div className={`p-4.5 rounded-xl border max-w-md mx-auto space-y-3 ${
                      isDarkMode ? 'bg-stone-900/60 border-stone-800' : 'bg-stone-50 border-stone-200'
                    }`}>
                      <span className="text-[10px] font-mono text-stone-400 block tracking-widest uppercase text-center">{b.secureCheckout}</span>
                      
                      <div className="relative">
                        <input
                          type="text"
                          required
                          maxLength={19}
                          placeholder={b.cardPlaceholder}
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          className={`w-full border rounded-xl py-2.5 px-3.5 text-xs outline-none focus:ring-1 focus:ring-pink-500 font-mono transition-all ${
                            isDarkMode
                              ? 'bg-stone-950 border-stone-800 text-stone-100 placeholder-stone-500 focus:border-pink-500'
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
                              ? 'bg-stone-950 border-stone-800 text-stone-100 placeholder-stone-500 focus:border-pink-500'
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
                              ? 'bg-stone-950 border-stone-800 text-stone-100 placeholder-stone-500 focus:border-pink-500'
                              : 'bg-white border-stone-200 text-stone-800 placeholder-stone-400 focus:border-pink-500'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* FINAL CHECKOUT BUTTON */}
                  <div className={`border-t pt-4.5 flex items-center justify-between flex-wrap gap-4 -mx-8 px-8 -mb-10 p-6 rounded-b-2xl ${
                    isDarkMode 
                      ? 'bg-stone-950 border-stone-800/80 text-stone-300' 
                      : 'bg-[#fbfaf8] border-stone-200 text-stone-600'
                  }`}>
                    <div className="flex items-center space-x-3 text-stone-600 text-xs">
                      <Award className="w-8 h-8 text-pink-500 shrink-0" />
                      <div>
                        <span className={`font-bold block font-sans ${isDarkMode ? 'text-stone-200' : 'text-stone-900'}`}>{b.securedDeposit}</span>
                        <span className="font-light text-[11px] block text-stone-400">{b.cashmere}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-8 py-3.5 bg-pink-600 hover:bg-pink-700 border border-transparent rounded-xl text-xs font-sans font-bold tracking-widest text-white hover:shadow-md transition-all active:scale-95 cursor-pointer flex items-center space-x-2"
                    >
                      <span>{b.getBooked}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}

            </form>
          </motion.div>
        ) : (
          
          /* --- VOUCHER SUCCESS STATE --- */
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
              {b.appointmentConfirmed}
            </h3>
            <p className={`font-sans text-xs text-center mt-1 max-w-sm ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>
              {b.voucherEmailSent} <span className={`font-semibold ${isDarkMode ? 'text-stone-200' : 'text-stone-700'}`}>{confirmedBooking.customerEmail}</span>. {b.voucherRead}
            </p>

            {/* Voucher */}
            <div className={`w-full max-w-sm border rounded-2xl shadow-md overflow-hidden font-mono mt-6 relative transition-colors ${
              isDarkMode 
                ? 'bg-stone-950 border-stone-800 text-stone-300' 
                : 'bg-white border-stone-300/80 text-stone-800'
            }`}>
              <div className="absolute top-0 inset-x-0 h-2.5 bg-gradient-to-r from-pink-600 via-stone-900 to-pink-500" />
              
              <div className="p-5 space-y-4">
                
                {/* Voucher Header */}
                <div className={`flex items-center justify-between border-b pb-3 text-[10px] ${isDarkMode ? 'border-stone-800/60' : 'border-stone-200/60'}`}>
                  <div>
                    <span className="font-bold block tracking-wider">{b.voucherHeader}</span>
                    <span className="text-stone-400">{confirmedBooking.id}</span>
                  </div>
                  <div className="text-right">
                    <span className="bg-emerald-100 text-emerald-800 font-bold py-1 px-2 rounded-full uppercase text-[8px] tracking-widest text-emerald-500 inline-block">
                      {b.paidDeposit}
                    </span>
                  </div>
                </div>

                {/* Treatment */}
                <div className="space-y-1.5 text-xs">
                  <span className="text-[9px] text-stone-400 block tracking-widest uppercase">{b.treatmentArtist}</span>
                  <div className={`font-serif font-bold text-sm ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>{confirmedBooking.style.name}</div>
                  <div className="flex items-center text-[10px] text-stone-500 space-x-1">
                    <CornerDownRight className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                    <span>{b.stylist} <span className={`font-semibold ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>{confirmedBooking.artist.name}</span></span>
                  </div>
                </div>

                {/* Date & Time */}
                <div className={`grid grid-cols-2 gap-4 border-t border-b py-3 text-xs ${isDarkMode ? 'border-stone-800' : 'border-stone-100'}`}>
                  <div>
                    <span className="text-[9px] text-stone-400 block tracking-widest uppercase">{b.scheduledDate}</span>
                    <span className={`font-semibold ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>{confirmedBooking.date}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-stone-400 block tracking-widest uppercase">{b.arrivalTime}</span>
                    <span className="font-semibold text-pink-600">{confirmedBooking.timeSlot}</span>
                  </div>
                </div>

                {/* Client */}
                <div className="space-y-1 text-xs">
                  <span className="text-[9px] text-stone-400 block tracking-widest uppercase">{b.guestDetails}</span>
                  <div className={`font-medium ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>{confirmedBooking.customerName}</div>
                  <div className="text-[10px] text-stone-450">{confirmedBooking.customerPhone}</div>
                </div>

                {/* Billing */}
                <div className={`border-t pt-3 space-y-1.5 text-xs ${isDarkMode ? 'border-stone-800' : 'border-stone-100'}`}>
                  <span className="text-[9px] text-stone-400 block tracking-widest uppercase">{b.billingSummary}</span>
                  <div className="flex justify-between font-mono text-[11px]">
                    <span>{b.treatmentPrice}</span>
                    <span className={`font-semibold ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>${confirmedBooking.totalPrice}.00</span>
                  </div>
                  <div className="flex justify-between font-mono text-emerald-500 text-[11px]">
                    <span>{b.depositPaid}</span>
                    <span className="font-bold">-$25.00</span>
                  </div>
                  <div className={`flex justify-between font-mono text-[11px] border-t pt-1 border-dashed ${isDarkMode ? 'border-stone-800' : 'border-stone-200'}`}>
                    <span>{b.remainingDue}</span>
                    <span className="font-bold text-pink-500">${confirmedBooking.totalPrice - 25}.00</span>
                  </div>
                  <p className="text-[8px] text-pink-500 font-sans tracking-tight leading-normal font-light pt-1">
                    {b.depositNote}
                  </p>
                </div>

                {/* Barcode */}
                <div className={`pt-3 border-t flex flex-col items-center ${isDarkMode ? 'border-stone-800' : 'border-stone-100'}`}>
                  <div className="w-full h-8 flex items-end justify-between px-4">
                    {Array.from({ length: 28 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-xs ${isDarkMode ? 'bg-stone-300' : 'bg-stone-900'}`}
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
              <span>{b.addToCalendar}</span>
            </button>

            <button
              onClick={handleResetAppointment}
              className="mt-4 text-xs text-stone-500 hover:text-pink-600 font-sans tracking-wide border-b border-transparent hover:border-pink-500 pb-0.5 cursor-pointer"
            >
              {b.bookAnother}
            </button>
          </motion.div>
        )}
        
      </AnimatePresence>
    </div>
  );
}
