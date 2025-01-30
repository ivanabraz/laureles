import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useMediaQuery } from 'react-responsive';
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from 'uuid';

const Songs = ({ t }) => {
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio, setAudio] = useState(null);
    const [isPaused, setIsPaused] = useState(false);

    const isSmallScreen = useMediaQuery({ maxWidth: 1024 });

    const music = [
        { name: 'Prima Facie', id: 'prima-facie' },
        { name: 'ATR 13 1', id: 'atr' },
        { name: 'Toro', id: 'toro' },
        { name: 'Chino', id: 'chino' },
        { name: 'La Oriental', id: 'la-oriental' },
        { name: 'Paladar Negro', id: 'paladar-negro' },
        { name: 'Toro', id: 'toro' },
        { name: 'Chino', id: 'chino' },
        { name: 'La Oriental', id: 'la-oriental' },
        { name: 'Paladar Negro', id: 'paladar-negro' },
    ];

    useEffect(() => {
        return () => {
            if (audio) {
                audio.pause();
            }
        };
    }, [audio]);

    const handlePlayPause = (song) => {
        if (currentSong?.id === song.id && isPlaying) {
            audio.pause();
            setIsPlaying(false);
            setIsPaused(true);
        } else {
            if (audio) {
                audio.pause();
            }
            const newAudio = new Audio(`${process.env.PUBLIC_URL}/images/songs/${song.id}.mp3`);
            newAudio.play();
            setAudio(newAudio);
            setCurrentSong(song);
            setIsPlaying(true);
            setIsPaused(false);

            newAudio.onended = () => {
                setIsPlaying(false);
            };
        }
    };

    return (
        <div id="songs" className="w-full bg-black text-center py-16 condensed uppercase text-white">
            <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            viewport={{ once: true }}
            className="text-4xl pb-14">
                {t('global.songs')}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 3, ease: "easeInOut" }}
            viewport={{ once: true }}
            className="w-full"
            >
                <Swiper
                    loop={true} 
                    centeredSlides={isSmallScreen}
                    spaceBetween={20}
                    grabCursor={true}
                    breakpoints={{
                        320: { slidesPerView: 1.5 },
                        768: { slidesPerView: 2.5 },
                        1024: { slidesPerView: 3.5 },
                    }}
                    className="overflow-visible w-full"
                >
                    {music.map((song) => (
                        <SwiperSlide 
                            key={uuidv4()}
                            className="flex flex-col items-center" 
                            onClick={() => handlePlayPause(song)}
                        >
                            <img
                                src={`${process.env.PUBLIC_URL}/images/songs/${song.id}.png`}
                                alt={song.name}
                                className={`w-full h-auto lg:px-10 cursor-pointer transition-transform ${
                                    currentSong?.id === song.id
                                        ? isPlaying
                                            ? 'animate-spin-slow'
                                            : 'animate-spin-slow paused'
                                        : ''
                                }`}
                                style={{
                                    animationPlayState:
                                        currentSong?.id === song.id && isPaused ? 'paused' : 'running',
                                }}
                            />
                            <FontAwesomeIcon
                                icon={currentSong?.id === song.id && isPlaying ? faPause : faPlay}
                                size="lg"
                                className={`mt-5 text-white transition-opacity cursor-pointer ${
                                    currentSong?.id === song.id ? 'opacity-100' : 'opacity-0'
                                }`}
                            />
                            <p className="text-lg text-white cursor-pointer" onClick={() => handlePlayPause(song)}>{song.name}</p>
                            <p className="text-xs text-white" onClick={() => handlePlayPause(song)}>Cuero</p>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </motion.div>
        </div>
    );
};

export default Songs;
