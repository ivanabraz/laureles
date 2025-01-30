import React from 'react';
import { motion } from "framer-motion";

const VideoPlayer = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full lg:w-[80%] xl:w-[80%] m-auto p-10">
        {[ 
            "https://www.youtube.com/embed/L5TbO85cRNs?si=o0ssExx0Evkd5GzY",
            "https://www.youtube.com/embed/XhyhOUQZ6ho?si=XynAWU3Jq8enpIg-"
        ].map((video, index) => (
            <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                viewport={{ once: true }}
                className="relative aspect-video w-full"
            >
                <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={video}
                    title={`YouTube video player ${index + 1}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </motion.div>
        ))}
    </div>
);

export default VideoPlayer;
