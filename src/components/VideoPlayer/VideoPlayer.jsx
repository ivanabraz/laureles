import React, { useState } from "react";
import { motion } from "framer-motion";

const VideoPlayer = () => {
const [isVideoPlaying, setIsVideoPlaying] = useState(null);

const handlePlayClick = (index) => {
    setIsVideoPlaying(index);
};

const videos = [
    {
    id: "L5TbO85cRNs",
    thumbnail: `${process.env.PUBLIC_URL}/images/songsthumbnails/atr.jpg`, // Miniatura personalizada
    url: "https://www.youtube.com/embed/L5TbO85cRNs?autoplay=1"
    },
    {
    id: "XhyhOUQZ6ho",
    thumbnail: `${process.env.PUBLIC_URL}/images/songsthumbnails/prima-facie.jpg`, // Miniatura personalizada
    url: "https://www.youtube.com/embed/XhyhOUQZ6ho?autoplay=1"
    }
];

return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full lg:w-[80%] xl:w-[80%] m-auto p-10">
    {videos.map((video, index) => (
        <motion.div
        key={index}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        viewport={{ once: true }}
        className="relative aspect-video w-full"
        >
        {!isVideoPlaying && isVideoPlaying !== index ? (
            <div
            className="w-full h-full bg-cover bg-center cursor-pointer"
            style={{ backgroundImage: `url(${video.thumbnail})` }}
            onClick={() => handlePlayClick(index)}
            >
            <div className="w-full h-full flex justify-center items-center">
                <img
                src={`${process.env.PUBLIC_URL}/images/icons/youtube.svg`}
                alt="YouTube logo"
                className="w-16 h-16"
                />
            </div>
            </div>
        ) : (
            <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={video.url}
            title={`YouTube video player ${index + 1}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            ></iframe>
        )}
        </motion.div>
    ))}
    </div>
);
};

export default VideoPlayer;
