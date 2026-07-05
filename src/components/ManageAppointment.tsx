import React, { useState } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Appointment } from '../types';
import { Search, Calendar, Clock, AlertTriangle } from 'lucide-react';

interface ManageAppointmentProps {
  isDarkMode?: boolean;
  onRescheduleStart: (appointment: Appointment) => void;
  onBackToBooking: () => void;
}

export default function ManageAppointment({ isDarkMode = false, onRescheduleStart, onBackToBooking }: ManageAppointmentProps) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setAppointments(null);
    try {
      const q = query(collection(db, 'appointments'), where('customerEmail', '==', email.trim()));
      const snap = await getDocs(q);
      const apps = snap.docs
        .map(d => ({ ...d.data(), id: d.id } as Appointment))
        .filter(a => a.customerPhone === phone.trim() && a.status !== 'cancelled' && a.status !== 'no-show');
      
      if (apps.length === 0) {
        setError('No active appointments found with that email and phone number.');
      } else {
        setAppointments(apps);
      }
    } catch (err) {
      console.error(err);
      setError('Error looking up appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointment: Appointment) => {
    if (!window.confirm('Are you sure you want to cancel? Your $25 deposit is non-refundable.')) return;
    try {
      await updateDoc(doc(db, 'appointments', appointment.id), { status: 'cancelled' });
      setAppointments(prev => prev ? prev.filter(a => a.id !== appointment.id) : null);
    } catch (err) {
      console.error(err);
      alert('Error cancelling appointment.');
    }
  };

  const isReschedulable = (appDate: string, appTime: string) => {
    // Parse the appointment date and time
    const [timeStr, modifier] = appTime.split(' ');
    let [hoursStr, minutesStr] = timeStr.split(':');
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    const d = new Date(appDate);
    d.setHours(hours, minutes, 0, 0);

    const now = new Date();
    const diffHours = (d.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours >= 24;
  };

  return (
    <div className={`w-full max-w-2xl mx-auto p-6 md:p-10 rounded-2xl border shadow-xl ${isDarkMode ? 'bg-[#1c1917] border-stone-800' : 'bg-white border-stone-200'}`}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className={`font-serif text-3xl font-bold ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>Manage Appointment</h2>
          <p className={`text-xs font-mono mt-2 ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>Find your active booking</p>
        </div>
        <button 
          onClick={onBackToBooking}
          className="text-xs font-bold tracking-widest uppercase text-pink-500 hover:text-pink-600 transition-colors"
        >
          &larr; Back to Booking
        </button>
      </div>

      <form onSubmit={handleSearch} className="space-y-4 mb-8">
        <div>
          <label className={`block text-xs font-bold tracking-widest uppercase mb-2 ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>Email</label>
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="The email used to book"
            className={`w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 transition-all ${isDarkMode ? 'bg-[#0c0a09] border-stone-800 text-stone-200' : 'bg-stone-50 border-stone-200 text-stone-900'}`}
          />
        </div>
        <div>
          <label className={`block text-xs font-bold tracking-widest uppercase mb-2 ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>Phone Number</label>
          <input 
            type="tel" 
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="The phone number used to book"
            className={`w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 transition-all ${isDarkMode ? 'bg-[#0c0a09] border-stone-800 text-stone-200' : 'bg-stone-50 border-stone-200 text-stone-900'}`}
          />
        </div>
        <button 
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold tracking-widest text-xs uppercase flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
        >
          <Search className="w-4 h-4" />
          <span>{loading ? 'Searching...' : 'Find Appointment'}</span>
        </button>
        {error && <p className="text-red-500 text-xs text-center mt-2 font-mono">{error}</p>}
      </form>

      {appointments && appointments.length > 0 && (
        <div className="space-y-4">
          <h3 className={`text-sm font-bold tracking-widest uppercase mb-4 ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>Your Appointments</h3>
          {appointments.map(app => {
            const canReschedule = isReschedulable(app.date, app.timeSlot);
            return (
              <div key={app.id} className={`p-5 rounded-xl border ${isDarkMode ? 'bg-[#0c0a09] border-stone-800' : 'bg-stone-50 border-stone-200'}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className={`font-bold ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>{app.style?.name}</h4>
                    <div className={`mt-2 space-y-1 text-sm ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>
                      <p className="flex items-center space-x-2"><Calendar className="w-3.5 h-3.5" /> <span>{app.date}</span></p>
                      <p className="flex items-center space-x-2"><Clock className="w-3.5 h-3.5" /> <span>{app.timeSlot}</span></p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 min-w-[140px]">
                    {canReschedule ? (
                      <button 
                        onClick={() => onRescheduleStart(app)}
                        className="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-white text-[10px] font-bold tracking-widest uppercase transition-colors text-center cursor-pointer"
                      >
                        Reschedule
                      </button>
                    ) : (
                      <div className="px-4 py-2 rounded-lg bg-orange-500/10 text-orange-500 border border-orange-500/20 text-[10px] font-bold tracking-wider text-center flex flex-col items-center justify-center">
                        <AlertTriangle className="w-3 h-3 mb-1" />
                        <span>Under 24 Hrs</span>
                      </div>
                    )}
                    <button 
                      onClick={() => handleCancel(app)}
                      className="px-4 py-2 rounded-lg bg-stone-200 hover:bg-red-500 hover:text-white text-stone-600 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-red-500 dark:hover:text-white text-[10px] font-bold tracking-widest uppercase transition-colors text-center cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
                {!canReschedule && (
                  <p className="mt-4 text-[10px] font-mono text-stone-500 leading-relaxed border-t border-dashed border-stone-800/20 dark:border-stone-800/60 pt-3">
                    Appointments within 24 hours cannot be rescheduled. If you cancel now, your $25 deposit will be forfeited as per our policy.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
