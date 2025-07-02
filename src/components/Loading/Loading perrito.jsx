    import React, { useState, useEffect } from "react";

    const Loading = () => {
    const images = [
        `${process.env.PUBLIC_URL}/images/loading/perrito-01.svg`,
        `${process.env.PUBLIC_URL}/images/loading/perrito-02.svg`,
    ];
    
    const [frameIndex, setFrameIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
        setFrameIndex((prev) => (prev === 0 ? 1 : 0));
        }, 300);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-[100vh] flex justify-center items-center">
            <img
                src={images[frameIndex]}
                alt="Animación perrito corriendo"
                className="h-16"
            />
        </div>
    );
    };

    export default Loading;
