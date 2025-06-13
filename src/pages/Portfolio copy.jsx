import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";

const imageData = [
    { id: "1", src: `${process.env.PUBLIC_URL}/images/portfolio/image-02.jpg`, categories: ["marcas", "exteriores"], text: "CATdopciones", href: "https://www.instagram.com/catdopciones/", },
    { id: "2", src: `${process.env.PUBLIC_URL}/images/portfolio/image-02.jpg`, categories: ["familia"] },
    { id: "3", src: `${process.env.PUBLIC_URL}/images/portfolio/image-02.jpg`, categories: ["estudio", "marcas"] },
    { id: "4", src: `${process.env.PUBLIC_URL}/images/portfolio/image-02.jpg`, categories: ["exteriores"] },
    { id: "5", src: `${process.env.PUBLIC_URL}/images/portfolio/image-02.jpg`, categories: ["familia", "estudio"] },
];

const filters = ["marcas", "familia", "refugios", "exteriores", "estudio"];

const Portfolio = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [activeFilters, setActiveFilters] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    const toggleFilter = (filter) => {
        setActiveFilters((prev) =>
            prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
        );
    };

    const filteredImages =
        activeFilters.length === 0
            ? imageData
            : imageData.filter((img) =>
                activeFilters.some((f) => img.categories.includes(f))
            );

    return (
        <div className="px-6 md:px-10">
            <button
                onClick={() => navigate("/")}
                className="mt-12 text-2xl flex items-center gap-2 mb-6 hover:opacity-70 transition"
            >
                <FontAwesomeIcon icon={faChevronLeft} />
                Volver
            </button>

            {/* Filtros */}
            <div className="w-full flex justify-center gap-8 mb-8 flex-wrap">
                {filters.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => toggleFilter(filter)}
                        className={`transition capitalize underline ${
                            activeFilters.includes(filter) ? "font-semibold" : "font-normal"
                        }`}
                    >
                        {t(filter)}
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
                layout
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
            >
                <AnimatePresence>
                    {filteredImages.map((image) => (
                        <motion.div
                            layout
                            key={image.id}
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
                                <div className="absolute top-2 left-2 text-white text-xs px-2 py-1 rounded z-10">
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
