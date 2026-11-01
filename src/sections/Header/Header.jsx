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

function slideFrom(item) {
    if (typeof item === "string") {
        return { desktop: toSrc(item), mobile: "" };
    }
    return {
        desktop: toSrc(item?.src || item?.image || ""),
        mobile: toSrc(item?.mobile || ""),
    };
}

function heroSlides() {
    const raw = Array.isArray(heroData?.images) ? heroData.images : [];
    const list = raw.map(slideFrom).filter((slide) => slide.desktop);
    if (list.length) return list;
    return [{ desktop: `${process.env.PUBLIC_URL}/images/photos/image-01h.jpg`, mobile: "" }];
}

function slideSrc(slide, isMobile) {
    if (isMobile && slide.mobile) return slide.mobile;
    return slide.desktop;
}

const MOBILE_QUERY = "(max-width: 767px)";
const SLIDES = heroSlides();
const CHRISTMAS_SLIDES = [
    {
        desktop: `${process.env.PUBLIC_URL}/images/christmas/image-03h.jpg`,
        mobile: `${process.env.PUBLIC_URL}/images/christmas/image-03v.jpg`,
    },
];

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(() =>
        typeof window !== "undefined" ? window.matchMedia(MOBILE_QUERY).matches : false
    );

    useEffect(() => {
        const media = window.matchMedia(MOBILE_QUERY);
        const sync = () => setIsMobile(media.matches);
        sync();
        media.addEventListener("change", sync);
        return () => media.removeEventListener("change", sync);
    }, []);

    return isMobile;
}

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
    const isMobile = useIsMobile();
    const slides = christmas ? CHRISTMAS_SLIDES : SLIDES;
    const [swiper, setSwiper] = useState(null);
    const [active, setActive] = useState(0);
    const multiple = slides.length > 1;

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
                {slides.map((slide, index) => {
                    const src = slideSrc(slide, isMobile);
                    return (
                    <SwiperSlide key={`${slide.desktop}-${index}`}>
                        <img
                            src={src}
                            alt="Laureles"
                            draggable={false}
                            className="h-full w-full object-cover select-none"
                        />
                    </SwiperSlide>
                    );
                })}
            </Swiper>

            {multiple && (
                <div className="absolute bottom-7 left-0 right-0 z-10 flex items-center justify-center gap-2.5">
                    {slides.map((_, index) => {
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
