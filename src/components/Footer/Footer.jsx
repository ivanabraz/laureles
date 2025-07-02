import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
faInstagram,
faWhatsapp,
faTiktok,
faPinterest,
} from "@fortawesome/free-brands-svg-icons";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Footer = ({ onLanguageChange, currentLanguage }) => {
const { t } = useTranslation();
const currentYear = new Date().getFullYear();

const [showButton, setShowButton] = useState(false);

const navigate = useNavigate();

const checkScrollBottom = () => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const bottomPosition = document.documentElement.scrollHeight;
    setShowButton(bottomPosition - scrollPosition < 100);
};

useEffect(() => {
    window.addEventListener("scroll", checkScrollBottom);
    checkScrollBottom();
    return () => window.removeEventListener("scroll", checkScrollBottom);
}, []);

const handleScrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

// Navega a home y luego hace scroll al ancla
const handleNavigateAnchor = (anchor) => {
    navigate("/");

    // Espera un poco y hace scroll al elemento
    setTimeout(() => {
    const element = document.getElementById(anchor);
    if (element) {
        element.scrollIntoView({ behavior: "smooth" });
    }
    }, 150); // 150ms funciona bien, ajustar si es necesario
};

const sections = [
    {
    title: t("global.sections"),
    items: [
        { label: t("global.about"), href: "/#about" },
        { label: t("global.portfolio"), href: "/portfolio" },
        { label: t("global.packages"), href: "/#packages" },
        { label: t("global.press"), href: "/#press" },
        { label: t("global.contact"), href: "/#contact" },
    ],
    },
    {
    title: t("global.language"),
    items: [
        {
        label: "ES",
        onClick: () => onLanguageChange("es"),
        active: currentLanguage === "es",
        },
        {
        label: "EN",
        onClick: () => onLanguageChange("en"),
        active: currentLanguage === "en",
        },
    ],
    },
    {
    title: t("global.followus"),
    items: [
        {
        icon: faInstagram,
        href: "https://instagram.com/laurelesaudiovisual",
        },
        {
        icon: faWhatsapp,
        href: "https://api.whatsapp.com/send?phone=5491133752356&text=Hola,%20puedes%20brindarme%20información%20sobre%20las%20sesiones%20de%20fotografía%20en%20Laureles%20Audiovisual?%20Gracias!",
        },
        {
        icon: faTiktok,
        href: "https://tiktok.com/@laureles.audiovisual",
        },
        {
        icon: faPinterest,
        href: "https://pinterest.com/laurelesaudiovisual",
        },
    ],
    },
];

return (
    <>
    <footer className="w-full bg-white text-black px-8 py-12 relative">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Logo + scroll */}
        <div className="flex flex-col gap-4">
            <img
            src={`${process.env.PUBLIC_URL}/images/logo/logo.svg`}
            alt="Logo"
            className="h-10 invert cursor-pointer"
            onClick={handleScrollToTop}
            />
        </div>

        {/* Enlaces y secciones */}
        <div className="grid grid-cols-2 gap-8">
            {sections.slice(0, 2).map((section, i) => (
            <div key={i}>
                <p className="mb-3 text-sm font-semibold opacity-70">
                {section.title}
                </p>
                <ul className="flex flex-col gap-2">
                {section.items.map((item, idx) =>
                    item.href ? (
                    <li key={idx}>
                        <a
                        href={item.href}
                        onClick={(e) => {
                            if (item.href.includes("#")) {
                            e.preventDefault();
                            const anchor = item.href.split("#")[1];
                            handleNavigateAnchor(anchor);
                            }
                        }}
                        className="text-sm hover:text-gray-700 transition-colors"
                        >
                        {item.label}
                        </a>
                    </li>
                    ) : (
                    <li key={idx}>
                        <button
                        onClick={item.onClick}
                        className={`text-sm uppercase ${
                            item.active ? "font-bold" : "opacity-60"
                        } hover:opacity-100 transition`}
                        >
                        {item.label}
                        </button>
                    </li>
                    )
                )}
                </ul>
            </div>
            ))}
        </div>

        {/* Redes sociales */}
        <div>
            <p className="mb-3 text-sm font-semibold opacity-70">
            {sections[2].title}
            </p>
            <div className="flex gap-4">
            {sections[2].items.map(({ icon, href }, idx) => (
                <a
                key={idx}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl text-black hover:text-gray-700 transition-colors"
                >
                <FontAwesomeIcon icon={icon} />
                </a>
            ))}
            </div>
        </div>
        </div>

        {/* Línea inferior */}
        <div className="mt-12 border-t border-gray-200 pt-4 text-center text-sm text-gray-700">
        © {currentYear} Laureles Audiovisual.{" "}
        {t("global.rights") || "Todos los derechos reservados."}
        </div>

        {/* Botón Volver arriba absoluto dentro del footer */}
        {showButton && (
        <button
            onClick={handleScrollToTop}
            aria-label="Volver arriba"
            className="absolute bottom-32 right-8 flex items-center justify-center w-12 h-12 rounded-full bg-black text-white hover:bg-gray-800 transition-shadow shadow-lg"
        >
            <FontAwesomeIcon icon={faChevronUp} />
        </button>
        )}
    </footer>
    </>
);
};

export default Footer;
