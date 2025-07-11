import React from "react";
import 'swiper/css';
import { motion } from "framer-motion";
import { Trans } from "react-i18next";

const Quote = () => {
    return (
        <div id="quote" className="w-full text-center py-24 text-black justify-center font-normal">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                viewport={{ once: true }}
                className="
                text-4xl lg:text-5xl
                w-[95%] md:w-[70%] lg:w-[60%] xl:w-[45%] m-auto"
            >
                <Trans
                    i18nKey="global.tagline"
                    components={{ u: <u /> }}
                />
            </motion.div>
        </div>
    );
};

export default Quote;
