import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import Snow from "./Snow";

const STORAGE_ACTIVE = "laureles-christmas";
const DRAG_THRESHOLD = 6;

function readActive() {
    try {
        return localStorage.getItem(STORAGE_ACTIVE) === "1";
    } catch {
        return false;
    }
}

function clamp(position, width, height) {
    const maxX = Math.max(0, window.innerWidth - width);
    const maxY = Math.max(0, window.innerHeight - height);
    return {
        x: Math.min(Math.max(0, position.x), maxX),
        y: Math.min(Math.max(0, position.y), maxY),
    };
}

const NUDGE_MS = 1600;
const FIRST_NUDGE_MS = 3000;
const NUDGE_EVERY_MS = 30000;

const ChristmasButton = () => {
    const { t } = useTranslation();
    const buttonRef = useRef(null);
    const dragRef = useRef(null);
    const [active, setActive] = useState(readActive);
    const [position, setPosition] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [nudge, setNudge] = useState(false);

    useLayoutEffect(() => {
        document.documentElement.classList.toggle("christmas", active);
        return () => document.documentElement.classList.remove("christmas");
    }, [active]);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_ACTIVE, active ? "1" : "0");
        } catch {
            // The mode still toggles for this visit if storage is blocked.
        }
    }, [active]);

    useEffect(() => {
        const resetToCorner = () => setPosition(null);
        window.addEventListener("resize", resetToCorner);
        return () => window.removeEventListener("resize", resetToCorner);
    }, []);

    useEffect(() => {
        if (active) {
            setNudge(false);
            return undefined;
        }

        const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (motion.matches) return undefined;

        let hideTimer;
        let interval;

        const play = () => {
            if (dragRef.current) return;
            setNudge(true);
            clearTimeout(hideTimer);
            hideTimer = setTimeout(() => setNudge(false), NUDGE_MS);
        };

        const first = setTimeout(() => {
            play();
            interval = setInterval(play, NUDGE_EVERY_MS);
        }, FIRST_NUDGE_MS);

        return () => {
            clearTimeout(first);
            clearInterval(interval);
            clearTimeout(hideTimer);
        };
    }, [active]);

    const onPointerDown = (event) => {
        if (event.button !== 0 || dragRef.current) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const drag = {
            pointerId: event.pointerId,
            originX: event.clientX,
            originY: event.clientY,
            offsetX: event.clientX - rect.left,
            offsetY: event.clientY - rect.top,
            width: rect.width,
            height: rect.height,
            moved: false,
        };
        dragRef.current = drag;

        const samePointer = (moveEvent) =>
            moveEvent.pointerId == null || moveEvent.pointerId === drag.pointerId;

        const onMove = (moveEvent) => {
            if (!samePointer(moveEvent)) return;
            const dx = moveEvent.clientX - drag.originX;
            const dy = moveEvent.clientY - drag.originY;
            if (!drag.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
            drag.moved = true;
            setDragging(true);
            setPosition(
                clamp(
                    {
                        x: moveEvent.clientX - drag.offsetX,
                        y: moveEvent.clientY - drag.offsetY,
                    },
                    drag.width,
                    drag.height
                )
            );
        };

        const onUp = (upEvent) => {
            if (!samePointer(upEvent)) return;
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("pointerup", onUp);
            window.removeEventListener("mouseup", onUp);
            window.removeEventListener("pointercancel", onCancel);
            dragRef.current = null;
            setDragging(false);
            if (!drag.moved) {
                setActive((current) => !current);
            }
        };

        const onCancel = (cancelEvent) => {
            if (!samePointer(cancelEvent)) return;
            drag.moved = true;
            onUp(cancelEvent);
        };

        window.addEventListener("pointermove", onMove);
        window.addEventListener("mousemove", onMove);
        window.addEventListener("pointerup", onUp);
        window.addEventListener("mouseup", onUp);
        window.addEventListener("pointercancel", onCancel);
        try {
            event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
            // Window listeners still follow the pointer if capture is unavailable.
        }
    };

    return (
        <>
            <Snow active={active} />
            <button
                ref={buttonRef}
                type="button"
                aria-pressed={active}
                aria-label="Modo Navidad"
                onPointerDown={onPointerDown}
                onMouseDown={onPointerDown}
                className={`group fixed z-[45] w-[108px] touch-none select-none border-0 bg-transparent p-0 sm:w-[128px] ${
                    dragging ? "cursor-grabbing" : "cursor-grab"
                } ${position ? "" : "bottom-5 right-5"}`}
                style={position ? { left: position.x, top: position.y } : undefined}
            >
                {nudge && (
                    <span className="christmas-hint" aria-hidden="true">
                        <span>{t("global.christmas_hint", "presioname")}</span>
                        <span className="christmas-hint-chevrons">
                            <ChevronDownIcon aria-hidden="true" />
                            <ChevronDownIcon aria-hidden="true" />
                        </span>
                    </span>
                )}
                <span className={`block ${nudge ? "christmas-nudge" : ""}`}>
                    <img
                        src={`${process.env.PUBLIC_URL}/images/christmas/huesito.png?v=2`}
                        alt=""
                        draggable={false}
                        className={`pointer-events-none h-auto w-full select-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.18)] transition-transform duration-300 ease-out ${
                            dragging ? "" : "group-hover:scale-105"
                        }`}
                    />
                </span>
            </button>
        </>
    );
};

export default ChristmasButton;
