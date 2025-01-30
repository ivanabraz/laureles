import React from 'react';
import { motion } from "framer-motion";

const VideoPlayer = () => (
    <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            viewport={{ once: true }}
            className="relative w-full lg:w-[70%] xl:w-[60%] aspect-video m-auto mt-10"
        >
        <iframe
            className="absolute top-0 left-0 w-full h-full p-5 xs:p-5 lg:p-0"
            src="https://www.youtube.com/embed/L5TbO85cRNs?si=o0ssExx0Evkd5GzY"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
        ></iframe>
    </motion.div>
);

export default VideoPlayer;
