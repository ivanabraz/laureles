import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { motion } from "framer-motion";
import 'swiper/css';
import 'swiper/css/pagination';

const images = [
    { base: 'image-01' },
    { base: 'image-02' },
    { base: 'image-03' },
    { base: 'image-04' }
];

const Header = ({ t }) => {
    const [orientation, setOrientation] = useState('h');

    useEffect(() => {
        const updateOrientation = () => {
            const isLandscape = window.innerWidth > window.innerHeight;
            setOrientation(isLandscape ? 'h' : 'v');
        };

        updateOrientation();
        window.addEventListener("resize", updateOrientation);
        return () => window.removeEventListener("resize", updateOrientation);
    }, []);

    return (
        <div className="relative w-screen h-screen overflow-hidden">
            {/* Swiper fondo */}
            <Swiper
                modules={[Autoplay, Pagination]}
                loop={true}
                autoplay={{ delay: 6000 }}
                pagination={{ clickable: true }}
                grabCursor={true}
                className="absolute inset-0 w-full h-full z-0"
            >
                {images.map((img, index) => (
                    <SwiperSlide key={index}>
                        <img
                            src={`${process.env.PUBLIC_URL}/images/photos/${img.base}${orientation}.jpg`}
                            alt={`Slide ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Texto principal centrado */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-10 text-center pointer-events-none">
                <motion.p
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 2, ease: "easeInOut" }}
                    className="text-white text-4xl lg:text-6xl px-5 mb-4"
                >
                    {t('global.tagline')}
                </motion.p>
            </div>
        </div>
    );
};

export default Header;
