import React, { useState } from 'react';
import { Clock, CalendarOff, AlertTriangle, Check, Power, ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DaySchedule {
  day: string;
  bnDay: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

const DEFAULT_WEEK: DaySchedule[] = [
  { day: 'Saturday', bnDay: 'শনিবার', isOpen: true, openTime: '09:00', closeTime: '21:00' },
  { day: 'Sunday', bnDay: 'রবিবার', isOpen: true, openTime: '09:00', closeTime: '21:00' },
  { day: 'Monday', bnDay: 'সোমবার', isOpen: true, openTime: '09:00', closeTime: '21:00' },
  { day: 'Tuesday', bnDay: 'মঙ্গলবার', isOpen: true, openTime: '09:00', closeTime: '21:00' },
  { day: 'Wednesday', bnDay: 'বুধবার', isOpen: true, openTime: '09:00', closeTime: '21:00' },
  { day: 'Thursday', bnDay: 'বৃহস্পতিবার', isOpen: true, openTime: '09:00', closeTime: '21:00' },
  { day: 'Friday', bnDay: 'শুক্রবার', isOpen: false, openTime: '15:00', closeTime: '21:00' },
];

export const StoreHoursSettingsPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [schedules, setSchedules] = useState<DaySchedule[]>(DEFAULT_WEEK);
  const [vacationMode, setVacationMode] = useState(false);
  const [vacationNotice, setVacationNotice] = useState(
    'Eid Holidays: Our physical shop & warehouse are temporarily closed. Orders placed now will be dispatched starting next week.'
  );
  const [autoAcceptOrders, setAutoAcceptOrders] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleDay = (idx: number) => {
    setSchedules((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, isOpen: !item.isOpen } : item))
    );
  };

  const updateTime = (idx: number, field: 'openTime' | 'closeTime', val: string) => {
    setSchedules((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: val } : item))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h3 className="text-lg font-black text-[var(--pm-text)]">
          {isBn ? 'দোকানের সময়সূচী ও ছুটি মোড' : 'Store Hours & Vacation Mode'}
        </h3>
        <p className="text-xs text-[var(--pm-muted)]">
          {isBn
            ? 'প্রতিদিনের খোলার সময়, বন্ধের দিন এবং বিশেষ ছুটির জন্য স্টোর সাময়িক বন্ধ রাখার নোটিশ নির্ধারণ করুন'
            : 'Configure daily opening hours, weekly off-days, and vacation pause mode'}
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-[var(--pm-success-soft)] border border-[var(--pm-success)]/30 text-[var(--pm-success)] text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 shrink-0" />
          <span>{isBn ? 'সময়সূচী সেটিংস সফলভাবে আপডেট হয়েছে!' : 'Store hours updated successfully!'}</span>
        </div>
      )}

      {/* Emergency Vacation / Pause Mode Banner */}
      <div className={`p-5 rounded-3xl border transition-all ${
        vacationMode 
          ? 'bg-[var(--pm-warning-soft)] border-[var(--pm-warning)]/40 text-[var(--pm-text)]' 
          : 'bg-[var(--pm-card)] border-[var(--pm-border)] text-[var(--pm-text)]'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-2xl ${vacationMode ? 'bg-[var(--pm-warning)] text-slate-950' : 'bg-[var(--pm-surface)] text-[var(--pm-muted)]'}`}>
              <CalendarOff className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-[var(--pm-text)] flex items-center gap-2">
                {isBn ? 'ছুটি / ভ্যাকেশন মোড' : 'Vacation / Holiday Pause Mode'}
                {vacationMode && (
                  <span className="text-[10px] bg-[var(--pm-warning)] text-slate-950 px-2 py-0.5 rounded-full font-black animate-pulse">
                    {isBn ? 'সক্রিয়' : 'ACTIVE'}
                  </span>
                )}
              </h4>
              <p className="text-xs text-[var(--pm-muted)] mt-0.5">
                {isBn
                  ? 'এটি চালু করলে দোকানে সাময়িক বন্ধের নোটিশ দেখাবে এবং নতুন অর্ডারের ডেলিভারি সময় সামঞ্জস্য হবে'
                  : 'Displays a friendly pause banner to buyers and delays order delivery countdown'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setVacationMode(!vacationMode)}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto ${
              vacationMode
                ? 'bg-[var(--pm-warning)] text-slate-950 hover:opacity-90 shadow-md'
                : 'bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)]'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{vacationMode ? (isBn ? 'ছুটি মোড বন্ধ করুন' : 'Turn Off Vacation') : (isBn ? 'ছুটি মোড চালু করুন' : 'Enable Vacation')}</span>
          </button>
        </div>

        {vacationMode && (
          <div className="mt-4 pt-4 border-t border-[var(--pm-warning)]/25 space-y-2">
            <label className="text-xs font-bold text-[var(--pm-text)] block">
              {isBn ? 'ক্রেতাদের জন্য নোটিশ বার্তা' : 'Public Customer Notice Message'}
            </label>
            <textarea
              rows={2}
              value={vacationNotice}
              onChange={(e) => setVacationNotice(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[var(--pm-warning)]/40 bg-[var(--pm-input)] text-xs text-[var(--pm-text)] focus:border-[var(--pm-warning)] focus:outline-hidden"
            />
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Weekly Timetable */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-[var(--pm-text)] uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--pm-accent)]" />
              {isBn ? 'সাপ্তাহিক কর্মঘণ্টা' : 'Weekly Operating Hours'}
            </h4>
            <span className="text-[10px] text-[var(--pm-muted)] font-bold">
              {isBn ? 'সময় ফরম্যাট: ২৪ ঘণ্টা' : '24-hour format'}
            </span>
          </div>

          <div className="divide-y divide-[var(--pm-border)]">
            {schedules.map((item, idx) => (
              <div key={item.day} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 w-40">
                  <button
                    type="button"
                    onClick={() => toggleDay(idx)}
                    className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                      item.isOpen ? 'bg-[var(--pm-success)]' : 'bg-[var(--pm-border)]'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.75 transition-transform ${
                        item.isOpen ? 'left-4.5' : 'left-1'
                      }`}
                    />
                  </button>
                  <span className={`text-xs font-bold ${item.isOpen ? 'text-[var(--pm-text)]' : 'text-[var(--pm-muted)] line-through'}`}>
                    {isBn ? item.bnDay : item.day}
                  </span>
                </div>

                {item.isOpen ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={item.openTime}
                      onChange={(e) => updateTime(idx, 'openTime', e.target.value)}
                      className="px-2.5 py-1.5 rounded-xl border border-[var(--pm-border)] bg-[var(--pm-input)] text-xs font-mono font-bold text-[var(--pm-text)] focus:border-[var(--pm-accent)] focus:outline-hidden"
                    />
                    <span className="text-xs text-[var(--pm-muted)] font-bold">{isBn ? 'থেকে' : 'to'}</span>
                    <input
                      type="time"
                      value={item.closeTime}
                      onChange={(e) => updateTime(idx, 'closeTime', e.target.value)}
                      className="px-2.5 py-1.5 rounded-xl border border-[var(--pm-border)] bg-[var(--pm-input)] text-xs font-mono font-bold text-[var(--pm-text)] focus:border-[var(--pm-accent)] focus:outline-hidden"
                    />
                  </div>
                ) : (
                  <span className="text-xs font-bold text-[var(--pm-danger)] bg-[var(--pm-danger-soft)] px-3 py-1 rounded-full self-start sm:self-auto">
                    {isBn ? 'সাপ্তাহিক বন্ধ' : 'Weekly Off-Day'}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Order Auto-Accept Settings */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-xs">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={autoAcceptOrders}
              onChange={(e) => setAutoAcceptOrders(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-[var(--pm-accent)] rounded-sm"
            />
            <div className="text-xs">
              <span className="font-bold text-[var(--pm-text)] block">
                {isBn ? 'অর্ডার স্বয়ংক্রিয়ভাবে কনফার্ম করুন (Auto-Accept)' : 'Automatically Accept Confirmed Orders'}
              </span>
              <span className="text-[11px] text-[var(--pm-muted)]">
                {isBn
                  ? 'খোলা সময়ের মধ্যে গ্রাহক অর্ডার করলে সরাসরি প্রিপারেশন কিউতে যোগ হবে'
                  : 'Orders placed during open hours will immediately move to processing queue without manual verification'}
              </span>
            </div>
          </label>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            {isBn ? 'সময়সূচী সংরক্ষণ করুন' : 'Save Timetable'}
          </button>
        </div>
      </form>
    </div>
  );
};
