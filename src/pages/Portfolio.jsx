import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faTimes } from "@fortawesome/free-solid-svg-icons";

// Data
import shelters from "../data/shelter.json";
import brands from "../data/brands.json";
import family from "../data/family.json";
import pawlidays from "../data/specials.json";

const CATEGORY_FILTERS = ["family", "brands", "shelters", "specials"];
const STYLE_FILTERS = ["studio", "outdoor"];

const Portfolio = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeFilters, setActiveFilters] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    const imageData = [...shelters, ...brands, ...family, ...pawlidays];

    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const [shuffledData] = useState(() => shuffleArray(imageData));

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

    const toggleFilter = (filter) => {
        setActiveFilters((prev) =>
            prev.includes(filter)
                ? prev.filter((f) => f !== filter)
                : [...prev, filter]
        );
    };

    // ✅ Nueva lógica de filtrado más flexible
    const filteredImages = shuffledData.filter((img) => {
        const categoryFilters = activeFilters.filter(f => CATEGORY_FILTERS.includes(f));
        const styleFilters = activeFilters.filter(f => STYLE_FILTERS.includes(f));

        const matchesCategory = categoryFilters.length === 0
            || categoryFilters.some(f => img.filters.includes(f));

        const matchesStyle = styleFilters.length === 0
            || styleFilters.some(f => img.filters.includes(f));

        return matchesCategory && matchesStyle;
    });

    return (
        <div className="px-6 md:px-10">
            <button
                onClick={() => navigate("/")}
                className="mt-12 text-2xl flex items-center gap-2 mb-6 hover:opacity-70 transition"
            >
                <FontAwesomeIcon icon={faChevronLeft} />
                {t("global.back")}
            </button>

            {/* Filtros de categoría */}
            <div className="w-full flex flex-wrap justify-center gap-3 mb-3">
                {CATEGORY_FILTERS.map((filter) => {
                    const isActive = activeFilters.includes(filter);
                    return (
                        <button
                            key={filter}
                            onClick={() => toggleFilter(filter)}
                            className={`px-3 py-1 rounded-full border transition flex items-center gap-2 text-sm capitalize
                                ${isActive ? "border-black font-medium" : "border-transparent text-neutral-500 hover:border-neutral-400"}`}
                        >
                            {t(`global.${filter}`)}
                            {isActive && (
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFilter(filter);
                                    }}
                                    className="text-neutral-500 hover:text-black transition"
                                >
                                    <FontAwesomeIcon icon={faTimes} size="xs" />
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Filtros de estilo */}
            <div className="w-full flex flex-wrap justify-center gap-3 mb-8">
                {STYLE_FILTERS.map((filter) => {
                    const isActive = activeFilters.includes(filter);
                    return (
                        <button
                            key={filter}
                            onClick={() => toggleFilter(filter)}
                            className={`px-3 py-1 rounded-full border transition flex items-center gap-2 text-sm uppercase
                                ${isActive ? "border-black font-medium" : "border-transparent text-neutral-500 hover:border-neutral-400"}`}
                        >
                            {t(`global.${filter}`)}
                            {isActive && (
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFilter(filter);
                                    }}
                                    className="text-neutral-500 hover:text-black transition"
                                >
                                    <FontAwesomeIcon icon={faTimes} size="xs" />
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Galería */}
            <motion.div
                key={activeFilters.join(",")}
                layout
                className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            >
                <AnimatePresence>
                    {filteredImages.map((image) => (
                        <motion.div
                            layout
                            layoutId={image.id || image.src}
                            key={image.id || image.src}
                            className="relative w-full aspect-[2/3] rounded-[8px] overflow-hidden cursor-pointer"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setSelectedImage(image.src)}
                        >
                            <img
                                src={image.src}
                                alt=""
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

            {/* Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 z-50"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage(null);
                        }}
                        className="absolute top-6 right-6 text-white text-3xl p-2 hover:bg-opacity-80 transition"
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                    <div className="w-full h-full flex items-center justify-center">
                        <img
                            src={selectedImage}
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
