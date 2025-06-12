    import React, { useState, useEffect } from "react";

    const Loading = () => {
    // Animaciones con sus frames
    const animations = {
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
    };

    // Estado para elegir animación y frame actual
    const [animationKey, setAnimationKey] = useState(null);
    const [frameIndex, setFrameIndex] = useState(0);

    useEffect(() => {
        // Elegir aleatoriamente 'perrito' o 'gatito' solo una vez al montar
        const keys = Object.keys(animations);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        setAnimationKey(randomKey);
    }, []);

    useEffect(() => {
        if (!animationKey) return; // Esperar a que animationKey esté seteado

        // Cambiar frame cada 300 ms
        const interval = setInterval(() => {
        setFrameIndex((prev) =>
            prev === animations[animationKey].length - 1 ? 0 : prev + 1
        );
        }, 300);

        return () => clearInterval(interval);
    }, [animationKey, animations]);

    if (!animationKey) return null; // O algún loader básico mientras se elige animación

    return (
        <div className="w-full h-[100vh] flex justify-center items-center">
        <img
            src={animations[animationKey][frameIndex]}
            alt={`Animación ${animationKey}`}
            className="h-16"
        />
        </div>
    );
    };

    export default Loading;
