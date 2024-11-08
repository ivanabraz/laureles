import React from "react";

const About = ({ t }) => {
    const image = `${process.env.PUBLIC_URL}/images/photos/image-01.jpg`;
    return (
        <div className="w-full grid grid-cols-2 xs:grid-cols-1 md:grid-cols-2">
            <div className="w-2/4 xs:w-3/4 sm:w-3/4 md:w-3/4 m-auto py-16 text-base lg:text-lg condensed text-justify">
                {t('global.about-text')}
            </div>
            <img 
                src={image} 
                alt={'Cuero'} 
                className="aspect-square p-10 w-full h-full object-cover -z-10" 
            />
        </div>
    );
};

export default About;
