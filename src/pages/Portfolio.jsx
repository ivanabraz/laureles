    import React, { useState, useEffect, useMemo, useCallback } from "react";
    import { useTranslation } from "react-i18next";
    import { useNavigate, useSearchParams } from "react-router-dom";
    import { motion, AnimatePresence } from "framer-motion";
    import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
    import { faChevronLeft, faTimes, faChevronRight } from "@fortawesome/free-solid-svg-icons";

    // Data
    import shelters from "../data/shelter.json";
    import brands from "../data/brands.json";
    import family from "../data/family.json";
    import pawlidays from "../data/specials.json";

    const CATEGORY_FILTERS = ["family", "brands", "shelters", "specials"];
    const STYLE_FILTERS = ["studio", "outdoor"];

    const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
    };

    const getFilteredImages = (images, filters) => {
    const categoryFilters = filters.filter((f) => CATEGORY_FILTERS.includes(f));
    const styleFilters = filters.filter((f) => STYLE_FILTERS.includes(f));

    return images.filter((img) => {
        const matchesCategory =
        categoryFilters.length === 0 ||
        categoryFilters.some((f) => img.filters.includes(f));
        const matchesStyle =
        styleFilters.length === 0 ||
        styleFilters.some((f) => img.filters.includes(f));
        return matchesCategory && matchesStyle;
    });
    };

    const FilterButton = ({ filter, isActive, toggle, label }) => (
    <button
        onClick={() => toggle(filter)}
        className={`px-3 py-1 rounded-full border transition flex items-center gap-2 text-sm ${
        filter === filter.toUpperCase() ? "uppercase" : "capitalize"
        } ${
        isActive
            ? "border-black font-medium"
            : "border-transparent text-neutral-500 hover:border-neutral-400"
        }`}
    >
        {label}
        {isActive && (
        <span
            onClick={(e) => {
            e.stopPropagation();
            toggle(filter);
            }}
            className="text-neutral-500 hover:text-black transition"
        >
            <FontAwesomeIcon icon={faTimes} size="xs" />
        </span>
        )}
    </button>
    );


    const Portfolio = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeFilters, setActiveFilters] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null);

    const BrandPromoCard = () => (
        <motion.div
            layout
            className="
            col-span-2 sm:col-span-2 md:col-span-1
            aspect-[5/3] xs:aspect-[5/3] sm:aspect-[5/3] md:aspect-[2/3] lg:aspect-[2/3] xl:aspect-[2/3] 2xl:aspect-[2/3]
            rounded-[8px]
            overflow-hidden
            relative
            "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <img
            src={`${process.env.PUBLIC_URL}/images/portfolio/image-gray.jpg`}
            alt="Brand Promo"
            className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 z-10 p-4 flex items-top">
            <p className="text-lg md:text-lg lg:text-lg xl:text-xl text-black p-2 rounded">
                {t("global.brand_message")}{" "}
                <a
                href="https://api.whatsapp.com/send?phone=5491133752356&text=Hola%2C%20me%20gustar%C3%ADa%20saber%20m%C3%A1s%20sobre%20las%20sesiones%20para%20marcas%20en%20Laureles%20Audiovisual.%20%F0%9F%93%B8%20%F0%9F%90%BE"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline cursor-pointer"
                >
                {t("global.contact_invite")}
                </a>
            </p>
            </div>
        </motion.div>
        );



    const shuffledData = useMemo(() => {
        const imageData = [...shelters, ...brands, ...family, ...pawlidays];
        return shuffleArray(imageData);
    }, []);

    const filteredImages = useMemo(
        () => getFilteredImages(shuffledData, activeFilters),
        [shuffledData, activeFilters]
    );

    useEffect(() => {
        const urlFilters = searchParams.get("filters");
        if (urlFilters) {
        setActiveFilters(urlFilters.split(","));
        }
    }, [searchParams]);

    useEffect(() => {
        if (activeFilters.length > 0) {
        setSearchParams({ filters: activeFilters.join(",") });
        } else {
        setSearchParams({});
        }
    }, [activeFilters, setSearchParams]);

    const toggleFilter = useCallback((filter) => {
        setActiveFilters((prev) =>
        prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
        );
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
        if (selectedIndex === null) return;
        if (e.key === "ArrowRight" && selectedIndex < filteredImages.length - 1) {
            setSelectedIndex((prev) => prev + 1);
        } else if (e.key === "ArrowLeft" && selectedIndex > 0) {
            setSelectedIndex((prev) => prev - 1);
        } else if (e.key === "Escape") {
            setSelectedIndex(null);
        }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedIndex, filteredImages.length]);

    return (
        <div className="px-6 md:px-10">
        <button
            onClick={() => navigate("/")}
            className="mt-12 text-2xl flex items-center gap-2 mb-6 hover:opacity-70 transition"
        >
            <FontAwesomeIcon icon={faChevronLeft} />
            {t("global.back")}
        </button>

        {/* Filtros */}
        <div className="w-full flex flex-wrap justify-center gap-3 mb-3">
            {CATEGORY_FILTERS.map((filter) => (
            <FilterButton
                key={filter}
                filter={filter}
                isActive={activeFilters.includes(filter)}
                toggle={toggleFilter}
                label={t(`global.${filter}`)}
            />
            ))}
        </div>

        <div className="w-full flex flex-wrap justify-center gap-3 mb-8">
            {STYLE_FILTERS.map((filter) => (
            <FilterButton
                key={filter}
                filter={filter}
                isActive={activeFilters.includes(filter)}
                toggle={toggleFilter}
                label={t(`global.${filter}`)}
            />
            ))}
        </div>

        {/* Galería */}
        <motion.div
            key={activeFilters.join(",")}
            layout
            className="relative grid grid-cols-2 xs:sm:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4"
        >
            {activeFilters.includes("brands") && <BrandPromoCard />}

            <AnimatePresence>
            {filteredImages.map((image, index) => (
                <motion.div
                layout
                layoutId={image.id || image.src}
                key={image.id || image.src}
                className="relative w-full aspect-[2/3] rounded-[8px] overflow-hidden cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedIndex(index)}
                >
                <img
                    src={image.src}
                    alt={image.text || ""}
                    className="w-full h-full object-cover"
                />
                {image.text && (
                    <div className="absolute top-2 left-2 bg-white/80 rounded-full text-neutral-900 text-xs px-2 py-1 z-10">
                    {image.href ? (
                        <a
                        href={image.href}
                        onClick={(e) => e.stopPropagation()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-80 transition"
                        >
                        {image.text}
                        </a>
                    ) : (
                        image.text
                    )}
                    </div>
                )}
                </motion.div>
            ))}
            </AnimatePresence>

            {filteredImages.length === 0 && (
            <div className="col-span-full h-[75vh] content-center text-center text-neutral-500 py-20 text-xl">
                {t("global.no_results") ||
                "Oops! No hay resultados para los filtros seleccionados."}
            </div>
            )}
        </motion.div>

        {/* Modal con navegación */}
        {selectedIndex !== null && (
            <div
            className="fixed inset-0 bg-black bg-opacity-75 z-50"
            onClick={() => setSelectedIndex(null)}
            >
            <button
                onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex(null);
                }}
                aria-label="Cerrar"
                className="absolute top-6 right-6 text-white text-3xl p-2 hover:bg-opacity-80 transition"
            >
                <FontAwesomeIcon icon={faTimes} />
            </button>

            {selectedIndex > 0 && (
                <button
                onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex((prev) => prev - 1);
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-white text-xl p-2 z-50 hover:opacity-70"
                >
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>
            )}

            {selectedIndex < filteredImages.length - 1 && (
                <button
                onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex((prev) => prev + 1);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-xl p-2 z-50 hover:opacity-70"
                >
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
            )}

            <div className="w-full h-full flex items-center justify-center">
                <img
                src={filteredImages[selectedIndex]?.src}
                alt="Ampliada"
                className="max-w-[80%] max-h-[80vh] rounded-lg"
                />
            </div>
            </div>
        )}
        </div>
    );
    };

    export default Portfolio;
