import { useEffect, useMemo, useState } from "react";

const DESKTOP_COUNT = 36;
const MOBILE_COUNT = 14;
const MOBILE_QUERY = "(max-width: 767px)";

function makeFlakes(reduced, mobile) {
    const count = mobile ? MOBILE_COUNT : DESKTOP_COUNT;
    return Array.from({ length: count }, (_, id) => ({
        id,
        left: Math.random() * 100,
        delay: Math.random() * -18,
        duration: 10 + Math.random() * 14,
        size: mobile ? 8 + Math.random() * 8 : 14 + Math.random() * 16,
        opacity: 0.55 + Math.random() * 0.4,
        drift: `${-40 + Math.random() * 80}px`,
        spin: 8 + Math.random() * 10,
        reverse: Math.random() > 0.5,
        variant: Math.floor(Math.random() * 2),
        top: reduced ? `${Math.random() * 100}%` : undefined,
    }));
}

const Snowflake = ({ variant }) => (
    <svg viewBox="0 0 100 100" aria-hidden="true">
        <g
            fill="none"
            stroke="currentColor"
            strokeWidth={variant === 0 ? 4 : 3.2}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {[0, 60, 120, 180, 240, 300].map((angle) => (
                <g key={angle} transform={`rotate(${angle} 50 50)`}>
                    <path d="M50 50 V8" />
                    {variant === 0 ? (
                        <>
                            <path d="M50 22 L38 14 M50 22 L62 14" />
                            <path d="M50 36 L40 28 M50 36 L60 28" />
                        </>
                    ) : (
                        <>
                            <path d="M50 18 L40 18 M50 18 L60 18" />
                            <path d="M50 32 L38 26 M50 32 L62 26" />
                            <circle cx="50" cy="12" r="3" fill="currentColor" stroke="none" />
                        </>
                    )}
                </g>
            ))}
        </g>
    </svg>
);

const Snow = ({ active }) => {
    const reduced = useMemo(
        () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        []
    );
    const [mobile, setMobile] = useState(
        () => window.matchMedia(MOBILE_QUERY).matches
    );

    useEffect(() => {
        const media = window.matchMedia(MOBILE_QUERY);
        const onChange = () => setMobile(media.matches);
        media.addEventListener("change", onChange);
        return () => media.removeEventListener("change", onChange);
    }, []);

    const flakes = useMemo(
        () => (active ? makeFlakes(reduced, mobile) : []),
        [active, reduced, mobile]
    );

    if (!active) return null;

    return (
        <div className="christmas-snow" aria-hidden="true">
            {flakes.map((flake) => (
                <span
                    key={flake.id}
                    className={[reduced ? "is-still" : "", flake.reverse ? "is-reverse" : ""].filter(Boolean).join(" ") || undefined}
                    style={{
                        left: `${flake.left}%`,
                        width: flake.size,
                        height: flake.size,
                        opacity: flake.opacity,
                        animationDelay: `${flake.delay}s`,
                        animationDuration: `${flake.duration}s`,
                        "--drift": flake.drift,
                        "--spin": `${flake.spin}s`,
                        top: flake.top,
                    }}
                >
                    <Snowflake variant={flake.variant} />
                </span>
            ))}
        </div>
    );
};

export default Snow;
