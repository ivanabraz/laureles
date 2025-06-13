import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";

// Data
import shelters from "../data/shelter.json";
import brands from "../data/brands.json";
import family from "../data/family.json";

const Portfolio = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [activeFilters, setActiveFilters] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    const imageData = [...shelters, ...brands, ...family];

    // Leer filtros de la URL
    useEffect(() => {
        const urlFilters = searchParams.get("filters");
        if (urlFilters) {
            setActiveFilters(urlFilters.split(","));
        }
    }, [searchParams, setSearchParams]);

    // Actualizar filtros en la URL
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

    // FILTRADO CON AND LÓGICO
    const filteredImages =
        activeFilters.length === 0
            ? imageData
            : imageData.filter((img) =>
                  activeFilters.every((f) => img.filters.includes(f))
              );

    const allFilters = [
        { key: "brands", label: t("global.brands") },
        { key: "family", label: t("global.family") },
        { key: "shelters", label: t("global.shelters") },
        { key: "outdoor", label: t("global.outdoor") },
        { key: "studio", label: t("global.studio") },
    ];

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
            <div className="w-full flex justify-center gap-8 mb-8 flex-wrap">
                {allFilters.map((filter) => (
                    <button
                        key={filter.key}
                        onClick={() => toggleFilter(filter.key)}
                        className={`transition capitalize underline ${
                            activeFilters.includes(filter.key)
                                ? "font-semibold"
                                : "font-normal"
                        }`}
                    >
                        {filter.label}
                    </button>
                ))}
                {activeFilters.length > 0 && (
                    <button
                        onClick={() => setActiveFilters([])}
                        className="transition capitalize underline text-neutral-400 font-normal flex items-center gap-2"
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                )}
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

                            {/* Etiqueta superior si hay texto */}
                            {image.text && (
                                <div className="absolute top-2 left-2 text-neutral-400 text-xs px-2 py-1 rounded z-10">
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
