import React from "react";
import { motion } from "framer-motion";

const About = ({ t }) => {
    const image = `${process.env.PUBLIC_URL}/images/photos/image-01.jpg`;
    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-2">
            <div className="w-5/6 md:w-3/4 m-auto py-16 text-base lg:text-lg condensed text-justify">
                <motion.p
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                >
                    {t('global.about-text')}
                </motion.p>
            </div>
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
