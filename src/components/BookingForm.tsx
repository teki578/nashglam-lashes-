/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, User, Phone, Mail, Clock, MessageSquare, CheckCircle, Award, Star, ArrowRight, CornerDownRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { LashProduct, LashArtist, Appointment } from '../types';
import { LASH_ARTISTS, LASH_PRODUCTS } from '../data';
import { useLanguage } from '../i18n/LanguageContext';
import { onSnapshot, collection } from 'firebase/firestore';
import { AvailabilitySettings } from './AdminDashboard';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface BookingFormProps {
  selectedProduct: LashProduct | null;
  onBookingConfirmed: (appointment: Appointment) => void;
  onSelectProduct: (product: LashProduct | null) => void;
  isDarkMode?: boolean;
  reschedulingAppointment?: Appointment | null;
  onCancelReschedule?: () => void;
}

export default function BookingForm({
  selectedProduct,
  onBookingConfirmed,
  onSelectProduct,
  isDarkMode = false,
  reschedulingAppointment,
  onCancelReschedule,
}: BookingFormProps) {
  const { t, lang } = useLanguage();
  const b = t.booking;

  const [activeArtist, setActiveArtist] = useState<LashArtist>(LASH_ARTISTS[0]);
  const [bookingStep, setBookingStep] = useState<'form' | 'deposit'>('form');
  const [formError, setFormError] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  const stripe = useStripe();
  const elements = useElements();
  
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

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentYear, setCurrentYear] = useState(() => getInitialSelectedDate().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => getInitialSelectedDate().getMonth());
  
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedServiceOptionId, setSelectedServiceOptionId] = useState<string | null>(null);
  
  // Intake Forms state
  const [name, setName] = useState(reschedulingAppointment ? (reschedulingAppointment.customerName || (reschedulingAppointment as any).clientName || '') : '');
  const [email, setEmail] = useState(reschedulingAppointment ? (reschedulingAppointment.customerEmail || '') : '');
  const [phone, setPhone] = useState(reschedulingAppointment ? (reschedulingAppointment.customerPhone || (reschedulingAppointment as any).clientPhone || '') : '');
  const [notes, setNotes] = useState('');

  const [availability, setAvailability] = useState<AvailabilitySettings | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'availability'), (docSnap) => {
      if (docSnap.exists()) {
        setAvailability(docSnap.data() as AvailabilitySettings);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (formError) setFormError(null);
  }, [selectedProduct, selectedServiceOptionId, selectedDate, selectedTimeSlot, name, email, phone]);

  useEffect(() => {
    if (reschedulingAppointment && reschedulingAppointment.style) {
      onSelectProduct(reschedulingAppointment.style);
    }
  }, [reschedulingAppointment]);

  // Voucher Success State
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);
  
  // Loaded booked state
  const [bookedAppointments, setBookedAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'appointments'), (snapshot) => {
      const apps = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Appointment));
      setBookedAppointments(apps);
    });
    return () => unsub();
  }, []);

  const getDynamicTimeSlots = (date: Date) => {
    const day = date.getDay(); // 0=Sun, 6=Sat
    
    let slots: { time: string }[] = [];

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const dateString = `${yyyy}-${mm}-${dd}`;
    
    if (availability && availability.blockedDates && availability.blockedDates.includes(dateString)) {
      return [];
    }
    
    if (availability && availability.weeklyHours) {
      const daySettings = availability.weeklyHours[day];
      if (!daySettings || !daySettings.open || !daySettings.start || !daySettings.end) return [];
      
      const [startH, startM] = daySettings.start.split(':').map(Number);
      const [endH, endM] = daySettings.end.split(':').map(Number);
      
      let currentMins = startH * 60 + startM;
      const endMins = endH * 60 + endM;
      
      while (currentMins + 30 <= endMins) {
        const h = Math.floor(currentMins / 60);
        const m = currentMins % 60;
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        slots.push({ time: `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}` });
        currentMins += 30;
      }
    } else {
      if (day === 6) return [];
      let currentMins = day === 0 ? 10 * 60 : 9 * 60 + 30;
      const endMins = day === 0 ? 17 * 60 + 30 : 19 * 60 + 30;
      while (currentMins <= endMins) {
        const h = Math.floor(currentMins / 60);
        const m = currentMins % 60;
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        slots.push({ time: `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}` });
        currentMins += 30;
      }
    }
        
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
      
      if (!availability && day === 5) {
        if (slot.time === '04:30 PM' || slot.time === '06:00 PM' || slot.time === '07:30 PM') {
          isAvailable = false;
        }
      }
      
      const slotStartTime = slotDateTime.getTime();
      const slotEndTime = slotStartTime + 3 * 60 * 60 * 1000; // 3 hours

      const targetDateStr = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      const isOverlapping = bookedAppointments.some((app) => {
        if (app.date !== targetDateStr) return false;
        if (app.status === 'cancelled' || app.status === 'no-show') return false;
        
        const [appTimeStr, appMod] = app.timeSlot.split(' ');
        let [appHStr, appMStr] = appTimeStr.split(':');
        let appH = parseInt(appHStr, 10);
        let appM = parseInt(appMStr, 10);
        if (appMod === 'PM' && appH < 12) appH += 12;
        if (appMod === 'AM' && appH === 12) appH = 0;
        
        const appStartTime = new Date(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate(), appH, appM).getTime();
        const appEndTime = appStartTime + 3 * 60 * 60 * 1000;
        
        return slotStartTime < appEndTime && slotEndTime > appStartTime;
      });

      if (isOverlapping) {
        isAvailable = false;
      }
      
      return {
        time: slot.time,
        available: isAvailable
      };
    });
  };

  const activeTimeSlots = selectedDate ? getDynamicTimeSlots(selectedDate) : [];

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

  const formatDateForInput = (date: Date | null) => {
    if (!date) return '';
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleProceedToDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!selectedDate || !selectedTimeSlot) {
      setFormError(lang === 'fr' ? 'Veuillez sélectionner une date et une heure.' : 'Please select a date and time.');
      return;
    }
    if (!selectedProduct) {
      setFormError(b.alertSelectProduct);
      return;
    }
    if (selectedProduct.serviceOptions && !selectedServiceOptionId) {
      setFormError(lang === 'fr' ? 'Veuillez sélectionner un type de service.' : 'Please select a service type.');
      return;
    }
    if (!name.trim()) {
      setFormError(b.alertName);
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError(b.alertEmail);
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 7) {
      setFormError(b.alertPhone);
      return;
    }

    if (reschedulingAppointment) {
      handleUpdateReschedule();
      return;
    }

    const findAvailable = activeTimeSlots.find(s => s.available);
    if (findAvailable && !activeTimeSlots.some(s => s.time === selectedTimeSlot && s.available)) {
      setSelectedTimeSlot(findAvailable.time);
    }
    
    setBookingStep('deposit');
  };

  const handleUpdateReschedule = async () => {
    if (!selectedProduct || !selectedDate || !selectedTimeSlot || !reschedulingAppointment) return;
    const formattedDate = selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const activeServiceOption = selectedProduct.serviceOptions?.find(o => o.id === selectedServiceOptionId);
    
    try {
      await updateDoc(doc(db, 'appointments', reschedulingAppointment.id), {
        date: formattedDate,
        timeSlot: selectedTimeSlot,
        style: selectedProduct,
        selectedServiceOption: activeServiceOption || null,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
      });

      const updatedApp: Appointment = {
        ...reschedulingAppointment,
        date: formattedDate,
        timeSlot: selectedTimeSlot,
        style: selectedProduct,
        selectedServiceOption: activeServiceOption,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
      };
      setConfirmedBooking(updatedApp);
      onBookingConfirmed(updatedApp);
    } catch (err) {
      console.error('Error rescheduling', err);
      setFormError('Failed to reschedule. Please try again.');
    }
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!selectedProduct) return;
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setFormError(b.alertContactDetails);
      return;
    }
    
    if (reschedulingAppointment) {
      handleUpdateReschedule();
      return;
    }
    
    if (!stripe || !elements) {
      setFormError('Stripe has not loaded. Please wait a moment and try again.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setFormError('Payment form not found.');
      return;
    }
    
    if (!selectedDate || !selectedTimeSlot) return;

    setIsProcessingPayment(true);
    setFormError(null);

    try {
      // 1. Get deposit amount from availability settings or fallback to 25
      const depositAmount = availability?.depositAmount ?? 25;

      // 2. Ask backend to create a PaymentIntent
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: depositAmount }),
      });

      if (!res.ok) {
        throw new Error('Network error. Failed to initialize payment.');
      }

      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const { clientSecret } = data;

      // 3. Confirm card payment directly with Stripe
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: name,
            email: email,
            phone: phone,
          }
        }
      });

      if (paymentResult.error) {
        throw new Error(paymentResult.error.message || 'Payment failed.');
      }

      // If successful, create the appointment
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

      // Save to Firebase
      await setDoc(doc(db, 'appointments', newAppointment.id), newAppointment);

      const updated = [...bookedAppointments, newAppointment];
      setBookedAppointments(updated);

      setConfirmedBooking(newAppointment);
      onBookingConfirmed(newAppointment);
      
      setName('');
      setEmail('');
      setPhone('');
      setNotes('');
      cardElement.clear();

    } catch (err: any) {
      console.error(err);
      setFormError(err.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
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
                {reschedulingAppointment ? "Reschedule Appointment" : (bookingStep === 'form' ? b.titleForm : b.titleDeposit)}
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

            <form onSubmit={bookingStep === 'form' ? handleProceedToDeposit : handleConfirmPayment} className="space-y-6">
              
              {bookingStep === 'form' ? (
                <>
                  {/* 1. SELECT SERVICE TREATMENT */}
                  <div className="space-y-2">
                    <label className={`text-xs font-semibold tracking-widest block ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>
                      {b.step1} <span className="text-pink-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {LASH_PRODUCTS.map((p) => (
                        <div key={p.id} className="flex flex-col space-y-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (selectedProduct?.id === p.id) {
                                onSelectProduct(null);
                                setSelectedServiceOptionId(null);
                              } else {
                                onSelectProduct(p);
                                setSelectedServiceOptionId(null);
                              }
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
                          
                          {selectedProduct?.id === p.id && p.serviceOptions && (
                            <div className="pl-4 pr-1 py-1 space-y-2 border-l-2 border-pink-500/30 ml-2 animate-in fade-in slide-in-from-top-2 duration-200">
                              <label className={`text-[9px] uppercase font-bold tracking-widest block ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>
                                {lang === 'fr' ? 'SÉLECTIONNEZ LE TYPE DE SERVICE' : 'SELECT SERVICE TYPE'} <span className="text-pink-500">*</span>
                              </label>
                              <div className="flex flex-col space-y-1.5">
                                {p.serviceOptions.map((opt) => (
                                  <button
                                    key={opt.id}
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (selectedServiceOptionId === opt.id) {
                                        setSelectedServiceOptionId(null);
                                      } else {
                                        setSelectedServiceOptionId(opt.id);
                                      }
                                    }}
                                    className={`flex items-center justify-between p-2.5 border rounded-lg transition-all text-left cursor-pointer ${
                                      selectedServiceOptionId === opt.id
                                        ? isDarkMode ? 'border-pink-500 bg-pink-950/30 text-pink-400' : 'border-pink-500 bg-pink-50 text-pink-600'
                                        : isDarkMode ? 'border-stone-800 bg-stone-900/50 text-stone-400' : 'border-stone-200 bg-stone-50 text-stone-600'
                                    }`}
                                  >
                                    <span className="text-[10px] font-semibold tracking-wide">{opt.label}</span>
                                    <span className="text-[10px] font-bold">${opt.price}.00</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>


                  {/* 2. SELECT DATE CALENDAR & TIME SLOTS */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-1.5">
                    
                    {/* Monthly calendar grid */}
                    <div className="space-y-2 lg:col-span-7">
                      <div className="flex items-center justify-between">
                        <label className={`text-xs font-semibold tracking-widest flex items-center space-x-1 ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>
                          <Calendar className="w-4 h-4 text-pink-500" />
                          <span>{b.step2} <span className="text-pink-500">*</span></span>
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
                              
                              let isClosedDay = false;
                              if (availability) {
                                if (availability.weeklyHours) {
                                  isClosedDay = !availability.weeklyHours[cellDate.getDay()]?.open;
                                }
                                const cellY = cellDate.getFullYear();
                                const cellM = String(cellDate.getMonth() + 1).padStart(2, '0');
                                const cellD = String(cellDate.getDate()).padStart(2, '0');
                                const cellDateString = `${cellY}-${cellM}-${cellD}`;
                                
                                if (availability.blockedDates?.includes(cellDateString)) {
                                  isClosedDay = true;
                                }
                              }
                              
                              const cellDayNum = cellDate.getDate();
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
                                
                              const isDisabled = isPast || isClosedDay;
                              
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
                                    if (isSelected) {
                                      setSelectedDate(null);
                                      setSelectedTimeSlot(null);
                                    } else {
                                      setSelectedDate(cellDate);
                                      const nextSlots = getDynamicTimeSlots(cellDate);
                                      const firstAvailable = nextSlots.find(s => s.available);
                                      if (firstAvailable) {
                                        setSelectedTimeSlot(firstAvailable.time);
                                      } else {
                                        setSelectedTimeSlot(null);
                                      }
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
                        <span>{b.step3} <span className="text-pink-500">*</span></span>
                      </label>

                      <div className="grid grid-cols-2 gap-2">
                        {activeTimeSlots.map((slot) => (
                          <button
                            key={slot.time}
                            type="button"
                            disabled={!slot.available}
                            onClick={() => {
                              if (selectedTimeSlot === slot.time) {
                                setSelectedTimeSlot(null);
                              } else {
                                setSelectedTimeSlot(slot.time);
                              }
                            }}
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
                      {b.step4} <span className="text-pink-500">*</span>
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

                  {formError && (
                    <div className="pt-2 text-center">
                      <span className={`inline-block text-xs font-semibold px-4 py-2 rounded-lg border ${
                        isDarkMode
                          ? 'bg-red-950/40 text-red-400 border-red-900/50'
                          : 'bg-red-50 text-red-600 border-red-200'
                      }`}>
                        {formError}
                      </span>
                    </div>
                  )}

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
                      <span>{reschedulingAppointment ? "CONFIRM RESCHEDULE" : b.confirm}</span>
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
                      
                      <div className={`p-4 border rounded-xl transition-all ${
                        isDarkMode
                          ? 'bg-stone-950 border-stone-800 focus-within:border-pink-500'
                          : 'bg-white border-stone-200 focus-within:border-pink-500'
                      }`}>
                        <CardElement options={{
                          style: {
                            base: {
                              color: isDarkMode ? '#f5f5f4' : '#292524',
                              fontFamily: 'monospace',
                              fontSmoothing: 'antialiased',
                              fontSize: '14px',
                              '::placeholder': {
                                color: isDarkMode ? '#78716c' : '#a8a29e',
                              },
                            },
                            invalid: {
                              color: '#ef4444',
                              iconColor: '#ef4444',
                            },
                          },
                        }} />
                      </div>
                    </div>
                  </div>

                  {formError && (
                    <div className="pt-2 text-center">
                      <span className={`inline-block text-xs font-semibold px-4 py-2 rounded-lg border ${
                        isDarkMode
                          ? 'bg-red-950/40 text-red-400 border-red-900/50'
                          : 'bg-red-50 text-red-600 border-red-200'
                      }`}>
                        {formError}
                      </span>
                    </div>
                  )}

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
                      disabled={!stripe || isProcessingPayment}
                      className="px-8 py-3.5 bg-pink-600 hover:bg-pink-700 border border-transparent rounded-xl text-xs font-sans font-bold tracking-widest text-white hover:shadow-md transition-all active:scale-95 cursor-pointer flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>{isProcessingPayment ? "PROCESSING..." : b.getBooked}</span>
                      {!isProcessingPayment && <ArrowRight className="w-4 h-4" />}
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
