import React from 'react';
import { Appearance, Theme, Locale } from '../types';
import BaseModal from './BaseModal';
import { SunIcon, MoonIcon, ElectronicsIcon, FashionIcon, YouthfulIcon, LanguagesIcon } from './icons';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTheme: Theme;
  setActiveTheme: (theme: Theme) => void;
  appearance: Appearance;
  setAppearance: (appearance: Appearance) => void;
  reduceMotion: boolean;
  setReduceMotion: (reduce: boolean) => void;
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const AppearanceControl: React.FC<Pick<SettingsModalProps, 'appearance' | 'setAppearance'>> = ({ appearance, setAppearance }) => (
  <div className="flex gap-2 p-1 bg-[var(--background-tertiary)] rounded-[var(--border-radius)]">
    {(['light', 'dark', 'system'] as Appearance[]).map(app => (
      <button key={app} onClick={() => setAppearance(app)} className={`flex-1 py-1.5 px-3 text-sm font-semibold rounded-md capitalize transition-colors ${appearance === app ? 'bg-[var(--primary-accent)] text-[var(--badge-text-color)]' : 'hover:bg-[var(--border-color)]'}`}>
        {app}
      </button>
    ))}
  </div>
);

const ThemeControl: React.FC<Pick<SettingsModalProps, 'activeTheme' | 'setActiveTheme'>> = ({ activeTheme, setActiveTheme }) => (
    <div className="grid grid-cols-3 gap-3">
        {Object.values(Theme).map(theme => (
            <button key={theme} onClick={() => setActiveTheme(theme)} className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-colors ${activeTheme === theme ? 'border-[var(--primary-accent)]' : 'border-transparent bg-[var(--background-tertiary)] hover:border-[var(--text-tertiary)]'}`}>
                {theme === Theme.Electronics && <ElectronicsIcon />}
                {theme === Theme.Youthful && <YouthfulIcon />}
                {theme === Theme.Fashion && <FashionIcon />}
                <span className="text-xs font-semibold">{theme}</span>
            </button>
        ))}
    </div>
);

const LanguageControl: React.FC<Pick<SettingsModalProps, 'locale' | 'setLocale'>> = ({ locale, setLocale }) => (
    <div className="flex gap-2 p-1 bg-[var(--background-tertiary)] rounded-[var(--border-radius)]">
        <button onClick={() => setLocale('en')} className={`flex-1 py-1.5 px-3 text-sm font-semibold rounded-md transition-colors ${locale === 'en' ? 'bg-[var(--primary-accent)] text-[var(--badge-text-color)]' : 'hover:bg-[var(--border-color)]'}`}>
            English
        </button>
        <button onClick={() => setLocale('vi')} className={`flex-1 py-1.5 px-3 text-sm font-semibold rounded-md transition-colors ${locale === 'vi' ? 'bg-[var(--primary-accent)] text-[var(--badge-text-color)]' : 'hover:bg-[var(--border-color)]'}`}>
            Tiếng Việt
        </button>
    </div>
);

const Switch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void }> = ({ checked, onChange }) => (
    <button onClick={() => onChange(!checked)} role="switch" aria-checked={checked} className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)] focus:ring-offset-2 focus:ring-offset-[var(--background-secondary)] ${checked ? 'bg-[var(--primary-accent)]' : 'bg-[var(--background-tertiary)]'}`}>
        <span aria-hidden="true" className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
);


const SettingsModal: React.FC<SettingsModalProps> = (props) => {
  return (
    <BaseModal isOpen={props.isOpen} onClose={props.onClose} title="Settings">
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-tertiary)] mb-2">Appearance</h3>
          <AppearanceControl {...props} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-tertiary)] mb-2">Theme</h3>
          <ThemeControl {...props} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-tertiary)] mb-2">Language</h3>
          <LanguageControl {...props} />
        </div>
         <div>
          <h3 className="text-sm font-semibold text-[var(--text-tertiary)] mb-2">Accessibility</h3>
          <div className="flex items-center justify-between p-3 bg-[var(--background-secondary)] rounded-lg">
            <label htmlFor="reduce-motion" className="font-medium">Reduce Motion</label>
            <Switch checked={props.reduceMotion} onChange={props.setReduceMotion} />
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default SettingsModal;