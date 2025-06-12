import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

const NavBarLanguage = ({ closeMenu }) => {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const currentLanguageRaw = i18n.language;
    const currentLanguage = currentLanguageRaw.startsWith('es') ? 'es' : 'en';

    const languages = ['es', 'en'];
    const languageToShow = languages.find(lang => lang !== currentLanguage);

    const changeLanguage = (newLanguage) => {
        const newPath = location.pathname.replace(/^\/[a-z]{2}/, `/${newLanguage}`);
        i18n.changeLanguage(newLanguage);
        navigate(newPath);
        if (closeMenu) closeMenu();
    };

    return (
        <div className="flex items-center">
            {/* Botón idioma desktop */}
            <div
                className="hidden sm:flex cursor-pointer px-4 py-1 rounded-full border border-white text-white
                hover:bg-white hover:text-neutral-400 transition-colors duration-300"
                onClick={() => changeLanguage(languageToShow)}
                title={`Cambiar a ${languageToShow.toUpperCase()}`}
            >
                {languageToShow.toUpperCase()}
            </div>

            {/* Idiomas mobile */}
            <div className="space-x-8 flex lg:hidden text-black">
                {languages
                    .filter(lang => lang !== currentLanguage)
                    .map(lang => (
                        <span
                            key={lang}
                            onClick={() => changeLanguage(lang)}
                            className="hover:underline cursor-pointer"
                        >
                            {lang.toUpperCase()}
                        </span>
                    ))}
            </div>
        </div>
    );
};

export default NavBarLanguage;
