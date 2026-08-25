'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Globe } from 'lucide-react';
import { toast } from 'sonner';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const handleSelect = (lang: 'en' | 'bn') => {
    if (lang === language) return;
    setLanguage(lang);
    toast.success(lang === 'bn' ? 'ভাষা বাংলা নির্বাচন করা হয়েছে' : 'Language switched to English');
  };

  return (
    <div className="flex items-center justify-between p-4 bg-zinc-900/50 border border-white/5 rounded-2xl">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
          <Globe className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">
            {language === 'bn' ? 'ভাষা' : 'Language'}
          </h3>
          <p className="text-xs text-zinc-400">
            {language === 'bn' ? 'বাংলা / English' : 'English / বাংলা'}
          </p>
        </div>
      </div>

      <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-white/10">
        <button
          onClick={() => handleSelect('en')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            language === 'en'
              ? 'bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.3)]'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          English
        </button>
        <button
          onClick={() => handleSelect('bn')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            language === 'bn'
              ? 'bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.3)]'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          বাংলা
        </button>
      </div>
    </div>
  );
}
