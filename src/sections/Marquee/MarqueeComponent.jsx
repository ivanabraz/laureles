import React from "react";
import 'swiper/css';
import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";

const MarqueeComponent = ({ t }) => {
    return (
        <div id="marquee" className="w-full py-20 bg-white overflow-hidden text-9xl xl:text-[9rem]">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                viewport={{ once: true }}
            >
                <Marquee speed={40} gradient={false}>
                    <span className="text-black px-12 leading-[1.25]">
                        {t('global.multispecies')}.
                    </span>
                    <span className="text-black px-12 leading-[1.25]">
                        {t('global.multispecies')}.
                    </span>
                </Marquee>
            </motion.div>
        </div>
    );
};

export default MarqueeComponent;
