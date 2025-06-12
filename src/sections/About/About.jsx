import React from "react";
import { motion } from "framer-motion";

const About = ({ t }) => {
    const image = `${process.env.PUBLIC_URL}/images/photos/image-02.jpg`;
    
    return (
        <div id='about' className="w-full grid grid-cols-1 md:grid-cols-2">
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="w-5/6 md:w-3/4 m-auto text-base text-justify">
                <p>{t('global.about-text')}</p>
            </motion.div>
            <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="aspect-square p-10 w-full h-full  overflow-hidden -z-10"
            >
                <img
                    src={image}
                    alt="Laureles"
                    className="w-full h-full object-cover"
                />
            </motion.div>

        </div>
    );
};

export default About;
