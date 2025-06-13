import React from "react";
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';

const PortfolioSection = ({ t }) => {
const items = [
    {
        label: t("global.family"),
        image: `${process.env.PUBLIC_URL}/images/portfolio/image-01.jpg`,
    },
    {
        label: t("global.brands"),
        image: `${process.env.PUBLIC_URL}/images/portfolio/image-02.jpg`,
    },
    {
        label: t("global.shelters"),
        image: `${process.env.PUBLIC_URL}/images/portfolio/image-03.jpg`,
    },
];

return (
    <div id="portfolio" className="w-full pb-14">
        <Link to="/portfolio">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                viewport={{ once: true }}
            >
                <p className="font-medium text-xl mb-10 px-6 md:px-10">
                {t("global.portfolio")}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3">
                {items.map((item, index) => (
                    <div
                    key={index}
                    className="relative aspect-square bg-cover bg-center overflow-hidden"
                    style={{ backgroundImage: `url(${item.image})` }}
                    >
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-all ease-in-out duration-300 flex items-center justify-center">
                            <span className="text-white text-2xl font-semibold">{item.label}</span>
                        </div>
                    </div>
                ))}
                </div>
            </motion.div>
        </Link>
    </div>
);
};

export default PortfolioSection;
