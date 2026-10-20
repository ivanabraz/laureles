import React from "react";
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';

const PortfolioSection = ({ t }) => {
const items = [
    {
        label: t("global.family"),
        href: '/portfolio?filters=family',
        image: `${process.env.PUBLIC_URL}/images/portfolio/image-01.jpg`,
    },
    {
        label: t("global.brands"),
        href: '/portfolio?filters=brands',
        image: `${process.env.PUBLIC_URL}/images/portfolio/image-02.jpg`,
    },
    {
        label: t("global.shelters"),
        href: '/portfolio?filters=shelters',
        image: `${process.env.PUBLIC_URL}/images/portfolio/image-03.jpg`,
    },
];

return (
    <div id="portfolio" className="w-full pb-14">
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
                    <Link key={index} to={item.href} className="group block">
                        <div className="relative aspect-square overflow-hidden">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 ease-out will-change-transform group-hover:scale-[1.04]"
                                style={{ backgroundImage: `url(${item.image})` }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="relative z-10 text-white text-2xl font-semibold">
                                    {item.label}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </motion.div>
    </div>
);
};

export default PortfolioSection;
