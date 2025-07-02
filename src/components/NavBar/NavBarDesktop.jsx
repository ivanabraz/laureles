import React from "react";
import { v4 as uuidv4 } from 'uuid';
import { motion } from "framer-motion";
import NavBarLanguage from "./NavBarLanguage";

const NavBarDesktop = ({ navigation, scrolled }) => {
    return (
        <nav className={`absolute w-full hidden lg:flex lg:flex-col z-40 justify-center items-center text-center 
            transition-all duration-300 bg-gradient-to-b from-black/50 to-transparent py-6`}>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                viewport={{ once: true }}
                className=""
            >
                <p className="text-white tracking-normal hover:tracking-widest transition-all duration-300 ease-in-out 
                text-[clamp(3rem,12vw,15rem)] leading-none">
                    laureles
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                viewport={{ once: true }}
                className="flex justify-center gap-16 mt-5 uppercase font-semibold text-white"
            >
                {navigation.sections.map((page) => (
                    <div key={uuidv4()} className="self-center">
                        <a 
                            href={page.href}
                            className="transition-all duration-700 ease-in-out border-b border-transparent hover:border-white text-white"
                        >
                            {page.name}
                        </a>
                    </div>
                ))}
                <NavBarLanguage scrolled={scrolled} />
            </motion.div>
        </nav>
    );
};

export default NavBarDesktop;
