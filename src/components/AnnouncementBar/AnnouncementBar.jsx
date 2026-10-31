import React, { useLayoutEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Marquee from "react-fast-marquee";
import { XMarkIcon } from "@heroicons/react/24/outline";

const BAR_HEIGHT = "2.25rem";

const NAMED_COLORS = {
    black: "#000000",
    white: "#ffffff",
    red: "#b42318",
    green: "#1f6b4a",
    blue: "#1d4e89",
    yellow: "#f2c14e",
    orange: "#e07a3d",
    pink: "#d4749a",
    gray: "#5c5c5c",
    grey: "#5c5c5c",
    beige: "#f3ead7",
    gold: "#c4a35a",
    negro: "#000000",
    blanco: "#ffffff",
    rojo: "#b42318",
    verde: "#1f6b4a",
    azul: "#1d4e89",
    amarillo: "#f2c14e",
    naranja: "#e07a3d",
    rosa: "#d4749a",
    gris: "#5c5c5c",
    dorado: "#c4a35a",
    bordo: "#6e2432",
};

function isEnabled(value) {
    const normalized = String(value ?? "").trim().toLowerCase();
    return ["true", "1", "yes", "si", "sí", "verdadero"].includes(normalized);
}

function safeColor(raw, fallback) {
    const value = String(raw ?? "").trim().toLowerCase();
    if (!value) return fallback;
    if (NAMED_COLORS[value]) return NAMED_COLORS[value];

    const hex = value.startsWith("#") ? value : `#${value}`;
    if (/^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(hex)) {
        return hex;
    }

    if (/^(?:rgb|rgba|hsl|hsla)\(\s*[\d.%\s,/+-]+\s*\)$/i.test(value)) {
        return value;
    }

    return fallback;
}

function safeHref(raw) {
    const url = String(raw ?? "").trim();
    if (!url) return "";
    if (/^(https?:|mailto:|tel:)/i.test(url)) return url;
    if (url.startsWith("/") || url.startsWith("#")) return url;
    if (/^[\w.-]+\.[a-z]{2,}([/:?#]|$)/i.test(url)) return `https://${url}`;
    return "";
}

function parseMessage(text, fallbackUrl) {
    const source = String(text ?? "");
    const parts = [];
    const pattern = /<link>([\s\S]*?)<\/link>|\[([^\]]+)\]\(([^)]+)\)/gi;
    let lastIndex = 0;
    let match;

    while ((match = pattern.exec(source))) {
        if (match.index > lastIndex) {
            parts.push({ type: "text", value: source.slice(lastIndex, match.index) });
        }
        if (match[1] != null) {
            parts.push({ type: "link", value: match[1], href: safeHref(fallbackUrl) });
        } else {
            parts.push({ type: "link", value: match[2], href: safeHref(match[3]) });
        }
        lastIndex = pattern.lastIndex;
    }

    if (lastIndex < source.length) {
        parts.push({ type: "text", value: source.slice(lastIndex) });
    }

    return parts;
}

function Message({ parts }) {
    return parts.map((part, index) => {
        if (part.type === "text") {
            return (
                <span key={index} className="whitespace-pre">
                    {part.value}
                </span>
            );
        }

        if (!part.href) {
            return (
                <span key={index} className="underline underline-offset-2">
                    {part.value}
                </span>
            );
        }

        const external = /^(https?:|mailto:|tel:)/i.test(part.href);
        return (
            <a
                key={index}
                href={part.href}
                className="underline underline-offset-2 hover:opacity-70"
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
                {part.value}
            </a>
        );
    });
}

const AnnouncementBar = () => {
    const { t } = useTranslation();
    const show = isEnabled(t("global.announcement_show"));
    const text = String(t("global.announcement_text", "") || "").trim();
    const url = t("global.announcement_url", "");
    const closeLabel = t("global.announcement_close", "Cerrar");
    const backgroundColor = safeColor(t("global.announcement_bg", ""), "#000000");
    const color = safeColor(t("global.announcement_color", ""), "#ffffff");
    const parts = useMemo(() => parseMessage(text, url), [text, url]);
    const hasText = parts.some((part) => String(part.value || "").trim());
    const [dismissed, setDismissed] = useState(false);

    const visible = show && hasText && !dismissed;

    useLayoutEffect(() => {
        document.documentElement.style.setProperty(
            "--announcement-offset",
            visible ? BAR_HEIGHT : "0px"
        );
        return () => {
            document.documentElement.style.setProperty("--announcement-offset", "0px");
        };
    }, [visible]);

    if (!visible) return null;

    const close = () => {
        setDismissed(true);
    };

    return (
        <div
            className="fixed inset-x-0 top-0 z-[80] flex h-9 items-center text-[13px] tracking-wide"
            style={{ backgroundColor, color }}
            role="region"
            aria-label="Anuncio"
        >
            <div className="min-w-0 flex-1">
                <Marquee autoFill pauseOnHover speed={40} gradient={false}>
                    <span className="mx-4 inline-flex items-center">
                        <Message parts={parts} />
                        <span className="mx-4 opacity-60" aria-hidden="true">
                            ·
                        </span>
                    </span>
                </Marquee>
            </div>
            <button
                type="button"
                onClick={close}
                aria-label={closeLabel}
                className="flex h-full shrink-0 items-center border-l px-3 hover:opacity-70"
                style={{ borderColor: `color-mix(in srgb, ${color} 35%, transparent)` }}
            >
                <XMarkIcon className="h-4 w-4" aria-hidden="true" />
            </button>
        </div>
    );
};

export default AnnouncementBar;
