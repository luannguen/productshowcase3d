import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';

const Footer: React.FC = () => {
    const { t } = useTranslation();
    return (
        <footer id="app-footer" className="text-center py-10 mt-10 border-t border-[var(--border-color)]">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                <div><h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--header-gradient-from)] to-[var(--header-gradient-to)]">{t('showcaseTitle')}</h3><p className="mt-2 text-sm text-[var(--text-secondary)]">{t('footerSlogan')}</p></div>
                <div><h4 className="font-semibold text-[var(--text-primary)]">{t('quickLinks')}</h4><ul className="mt-2 space-y-1 text-sm text-[var(--text-secondary)]"><li><a href="#" className="hover:text-[var(--primary-accent)]">{t('aboutUs')}</a></li><li><a href="#" className="hover:text-[var(--primary-accent)]">{t('contact')}</a></li><li><a href="#" className="hover:text-[var(--primary-accent)]">{t('faq')}</a></li></ul></div>
                <div><h4 className="font-semibold text-[var(--text-primary)]">{t('followUs')}</h4><p className="mt-2 text-sm text-[var(--text-secondary)]">{t('followUsDesc')}</p></div>
            </div>
             <p className="mt-8 text-xs text-[var(--text-secondary)]">{t('copyright', { year: new Date().getFullYear() })}</p>
        </footer>
    );
};

export default Footer;
