import React from "react";
import { motion } from "framer-motion";

const Contact = ({ t }) => {
    return (
        <div id="contact" className="w-full text-center text-black flex flex-col justify-center py-10">
            <a href="https://api.whatsapp.com/send?phone=5491133752356&text=%20Hola,%20%c2%bfpuedes%20brindarme%20informaci%c3%b3n%20sobre%20las%20sesiones%20de%20fotograf%c3%ada%20en%20Laureles%20Audiovisual%3F%20%f0%9f%93%b8%f0%9f%90%be%20Estoy%20interesado/a%20en%20capturar%20momentos%20especiales.%20%c2%a1Gracias!" rel="noopener noreferrer" target="_blank">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="relative overflow-hidden group rounded-[40px] mx-6 md:mx-10 py-24 bg-neutral-100
                    text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl"
                >
                    <div className="absolute top-0 left-0 h-full w-0 bg-[#25D366] transition-all duration-500 ease-in-out group-hover:w-full z-0" />
                    <span className="relative z-2 underline tracking-normal group-hover:tracking-widest transition-all duration-300 ease-in-out group-hover:text-white">
                        {t("global.talk")}
                    </span>
                </motion.div>
            </a>
        </div>
    );
};

export default Contact;
