import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import NavBarLanguage from "./NavBarLanguage";
import { motion } from "framer-motion";

const NavBarMobile = ({ logo, navigation, scrolled }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Barra superior */}
            <nav className={`w-full flex flex-row justify-between fixed top-0 left-0 z-100 py-5 px-10 ${scrolled ? 'bg-white' : 'bg-transparent'}`}>
                {/* Botón burger */}
                <motion.button
                    initial={{ opacity: 0, }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    viewport={{ once: true }}
                    type="button" 
                    className={`${scrolled ? 'text-black' : 'text-white'}`} 
                    onClick={() => setOpen(true)}
                >
                    <Bars3Icon className="h-8 w-8" aria-hidden="true" />
                </motion.button>

                {/* Logo */}
                <motion.img
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                viewport={{ once: true }}
                src={logo} alt="Logo" 
                className={`${scrolled ? 'invert' : ''} h-12 m-auto`}  />

                <div></div>
            </nav>

            {/* Menú Mobile */}
            {open && (
                <div className="fixed inset-0 flex z-50 lg:hidden">
                    <div className="relative w-full bg-white p-6 flex flex-col overflow-y-auto transform transition-transform duration-300">
                        {/* Botón para cerrar */}
                        <div className="flex justify-start mb-10 relative z-10">
                            <button
                                type="button"
                                className="rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500"
                                onClick={() => setOpen(false)}
                            >
                                <XMarkIcon className="h-8 w-8" aria-hidden="true" />
                            </button>
                        </div>

                        <div className="w-full h-full m-auto content-center">
                            {/* Logo */}
                            <img src={logo} alt="Logo" className="invert h-12 m-auto mb-20" />

                            {/* Links de navegación */}
                            <div className="space-y-12 text-center relative">
                                {navigation.sections.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className="block text-xl text-black"
                                        onClick={() => setOpen(false)}
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </div>

                            {/* Redes sociales + idioma */}
                            <div className="mt-20 flex justify-center space-x-8 pb-10">
                                {navigation.social.map((item) => (
                                    <a
                                        key={item.name}
                                        href={`https://${item.href}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-black hover:text-gray-600"
                                        onClick={() => setOpen(false)}
                                    >
                                        <FontAwesomeIcon icon={item.icon} size="lg" />
                                    </a>
                                ))}
                                <NavBarLanguage scrolled={scrolled} closeMenu={() => setOpen(false)} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default NavBarMobile;
