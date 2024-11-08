import React from "react";
import { motion } from "framer-motion";

const Header = ({ t }) => {
    const heroImg = `${process.env.PUBLIC_URL}/images/photos/image-01.jpg`;
    const logo = `${process.env.PUBLIC_URL}/images/logo/logo.svg`;

    return (
        <div className="relative flex items-center justify-center w-full h-screen overflow-hidden bg-no-repeat bg-cover bg-center">
            <img 
                src={heroImg} 
                alt={'Cuero'} 
                className="absolute top-0 left-0 w-full h-full object-cover -z-10" 
            />
            <div className="relative z-1 text-center px-10 mt-24">
                <motion.img
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    src={logo} 
                    alt="Cuerto Tango logo" 
                    className={`w-full mb-20 relative z-0`}
                    style={{ zIndex: 0 }}
                />
                <motion.p
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 2, ease: "easeInOut" }}
                    className='text-white text-2xl px-5 font-condensed uppercase relative z-0'
                    style={{ zIndex: 0 }}
                >
                    {t('global.tagline')}
                </motion.p>
            </div>
        </div>
    );
};

export default Header;
