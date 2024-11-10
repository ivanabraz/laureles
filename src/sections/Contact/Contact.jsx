import React from "react";
import { motion } from "framer-motion";

const Contact = ({ t }) => {
    return (
    <div id='contact' className="w-full bg-black py-16 text-center condensed uppercase text-white flex flex-col justify-center">
            {/* Título */}
            <motion.p
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="text-4xl mb-14"
                >
                    {t('global.contact')}
                </motion.p>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="w-[60%] grid grid-cols-1 md:grid-cols-3 m-auto"
            >
                <a href="mailto:cuerotango@gmail.com" rel="noopener noreferrer" target="_blank">cuerotango@gmail.com</a>
                <a href="mailto:emiliocossani@gmail.com" rel="noopener noreferrer" target="_blank">emiliocossani@gmail.com</a>
                <a href="https://www.instagram.com/cuero.tango" rel="noopener noreferrer" target="_blank">@cuero.tango</a>
            </motion.div>
        </div>
    );
};

export default Contact;
