import React, { useState, useEffect } from "react";

const Header = ({ t }) => {
    const [heroImg, setHeroImg] = useState("");

    useEffect(() => {
        const updateHeroImg = () => {
            const isLandscape = window.innerWidth > window.innerHeight;
            setHeroImg(
                `${process.env.PUBLIC_URL}/images/photos/image-01${isLandscape ? "h" : "v"}.jpg`
            );
        };

        updateHeroImg();

        window.addEventListener("resize", updateHeroImg);

        return () => window.removeEventListener("resize", updateHeroImg);
    }, []);

    return (
        <div className="relative flex items-center justify-center w-full h-screen overflow-hidden bg-no-repeat bg-cover bg-center">
            <img 
                src={heroImg} 
                alt={'Laureles'} 
                className="absolute top-0 left-0 w-full h-full object-cover -z-10" 
            />
        </div>
    );
};

export default Header;
