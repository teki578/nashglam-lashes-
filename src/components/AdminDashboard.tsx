import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, setDoc, onSnapshot, updateDoc, deleteDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { Calendar, Clock, LogOut, Save, Settings, X, Plus, Trash2, User } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { Appointment } from '../types';

export interface WeeklyHour {
  open: boolean;
  start: string;
  end: string;
}

export interface AvailabilitySettings {
  weeklyHours: Record<number, WeeklyHour>;
  blockedDates: string[]; // YYYY-MM-DD
  depositAmount?: number;
}

const defaultWeeklyHours: Record<number, WeeklyHour> = {
  0: { open: false, start: '10:00', end: '16:00' },
  1: { open: true, start: '09:00', end: '18:00' },
  2: { open: true, start: '09:00', end: '18:00' },
  3: { open: true, start: '09:00', end: '18:00' },
  4: { open: true, start: '09:00', end: '18:00' },
  5: { open: true, start: '09:00', end: '18:00' },
  6: { open: false, start: '10:00', end: '14:00' },
};

export default function AdminDashboard({ 
  isDarkMode = false,
  appointments = [],
  onRemoveAppointment 
}: { 
  isDarkMode?: boolean;
  appointments?: Appointment[];
  onRemoveAppointment?: (id: string) => void;
}) {
  const { t } = useLanguage();
  const [settings, setSettings] = useState<AvailabilitySettings>({
    weeklyHours: defaultWeeklyHours,
    blockedDates: []
  });
  const [saving, setSaving] = useState(false);
  const [newBlockedDate, setNewBlockedDate] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const docRef = doc(db, 'settings', 'availability');
    const unsub = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as AvailabilitySettings;
        setSettings({
          ...data,
          depositAmount: data.depositAmount ?? 25
        });
      } else {
        setDoc(docRef, {
          weeklyHours: defaultWeeklyHours,
          blockedDates: [],
          depositAmount: 25
        });
      }
    }, (err) => {
      console.error("Error fetching settings:", err);
    });
    return () => unsub();
  }, []);

  const handleSave = () => {
    setMessage('');
    
    // We don't await the promise so the UI feels instantly responsive. 
    // Firebase handles the actual syncing in the background!
    setDoc(doc(db, 'settings', 'availability'), settings)
      .catch((err) => {
        console.error(err);
        setMessage('Error saving settings.');
      });
      
    setMessage('Settings saved successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleAddBlockedDate = () => {
    if (!newBlockedDate) return;
    if (settings.blockedDates.includes(newBlockedDate)) return;
    setSettings(prev => ({
      ...prev,
      blockedDates: [...prev.blockedDates, newBlockedDate].sort()
    }));
    setNewBlockedDate('');
  };

  const handleRemoveBlockedDate = (date: string) => {
    setSettings(prev => ({
      ...prev,
      blockedDates: prev.blockedDates.filter(d => d !== date)
    }));
  };

  const handleToggleDay = (dayIndex: number) => {
    setSettings(prev => ({
      ...prev,
      weeklyHours: {
        ...prev.weeklyHours,
        [dayIndex]: {
          ...prev.weeklyHours[dayIndex],
          open: !prev.weeklyHours[dayIndex].open
        }
      }
    }));
  };

  const handleTimeChange = (dayIndex: number, field: 'start' | 'end', value: string) => {
    setSettings(prev => ({
      ...prev,
      weeklyHours: {
        ...prev.weeklyHours,
        [dayIndex]: {
          ...prev.weeklyHours[dayIndex],
          [field]: value
        }
      }
    }));
  };

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className={`p-6 md:p-10 rounded-2xl border-2 ring-2 ring-pink-500/50 border-pink-500 shadow-xl shadow-pink-500/20 ${isDarkMode ? 'bg-stone-950' : 'bg-white'} mt-8 relative overflow-hidden`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-pink-500/10 rounded-xl">
            <Settings className="w-6 h-6 text-pink-500" />
          </div>
          <div>
            <h2 className={`text-2xl font-serif font-bold ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>Admin Dashboard</h2>
            <p className={`text-xs font-mono mt-1 ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>Manage your availability and settings</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold tracking-widest rounded-xl transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'SAVING...' : 'SAVE CHANGES'}</span>
          </button>
          <button
            onClick={() => signOut(auth)}
            className={`flex items-center space-x-2 px-5 py-2.5 border text-xs font-bold tracking-widest rounded-xl transition-all ${
              isDarkMode ? 'border-stone-800 hover:bg-stone-900 text-stone-300' : 'border-stone-200 hover:bg-stone-50 text-stone-600'
            }`}
          >
            <LogOut className="w-4 h-4" />
            <span>LOGOUT</span>
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-semibold border ${message.includes('Error') ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Hours */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-dashed border-stone-800/20 dark:border-stone-800/60">
            <Clock className="w-4 h-4 text-pink-500" />
            <h3 className={`text-sm font-bold tracking-widest uppercase ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>Weekly Hours</h3>
          </div>
          
          <div className="space-y-3">
            {daysOfWeek.map((day, idx) => {
              const h = settings.weeklyHours[idx];
              return (
                <div key={day} className={`flex items-center justify-between p-3 rounded-xl border ${isDarkMode ? 'bg-stone-900/50 border-stone-800' : 'bg-stone-50 border-stone-100'}`}>
                  <div className="flex items-center space-x-3 w-32">
                    <input 
                      type="checkbox" 
                      checked={h.open} 
                      onChange={() => handleToggleDay(idx)}
                      className="w-4 h-4 text-pink-500 rounded focus:ring-pink-500 focus:ring-2 accent-pink-500 cursor-pointer"
                    />
                    <span className={`text-sm font-semibold ${!h.open ? 'opacity-50 line-through' : ''} ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>{day}</span>
                  </div>
                  
                  {h.open ? (
                    <div className="flex items-center space-x-2">
                      <input 
                        type="time" 
                        value={h.start}
                        onChange={(e) => handleTimeChange(idx, 'start', e.target.value)}
                        className={`text-xs px-2 py-1 border rounded outline-none ${isDarkMode ? 'bg-stone-950 border-stone-800 text-stone-300' : 'bg-white border-stone-200 text-stone-700'}`}
                      />
                      <span className="text-stone-500 text-xs">to</span>
                      <input 
                        type="time" 
                        value={h.end}
                        onChange={(e) => handleTimeChange(idx, 'end', e.target.value)}
                        className={`text-xs px-2 py-1 border rounded outline-none ${isDarkMode ? 'bg-stone-950 border-stone-800 text-stone-300' : 'bg-white border-stone-200 text-stone-700'}`}
                      />
                    </div>
                  ) : (
                    <span className="text-xs font-bold tracking-widest text-stone-500 opacity-60 uppercase">Closed</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Blocked Dates */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-dashed border-stone-800/20 dark:border-stone-800/60">
            <Calendar className="w-4 h-4 text-pink-500" />
            <h3 className={`text-sm font-bold tracking-widest uppercase ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>Blocked Dates (Time Off)</h3>
          </div>
          
          <div className="flex items-center space-x-2">
            <input 
              type="date" 
              value={newBlockedDate}
              onChange={(e) => setNewBlockedDate(e.target.value)}
              className={`flex-1 px-3 py-2 text-sm border rounded-xl outline-none focus:border-pink-500 ${isDarkMode ? 'bg-stone-900 border-stone-800 text-stone-200' : 'bg-white border-stone-200 text-stone-800'}`}
            />
            <button 
              onClick={handleAddBlockedDate}
              disabled={!newBlockedDate}
              className="p-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className={`p-4 rounded-xl border min-h-[200px] max-h-[350px] overflow-y-auto ${isDarkMode ? 'bg-stone-900/50 border-stone-800' : 'bg-stone-50 border-stone-100'}`}>
            {settings.blockedDates.length === 0 ? (
              <p className="text-xs font-mono text-stone-500 text-center mt-4">No specific dates are currently blocked off.</p>
            ) : (
              <div className="flex flex-col space-y-2">
                {settings.blockedDates.map(date => (
                  <div key={date} className={`flex items-center justify-between p-2.5 rounded-lg border ${isDarkMode ? 'bg-stone-950 border-stone-800' : 'bg-white border-stone-200'}`}>
                    <span className={`text-sm font-mono ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>{new Date(date + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    <button 
                      onClick={() => handleRemoveBlockedDate(date)}
                      className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Deposit Settings */}
          <div className={`p-5 sm:p-6 rounded-2xl border ${isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-stone-50 border-stone-200'}`}>
            <div className="flex items-center space-x-2 mb-4">
              <Settings className="w-4 h-4 text-pink-500" />
              <h3 className={`font-bold uppercase tracking-widest text-xs ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>Deposit Amount</h3>
            </div>
            <div className="flex flex-col space-y-2 max-w-[200px]">
              <label className={`text-[10px] font-bold tracking-widest uppercase ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>
                Amount ($ CAD)
              </label>
              <input
                type="number"
                min="0"
                step="5"
                value={settings.depositAmount ?? 25}
                onChange={(e) => setSettings(prev => ({ ...prev, depositAmount: Number(e.target.value) }))}
                className={`border rounded-xl py-2 px-3 text-sm font-bold focus:ring-1 focus:ring-pink-500 outline-none transition-all ${
                  isDarkMode 
                    ? 'bg-stone-950 border-stone-800 text-stone-100' 
                    : 'bg-white border-stone-200 text-stone-800'
                }`}
              />
            </div>
          </div>
        </div>
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2 mt-4 border-t border-dashed border-stone-800/20 dark:border-stone-800/60 pt-8">
          <div className="flex items-center space-x-2 pb-4">
            <User className="w-5 h-5 text-pink-500" />
            <h3 className={`text-lg font-serif font-bold ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>Upcoming Appointments</h3>
          </div>
          
          {appointments.length === 0 ? (
            <div className={`p-8 rounded-xl border text-center ${isDarkMode ? 'bg-stone-900/50 border-stone-800' : 'bg-stone-50 border-stone-100'}`}>
              <p className="text-sm font-mono text-stone-500">No upcoming appointments yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {appointments.map((app) => (
                <div key={app.id} className={`p-4 rounded-xl border relative ${isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'} ${app.status === 'cancelled' || app.status === 'no-show' ? 'opacity-50 grayscale' : ''}`}>
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this appointment permanently?')) {
                        deleteDoc(doc(db, 'appointments', app.id)).catch(console.error);
                      }
                    }}
                    className="absolute top-3 right-3 p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete Permanently"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="space-y-1 mb-3 pr-8">
                    <div className="flex items-center space-x-2">
                      <p className={`font-bold ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>{app.customerName || (app as any).clientName}</p>
                      {app.status === 'cancelled' && <span className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-red-500/10 text-red-500 uppercase">Cancelled</span>}
                      {app.status === 'no-show' && <span className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-500 uppercase">No Show</span>}
                    </div>
                    <p className="text-xs font-mono text-pink-500">{app.customerPhone || (app as any).clientPhone}</p>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className={isDarkMode ? 'text-stone-400' : 'text-stone-600'}>
                      <span className="font-semibold text-stone-500 mr-2">Date:</span> {app.date}
                    </p>
                    <p className={isDarkMode ? 'text-stone-400' : 'text-stone-600'}>
                      <span className="font-semibold text-stone-500 mr-2">Time:</span> {app.timeSlot}
                    </p>
                    <p className={isDarkMode ? 'text-stone-400' : 'text-stone-600'}>
                      <span className="font-semibold text-stone-500 mr-2">Service:</span> {app.style?.name} {app.selectedServiceOption?.id === 'refill' || (app as any).serviceOptionId === 'refill' ? '(Refill)' : '(Full Set)'}
                    </p>
                  </div>
                  {(!app.status || app.status === 'confirmed') && (
                    <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-dashed border-stone-800/20 dark:border-stone-800/60">
                      <button
                        onClick={() => updateDoc(doc(db, 'appointments', app.id), { status: 'cancelled' }).catch(console.error)}
                        className="flex-1 py-1.5 text-[10px] font-bold tracking-widest uppercase rounded bg-stone-100 hover:bg-stone-200 text-stone-700 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-300 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => updateDoc(doc(db, 'appointments', app.id), { status: 'no-show' }).catch(console.error)}
                        className="flex-1 py-1.5 text-[10px] font-bold tracking-widest uppercase rounded bg-orange-100 hover:bg-orange-200 text-orange-700 dark:bg-orange-950 dark:hover:bg-orange-900 dark:text-orange-400 transition-colors"
                      >
                        No Show
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
