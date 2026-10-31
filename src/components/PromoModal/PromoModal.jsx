import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { XMarkIcon } from "@heroicons/react/24/outline";

const STORAGE_KEY = "laureles-promo-dismissed";
const DEFAULT_IMAGE = "/images/packages/image-07.jpg";
const SHOW_AFTER_MS = 5000;

function isEnabled(value) {
    const normalized = String(value ?? "").trim().toLowerCase();
    return ["true", "1", "yes", "si", "sí", "verdadero"].includes(normalized);
}

function safeHref(raw) {
    const url = String(raw ?? "").trim();
    if (!url) return "";
    if (/^(https?:|mailto:|tel:)/i.test(url)) return url;
    if (url.startsWith("/") || url.startsWith("#")) return url;
    if (/^[\w.-]+\.[a-z]{2,}([/:?#]|$)/i.test(url)) return `https://${url}`;
    return "";
}

function safeImage(raw) {
    const url = String(raw ?? "").trim();
    if (/^https?:\/\//i.test(url) || url.startsWith("/")) return url;
    return DEFAULT_IMAGE;
}

function withLineBreaks(raw) {
    return String(raw ?? "")
        .replace(/\\n/g, "\n")
        .replace(/\u21B5/g, "\n")
        .replace(/<br\s*\/?>/gi, "\n")
        .trim();
}

function defaultWhatsapp(language) {
    const english = String(language || "").toLowerCase().startsWith("en");
    const text = english
        ? "Hi! I'd like to book the Christmas session."
        : "Hola! Quiero aprovechar la sesión de Navidad.";
    return `https://api.whatsapp.com/send?phone=5491133752356&text=${encodeURIComponent(text)}`;
}

const PromoModal = () => {
    const { t, i18n } = useTranslation();
    const show = isEnabled(t("global.promo_show"));
    const text = withLineBreaks(t("global.promo_text", ""));
    const cta = String(t("global.promo_cta", "") || "").trim();
    const href = safeHref(t("global.promo_url", "")) || defaultWhatsapp(i18n.language);
    const image = safeImage(t("global.promo_image", DEFAULT_IMAGE));
    const closeLabel = t("global.promo_close", "Cerrar");
    const [dismissed, setDismissed] = useState(true);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        try {
            setDismissed(sessionStorage.getItem(STORAGE_KEY) === text);
        } catch {
            setDismissed(false);
        }
    }, [text]);

    useEffect(() => {
        if (!show || !text || dismissed) {
            setReady(false);
            return undefined;
        }

        const wait = Math.max(0, SHOW_AFTER_MS - performance.now());
        const timeoutId = window.setTimeout(() => setReady(true), wait);
        return () => window.clearTimeout(timeoutId);
    }, [show, text, dismissed]);

    const visible = show && Boolean(text) && !dismissed && ready;

    const close = useCallback(() => {
        try {
            sessionStorage.setItem(STORAGE_KEY, text);
        } catch {
            // The modal still closes for this visit if storage is blocked.
        }
        setDismissed(true);
    }, [text]);

    useEffect(() => {
        if (!visible) return undefined;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const onKeyDown = (event) => {
            if (event.key === "Escape") close();
        };

        window.addEventListener("keydown", onKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [visible, close]);

    if (!visible) return null;

    const external = /^(https?:|mailto:|tel:)/i.test(href);

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-5">
            <button
                type="button"
                aria-label={closeLabel}
                className="absolute inset-0 bg-black/55"
                onClick={close}
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="promo-modal-title"
                className="relative w-[min(22rem,88vw,calc(78vh*3/4))] overflow-hidden rounded-[1.4rem] bg-[#b42318] shadow-2xl"
            >
                <img
                    src={image}
                    alt=""
                    className="aspect-[3/4] w-full object-cover object-bottom"
                />

                <button
                    type="button"
                    onClick={close}
                    aria-label={closeLabel}
                    className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)] hover:opacity-70"
                >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent px-5 pb-6 pt-28">
                    <p
                        id="promo-modal-title"
                        className="whitespace-pre-line text-[1.65rem] font-semibold uppercase leading-[0.95] tracking-tight text-white"
                    >
                        {text}
                    </p>
                    {cta && href ? (
                        <a
                            href={href}
                            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-white hover:opacity-70"
                            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        >
                            {cta}
                            <span aria-hidden="true">→</span>
                        </a>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default PromoModal;
