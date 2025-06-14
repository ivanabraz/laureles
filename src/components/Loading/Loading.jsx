import React, { useState, useEffect, useMemo } from "react";

const Loading = () => {
    const animations = useMemo(() => ({
        perrito: [
        `${process.env.PUBLIC_URL}/images/loading/perrito-01.svg`,
        `${process.env.PUBLIC_URL}/images/loading/perrito-02.svg`,
        ],
        gatito: [
        `${process.env.PUBLIC_URL}/images/loading/gatito-01.svg`,
        `${process.env.PUBLIC_URL}/images/loading/gatito-02.svg`,
        ],
        salchicha: [
        `${process.env.PUBLIC_URL}/images/loading/salchicha-01.svg`,
        `${process.env.PUBLIC_URL}/images/loading/salchicha-02.svg`,
        ],
    }), []);

    const [animationKey, setAnimationKey] = useState(null);
    const [frameIndex, setFrameIndex] = useState(0);

    useEffect(() => {
        const keys = Object.keys(animations);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        setAnimationKey(randomKey);
    }, [animations]);

    useEffect(() => {
        if (!animationKey) return;

        const interval = setInterval(() => {
        setFrameIndex((prev) =>
            prev === animations[animationKey].length - 1 ? 0 : prev + 1
        );
        }, 300);

        return () => clearInterval(interval);
    }, [animationKey, animations]);

    if (!animationKey) return null;

    return (
        <div className="w-full h-[100vh] flex justify-center items-center">
        <img
            src={animations[animationKey][frameIndex]}
            alt={`Animación ${animationKey}`}
            className="h-10"
        />
        </div>
    );
};

export default Loading;
