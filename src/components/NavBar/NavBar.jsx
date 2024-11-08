import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import NavBarMobile from "./NavBarMobile";
import NavBarDesktop from "./NavBarDesktop";
import { faSpotify, faInstagram } from "@fortawesome/free-brands-svg-icons";

const NavBar = ({ onLanguageChange, currentLanguage }) => {
    const [scrolled, setScrolled] = useState(false);
    const { t } = useTranslation(); 
    
    const navigation = {
        sections: [
            { name: t('global.about'), href: '#about' },
            { name: t('global.calendar'), href: '#calendar' },
            { name: t('global.songs'), href: '#songs' },
            { name: t('global.press'), href: '#press' },
            { name: t('global.contact'), href: '#contact' },
        ],
        social: [
            { name: 'Instagram', icon: faInstagram, href: 'instagram.com/cuero.tango' },
            { name: 'Spotify', icon: faSpotify, href: 'open.spotify.com/intl-es/artist/1v6RSn3Vu77AbHn73BQIIM?si=6HvGxICoQJ2OFGejclw5qw' },
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
