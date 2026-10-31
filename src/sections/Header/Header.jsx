import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import heroData from "../../data/hero.json";

function toSrc(path) {
    if (!path || typeof path !== "string") return "";
    if (/^https?:\/\//i.test(path)) return path;
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return `${process.env.PUBLIC_URL}${normalized}`;
}

function heroImages() {
    const raw = Array.isArray(heroData?.images) ? heroData.images : [];
    const list = raw
        .map((item) => (typeof item === "string" ? item : item?.src || item?.image || ""))
        .map(toSrc)
        .filter(Boolean);

    if (list.length) return list;
    return [`${process.env.PUBLIC_URL}/images/photos/image-01h.jpg`];
}

const IMAGES = heroImages();
const CHRISTMAS_HERO = `${process.env.PUBLIC_URL}/images/christmas/image-03h.jpg`;

function useChristmasMode() {
    const [on, setOn] = useState(() => document.documentElement.classList.contains("christmas"));

    useEffect(() => {
        const sync = () => setOn(document.documentElement.classList.contains("christmas"));
        sync();
        const observer = new MutationObserver(sync);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });
        return () => observer.disconnect();
    }, []);

    return on;
}

const Header = () => {
    const christmas = useChristmasMode();
    const images = christmas ? [CHRISTMAS_HERO] : IMAGES;
    const [swiper, setSwiper] = useState(null);
    const [active, setActive] = useState(0);
    const multiple = images.length > 1;

    useEffect(() => {
        setActive(0);
    }, [christmas]);

    return (
        <div
            className="relative w-full h-[calc(100vh-var(--announcement-offset,0px))] overflow-hidden"
            role="region"
            aria-label="Fotos de inicio"
            aria-roledescription="carrusel"
        >
            <Swiper
                key={christmas ? "christmas" : "default"}
                onSwiper={setSwiper}
                onSlideChange={(instance) => setActive(instance.realIndex)}
                slidesPerView={1}
                spaceBetween={0}
                loop={multiple}
                allowTouchMove={multiple}
                grabCursor={multiple}
                className="hero-swiper absolute inset-0 h-full w-full [&_.swiper-wrapper]:h-full [&_.swiper-slide]:!h-full"
            >
                {images.map((src, index) => (
                    <SwiperSlide key={`${src}-${index}`}>
                        <img
                            src={src}
                            alt="Laureles"
                            draggable={false}
                            className="h-full w-full object-cover select-none"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {multiple && (
                <div className="absolute bottom-7 left-0 right-0 z-10 flex items-center justify-center gap-2.5">
                    {images.map((_, index) => {
                        const isActive = index === active;
                        return (
                            <button
                                key={index}
                                type="button"
                                aria-label={`Imagen ${index + 1}`}
                                aria-current={isActive ? "true" : undefined}
                                onClick={() => swiper?.slideToLoop(index)}
                                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                                    isActive ? "bg-white/85" : "bg-neutral-400/50"
                                }`}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Header;
