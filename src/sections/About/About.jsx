import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRightIcon } from "@heroicons/react/24/solid";

const About = ({ t, setIsOpen }) => {
    const image = `${process.env.PUBLIC_URL}/images/photos/image-02.jpg`;
    
    return (
        <div id='about' className="w-full grid grid-cols-1 md:grid-cols-2">
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="w-5/6 md:w-3/4 m-auto py-16 text-base lg:text-lg condensed text-justify">
                <p>{t('global.about-text')}</p>
                <button 
                    onClick={() => setIsOpen(true)}
                    className="text-base uppercase text-emerald-400 mt-10 flex items-center border-b border-emerald-400">
                    {t('global.rider')}  <ArrowUpRightIcon className="h-4 w-4 ml-1 relative top-[0.05em]" />
                </button>
            </motion.div>
            <motion.img
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeInOut" }}
                src={image} 
                alt={'Cuero'} 
                className="aspect-square p-10 w-full h-full object-cover -z-10" 
            />
        </div>
    );
};

export default About;
