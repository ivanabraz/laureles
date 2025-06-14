import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import { useTranslation } from "react-i18next";

const Packages = () => {
const { t } = useTranslation();

const packagesData = useMemo(() => [
    {
    title: t("global.packages_description.session_chihuahua"),
    details: [
        t("global.packages_description.session_60min"),
        t("global.packages_description.session_5_photos"),
        t("global.packages_description.treats"),
        t("global.packages_description.location_studio"),
    ],
    image: `${process.env.PUBLIC_URL}/images/packages/image-04.jpg`,
    titleColor: "text-black",
    buttonColor: "text-neutral-400",
    textColor: "text-black",
    },
    {
    title: t("global.packages_description.session_galgo"),
    details: [
        t("global.packages_description.session_60min"),
        t("global.packages_description.session_10_photos"),
        t("global.packages_description.treats"),
        t("global.packages_description.location_studio"),
    ],
    image: `${process.env.PUBLIC_URL}/images/packages/image-05.jpg`,
    titleColor: "text-black",
    buttonColor: "text-neutral-400",
    textColor: "text-white",
    },
    {
    title: t("global.packages_description.session_akita"),
    details: [
        t("global.packages_description.session_60_90min"),
        t("global.packages_description.session_16_photos"),
        t("global.packages_description.treats"),
        t("global.packages_description.location_studio"),
    ],
    image: `${process.env.PUBLIC_URL}/images/packages/image-06.jpg`,
    titleColor: "text-black",
    buttonColor: "text-neutral-400",
    textColor: "text-white",
    },
    {
    title: t("global.packages_description.session_pug"),
    details: [
        t("global.packages_description.session_60_90min"),
        t("global.packages_description.session_5_photos"),
        t("global.packages_description.treats"),
        t("global.packages_description.location_outdoor_1"),
    ],
    image: `${process.env.PUBLIC_URL}/images/packages/image-01.jpg`,
    titleColor: "text-white",
    buttonColor: "text-white",
    textColor: "text-white",
    },
    {
    title: t("global.packages_description.session_mestizo"),
    details: [
        t("global.packages_description.session_60_90min"),
        t("global.packages_description.session_10_photos"),
        t("global.packages_description.treats"),
        t("global.packages_description.location_outdoor_2"),
    ],
    image: `${process.env.PUBLIC_URL}/images/packages/image-02.jpg`,
    titleColor: "text-white",
    buttonColor: "text-white",
    textColor: "text-white",
    },
    {
    title: t("global.packages_description.session_dogo"),
    details: [
        t("global.packages_description.session_60_90min"),
        t("global.packages_description.session_16_photos"),
        t("global.packages_description.treats"),
        t("global.packages_description.location_outdoor_2"),
    ],
    image: `${process.env.PUBLIC_URL}/images/packages/image-03.jpg`,
    titleColor: "text-white",
    buttonColor: "text-white",
    textColor: "text-white",
    },
    {
    title: t("global.packages_description.gift_card"),
    details: [],
    image: `${process.env.PUBLIC_URL}/images/packages/image-07.jpg`,
    titleColor: "text-white",
    buttonColor: "text-white",
    textColor: "text-white",
    },
], [t]);

return (
    <div id="packages" className="w-full text-black flex flex-col items-center">
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        viewport={{ once: true }}
        className="w-full"
    >
        <p className="font-medium text-xl mb-10 pl-6 md:pl-10">{t("global.packages")}</p>
    </motion.div>

    <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        viewport={{ once: true }}
        className="w-full px-6 md:px-10"
    >
        <Swiper
        spaceBetween={20}
        slidesPerView={1.5}
        breakpoints={{
            768: { slidesPerView: 2.5 },
            1024: { slidesPerView: 3.5 },
            1280: { slidesPerView: 4.5 },
        }}
        >
        {packagesData.map((pkg, index) => (
            <SwiperSlide key={index}>
            <a
                href="https://api.whatsapp.com/send?phone=5491133752356&text=Hola,%20¿puedes%20brindarme%20información%20sobre%20las%20sesiones%20de%20fotografía%20en%20Laureles%20Audiovisual?"
                rel="noopener noreferrer"
                target="_blank"
            >
                <div
                className="aspect-[10/16] tracking-tight rounded-[40px] overflow-hidden relative bg-cover bg-center flex flex-col justify-between p-6"
                style={{ backgroundImage: `url(${pkg.image})` }}
                >
                <div className="z-10">
                    <h3 className={`text-2xl md:text-3xl ${pkg.titleColor}`}>
                    {pkg.title.split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                        {line}
                        <br />
                        </React.Fragment>
                    ))}
                    </h3>
                    <button className={`mt-3 text-sm underline ${pkg.buttonColor}`}>
                    {t("global.requestinfo")}
                    </button>
                </div>
                <div className={`z-10 text-sm ${pkg.textColor}`}>
                    {pkg.details.map((item, i) => (
                    <p key={i}>{item}</p>
                    ))}
                </div>
                <div className="absolute inset-0 z-0" />
                </div>
            </a>
            </SwiperSlide>
        ))}
        </Swiper>
    </motion.div>
    </div>
);
};

export default Packages;
