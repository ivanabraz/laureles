import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const NavBarLanguage = ({ scrolled, closeMenu }) => {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const currentLanguage = i18n.language;
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const languages = [
        { code: 'es', name: 'ES' },
        { code: 'en', name: 'EN' },
    ];

    // Idiomas disponibles excluyendo el actual
    const availableLanguages = languages.filter(lang => lang.code !== currentLanguage);

    // Función para cambiar el idioma y cerrar el menú
    const changeLanguage = (newLanguage) => {
        const newPath = location.pathname.replace(/^\/[a-z]{2}/, `/${newLanguage}`);
        i18n.changeLanguage(newLanguage);
        navigate(newPath);

        // Cerrar el menú móvil
        if (closeMenu) {
            closeMenu();
        }
        setIsOpen(false);
    };

    const toggleDropdown = () => setIsOpen(!isOpen);

    // Manejo de clics fuera del dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <div className="flex items-center">
            {/* Versión para desktop */}
            <div ref={dropdownRef} className="relative hidden sm:flex items-center cursor-pointer" onClick={toggleDropdown}>
                <span className={`mr-1 ${scrolled ? 'text-black' : 'text-white'}`}>{currentLanguage.toUpperCase()}</span>
                <FontAwesomeIcon
                    icon={faChevronDown}
                    size="lg"
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'} ${scrolled ? 'text-black' : 'text-white'}`}
                />
                {isOpen && (
                    <div className="absolute top-full mt-2 bg-white shadow-lg rounded w-16">
                        {availableLanguages.map((lang) => (
                            <div
                                key={lang.code}
                                onClick={() => changeLanguage(lang.code)}
                                className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                            >
                                {lang.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Versión para mobile */}
            <div className="space-x-8 flex lg:hidden text-black">
                {availableLanguages.map((lang) => (
                    <span
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className="hover:underline cursor-pointer"
                    >
                        {lang.name}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default NavBarLanguage;
