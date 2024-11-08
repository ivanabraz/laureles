import React from "react";
import { useTranslation } from 'react-i18next';

const Footer = ({ onLanguageChange, currentLanguage }) => {
    const currentYear = new Date().getFullYear();
    const { t } = useTranslation(); 
    
    return (
        <footer 
            className="pt-8 pb-12 px-4 sm:px-6 w-full h-16 
            flex justify-between 
            uppercase condensed text-sm text-black bg-white"
        >
            <p>© {currentYear} Cuero Tango</p>
            <a href="mailto:cuerotango@gmail.com" rel="noopener noreferrer">
                {t('global.contact')}
            </a>
        </footer>
    )
}

export default Footer;