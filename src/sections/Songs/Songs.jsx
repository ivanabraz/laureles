import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";

const Songs = ({ t }) => {
    const image = `${process.env.PUBLIC_URL}/images/songs/toro.png`;
    const [currentSong, setCurrentSong] = useState(null); // Almacena la canción actual
    const [isPlaying, setIsPlaying] = useState(false); // Controla el estado de reproducción
    const [audio, setAudio] = useState(null); // Referencia al audio actual
    const [isPaused, setIsPaused] = useState(false); // Controla si la animación está pausada

    const music = [
        { name: 'Toro', id: 'toro' },
        { name: 'Chino', id: 'chino' },
        { name: 'La Oriental', id: 'la-oriental' },
        { name: 'Paladar Negro', id: 'paladar-negro' },
    ];

    // Efecto para pausar el audio cuando se cambia de canción o se desmonta el componente
    useEffect(() => {
        return () => {
            if (audio) {
                audio.pause();
            }
        };
    }, [audio]);

    // Función para manejar la reproducción de canciones
    const handlePlayPause = (song) => {
        if (currentSong?.id === song.id && isPlaying) {
            // Si se está reproduciendo la canción actual, pausarla
            audio.pause();
            setIsPlaying(false);
            setIsPaused(true); // Pausar la animación
        } else {
            // Si es una canción nueva, reproducirla
            if (audio) {
                audio.pause(); // Pausar la canción anterior
            }
            const newAudio = new Audio(`${process.env.PUBLIC_URL}/images/songs/${song.id}.mp3`);
            newAudio.play();
            setAudio(newAudio);
            setCurrentSong(song);
            setIsPlaying(true);
            setIsPaused(false); // Reanudar la animación

            // Cuando termina la canción, resetear el estado
            newAudio.onended = () => {
                setIsPlaying(false);
            };
        }
    };

    return (
        <div className="w-full bg-black text-center py-16 condensed uppercase text-white">
            <p className="text-4xl pb-14">{t('global.songs')}</p>
            <div className="px-20 w-full grid grid-cols-4 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {music.map((song) => (
                    <div
                        key={song.id}
                        className="py-5 cursor-pointer"
                        onClick={() => handlePlayPause(song)}
                    >
                        <img
                            src={image}
                            alt={song.name}
                            className={`w-full h-auto transition-transform ${
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
                            size="md"
                            className={`mt-5 text-white transition-opacity ${
                                currentSong?.id === song.id ? 'opacity-100' : 'opacity-0'
                            }`}
                        />
                        <p className="text-lg text-white">{song.name}</p>
                        <p className="text-xs text-white">Cuero</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Songs;
