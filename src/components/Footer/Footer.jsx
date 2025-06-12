import React from "react";
import { useTranslation } from 'react-i18next';

const Footer = ({ onLanguageChange, currentLanguage }) => {
    const currentYear = new Date().getFullYear();
    const { t } = useTranslation(); 
    
    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer 
            className="w-full p-10 flex justify-between items-center text-xl text-black bg-white"
        >
            <p>© {currentYear} Laureles Audiovisual</p>

            <p
                onClick={handleScrollToTop}
                className="cursor-pointer underline hover:text-gray-600 transition-colors"
            >
                {t('global.backtotop')}
            </p>

            <a 
                href="https://api.whatsapp.com/send?phone=5491133752356&text=%20Hola,%20%c2%bfpuedes%20brindarme%20informaci%c3%b3n%20sobre%20las%20sesiones%20de%20fotograf%c3%ada%20en%20Laureles%20Audiovisual%3F%20%f0%9f%93%b8%f0%9f%90%be%20Estoy%20interesado/a%20en%20capturar%20momentos%20especiales.%20%c2%a1Gracias!"
                rel="noopener noreferrer"
                target="_blank"
                className="underline hover:text-green-600 transition-colors"
            >
                {t('global.contact')}
            </a>
        </footer>
    );
};

export default Footer;
