import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import NavBarMobile from "./NavBarMobile";
import NavBarDesktop from "./NavBarDesktop";
import { faWhatsapp, faInstagram } from "@fortawesome/free-brands-svg-icons";

const NavBar = ({ onLanguageChange, currentLanguage }) => {
    const [scrolled, setScrolled] = useState(false);
    const { t } = useTranslation(); 
    
    const navigation = {
        sections: [
            { name: t('global.about'), href: 'about' },
            { name: t('global.packages'), href: 'packages' },
            { name: t('global.portfolio'), href: '/portfolio' },
            { name: t('global.press'), href: 'press' },
            { name: t('global.contact'), href: 'contact' },
        ],
        social: [
            { name: 'Instagram', icon: faInstagram, href: 'instagram.com/laurelesaudiovisual' },
            { name: 'Whatsapp', icon: faWhatsapp, href: 'api.whatsapp.com/send?phone=5491133752356&text=%20Hola,%20%c2%bfpuedes%20brindarme%20informaci%c3%b3n%20sobre%20las%20sesiones%20de%20fotograf%c3%ada%20en%20Laureles%20Audiovisual%3F%20%f0%9f%93%b8%f0%9f%90%be%20Estoy%20interesado/a%20en%20capturar%20momentos%20especiales.%20%c2%a1Gracias!&fbclid=PAZXh0bgNhZW0CMTEAAad6ZrVzURR5nBa3pjyZXMVmdZ0ZWhXG0Fq_s9bjzZKkjnb8cofqbX4WjCUNxg_aem_tM7HFUsxjO-Jt-EWBDDbVA' },
        ]
    };

    const handleScroll = () => {
        setScrolled(window.scrollY > 150);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {/* Versión Mobile */}
            <div className="absolute flex w-full justify-between h-16 lg:hidden mx-auto px-4 sm:px-6 items-center z-10">
                <NavBarMobile 
                    logo={`${process.env.PUBLIC_URL}/images/logo/logo.svg`}
                    navigation={navigation} 
                    scrolled={scrolled}
                    onLanguageChange={onLanguageChange} 
                    currentLanguage={currentLanguage}
                />
            </div>
            
            {/* Versión Desktop */}
            <NavBarDesktop 
                logo={`${process.env.PUBLIC_URL}/images/logo/logo.svg`}
                navigation={navigation} 
                scrolled={scrolled}
                onLanguageChange={onLanguageChange} 
                currentLanguage={currentLanguage}
            />
        </>
    );
};

export default NavBar;
