import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Header = ({ t }) => {
    const [heroImg, setHeroImg] = useState("");

    useEffect(() => {
        const updateHeroImg = () => {
            const isLandscape = window.innerWidth > window.innerHeight;
            setHeroImg(
                `${process.env.PUBLIC_URL}/images/photos/image-01${isLandscape ? "h" : "v"}.jpg`
            );
        };

        // Establece la imagen inicial
        updateHeroImg();

        // Escucha cambios en el tamaño de la ventana
        window.addEventListener("resize", updateHeroImg);

        // Limpia el evento al desmontar
        return () => window.removeEventListener("resize", updateHeroImg);
    }, []);

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
                    className={`w-full sm:w-4/5 m-auto mb-20 relative z-0`}
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
