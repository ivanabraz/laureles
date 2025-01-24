import React from 'react';

const VideoPlayer = () => (
    <div className="relative w-full lg:w-[70%] xl:w-[60%] aspect-video m-auto mt-10">
        <iframe
            className="absolute top-0 left-0 w-full h-full p-5 xs:p-5 lg:p-0"
            src="https://www.youtube.com/embed/W_C2p0gqdfs?si=QuWOHlBYhGleKx0B"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
        ></iframe>
    </div>
);

export default VideoPlayer;
