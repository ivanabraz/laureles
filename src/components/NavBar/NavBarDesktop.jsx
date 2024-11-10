import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NavBarLanguage from './NavBarLanguage';
import NavBarLogo from "./NavBarLogo";
import { v4 as uuidv4 } from 'uuid';

const NavBarDesktop = ({ navigation }) => {
    const [scrolled, setScrolled] = useState(false);

    const handleScroll = () => {
        setScrolled(window.scrollY > 150);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed flex w-full h-16 hidden lg:grid grid-cols-9 px-28 z-40 justify-center items-center text-center uppercase font-condensed transition-all duration-300 ${scrolled ? 'bg-white fixed' : ''}`}>
            <div className="col-span-2 flex justify-start">
                <NavBarLogo/>
            </div>
            <div className="col-span-5 flex justify-center gap-8">
                {navigation.sections.map((page) => (
                    <div key={uuidv4()} className="self-center">
                        <Link 
                            to={page.href}
                            className={`transition-all duration-700 ease-in-out border-b border-transparent 
                                ${scrolled ? 'hover:border-black text-black' : 'hover:border-white text-white'}`}
                        >
                            {page.name}
                        </Link>
                    </div>
                ))}
            </div>
            <div className="col-span-2 flex justify-end items-center">
                <div className="flex gap-6">
                    {navigation.social.map((page) => (
                        <a 
                            key={uuidv4()}
                            href={"https://" + page.href}
                            className={`hover:text-gray-400 transition-colors ${scrolled ? 'text-black' : 'text-white'}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FontAwesomeIcon icon={page.icon} size="lg" />
                        </a>
                    ))}
                    <NavBarLanguage scrolled={scrolled} /> {/* Pasamos el estado scrolled */}
                </div>
            </div>
        </nav>
    );
};

export default NavBarDesktop;
