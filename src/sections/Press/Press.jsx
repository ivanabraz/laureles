    import React from "react";
    import { motion } from "framer-motion";
    import { Swiper, SwiperSlide } from "swiper/react";
    import 'swiper/css';

    const pressData = [
    {
        title: "OhMyDog! Magazine",
        image: `${process.env.PUBLIC_URL}/images/press/image-01.jpg`,
    },
    {
        title: "Sieger Guide",
        image: `${process.env.PUBLIC_URL}/images/press/image-02.jpg`,
    },
    {
        title: "PetNow",
        image: `${process.env.PUBLIC_URL}/images/press/image-03.jpg`,
    },
    ];

    const Press = ({ t }) => {
    return (
        <div id="press" className="w-full my-10 text-black">
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            viewport={{ once: true }}
        >
            <p className="font-medium text-xl mb-10 px-6 md:px-10">
                {t('global.press') || "Prensa"}
            </p>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            viewport={{ once: true }}
            className="px-6 md:px-10"
            slidesOffsetBefore={window.innerWidth >= 768 ? 40 : 24}
            slidesOffsetAfter={window.innerWidth >= 768 ? 40 : 24}
        >
            <Swiper
            spaceBetween={20}
            breakpoints={{
                0: {
                slidesPerView: 1.5,
                },
                768: {
                slidesPerView: 3,
                },
            }}
            >
            {pressData.map((item, index) => {

                return (
                <SwiperSlide key={index}>
                    <div className={`flex flex-col items-start`}>
                        <div
                            className="aspect-[8/9] w-full rounded-[40px] overflow-hidden bg-cover bg-center"
                            style={{ backgroundImage: `url(${item.image})` }}
                        />
                        <h3 className="text-xl mt-4 text-black">{item.title}</h3>
                        <button className="mt-1 text-sm underline text-neutral-400">
                            {t('global.readnote')}
                        </button>
                    </div>
                </SwiperSlide>
                );
            })}
            </Swiper>
        </motion.div>
        </div>
    );
    };

    export default Press;
