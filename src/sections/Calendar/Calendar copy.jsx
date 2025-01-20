import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { ArrowUpRightIcon } from "@heroicons/react/24/solid";
import { useTranslation } from 'react-i18next';

const Calendar = ({ t }) => {
    const { i18n } = useTranslation();  // Accedemos a la configuración de idioma
    const [dates, setDates] = useState([]);
    const [groupedDatesLimited, setGroupedDatesLimited] = useState({});
    const [showAllDates, setShowAllDates] = useState(false);
    const [loading, setLoading] = useState(true);
    const currentDate = new Date();  // Fecha actual
    const currentYear = currentDate.getFullYear();  // Año actual
    const currentMonth = currentDate.getMonth();  // Mes actual (0-11)
    const currentDay = currentDate.getDate();  // Día actual

    // Mapa de meses en español a inglés (esto solo se usa para crear fechas al principio)
    const monthMap = {
        'Enero': 'january',
        'Febrero': 'february',
        'Marzo': 'march',
        'Abril': 'april',
        'Mayo': 'may',
        'Junio': 'june',
        'Julio': 'july',
        'Agosto': 'august',
        'Septiembre': 'september',
        'Octubre': 'october',
        'Noviembre': 'november',
        'Diciembre': 'december',
    };

    // Cargar datos desde Google Sheets
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    'https://script.google.com/macros/s/AKfycbyLKhfogIKzfD5rgdPeqtQZHMY6A3NRNL_dBI0aHolKp0ulRSmIaIdFwkCbHfA2pXkT-w/exec'
                );
                const data = await response.json();

                // Filtrar las fechas a mostrar en el sitio web
                const filteredDates = data.filter((date) => String(date['Show on website']).toUpperCase() === 'TRUE');

                // Agrupar fechas por Tour
                const groupedDates = filteredDates.reduce((acc, date) => {
                    const tour = date.Tour || 'Sin Tour';
                    if (!acc[tour]) acc[tour] = [];
                    acc[tour].push(date);
                    return acc;
                }, {});

                // Limitar a los primeros 10 eventos
                const limitedGroupedDates = Object.keys(groupedDates).reduce((acc, tour) => {
                    acc[tour] = groupedDates[tour].slice(0, 10);
                    return acc;
                }, {});

                setDates(filteredDates);
                setGroupedDatesLimited(limitedGroupedDates);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    // Función para mostrar todas las fechas al hacer clic en el botón
    const handleShowMore = () => {
        const groupedDatesAll = dates.reduce((acc, date) => {
            const tour = date.Tour || 'Sin Tour';
            if (!acc[tour]) acc[tour] = [];
            acc[tour].push(date);
            return acc;
        }, {});
        setGroupedDatesLimited(groupedDatesAll);
        setShowAllDates(true);
    };

    const handleShowLess = () => {
        const limitedGroupedDates = Object.keys(groupedDatesLimited).reduce((acc, tour) => {
            acc[tour] = groupedDatesLimited[tour].slice(0, 10);
            return acc;
        }, {});
        setGroupedDatesLimited(limitedGroupedDates);
        setShowAllDates(false);
    };

    if (loading) {
        return <p className='text-center m-auto p-24'>Cargando...</p>;
    }

    return (
        <div id="calendar" className="w-full bg-white my-16 text-left condensed uppercase text-black flex flex-col justify-center">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                viewport={{ once: true }}
                className="w-[100%] lg:w-[70%] xl:w-[60%] m-auto px-2 md:10"
            >
                {/* Título */}
                <p className="text-4xl mb-14 text-center">
                    {t('global.calendar')}
                </p>

                {Object.keys(groupedDatesLimited).map((tour, index) => (
                    <div key={index} className='mb-10'>
                        {/* Mostrar título solo si la propiedad tour no está vacía y el año es el actual */}
                        {tour !== 'Sin Tour' && groupedDatesLimited[tour].some(date => parseInt(date.Year) === currentYear) && (
                            <div className="mb-3 mt-10">
                                <p className="w-fit border border-black rounded-[50%] uppercase px-8">{tour}</p>
                            </div>
                        )}
                        <div className="space-y-2">
                            {groupedDatesLimited[tour].map((date, idx) => {
                                // Convertir el mes en español a inglés (para el manejo de la fecha)
                                const eventMonth = monthMap[date.Month]; // Aquí usamos el mes en español
                                const eventDate = new Date(`${eventMonth} ${date.Day}, ${date.Year}`);

                                const eventYear = eventDate.getFullYear();
                                const eventDay = eventDate.getDate();  // Día del evento

                                // Comparar el evento con la fecha actual (año, mes y día)
                                const isPastEvent = (eventYear < currentYear) || 
                                                    (eventYear === currentYear && eventDate < currentDate);

                                // Traducir el mes con i18next para mostrar las primeras tres letras del mes
                                const translatedMonth = t(`global.${eventMonth}`);  // Traducción del mes

                                // Verificamos si el botón de "Tickets" debe aparecer
                                const showTicketButton = 
                                    !isPastEvent && 
                                    eventYear === currentYear && 
                                    date.Tickets && 
                                    date.Tickets !== "#";

                                return (
                                    <div
                                        key={idx}
                                        className={`grid grid-cols-[1fr,1fr,1fr,7fr,7fr,2fr] md:grid-cols-[1fr,1fr,1fr,9fr,9fr,2fr] pb-1 border-b border-neutral-500 text-left text-xs md:text-base`}
                                    >
                                        <div className={`${isPastEvent ? 'text-neutral-400' : ''}`}>{date.Day}</div>
                                        <div className={`${isPastEvent ? 'text-neutral-400' : ''}`}>
                                            {translatedMonth.slice(0, 3).toUpperCase()}  {/* Muestra las 3 primeras letras traducidas */}
                                        </div>
                                        <div className={`${isPastEvent ? 'text-neutral-400' : ''}`}>{date.Year}</div>
                                        <div className={`${isPastEvent ? 'text-neutral-400' : ''}`}>{date.Venue}</div>
                                        <div className={`${isPastEvent ? 'text-neutral-400' : ''}`}>{date.Place}</div>
                                        <div className="text-right">
                                            {/* Si el evento es del año actual pero ya pasó, dejamos vacío */}
                                            {isPastEvent && eventYear === currentYear ? (
                                                <span className="text-neutral-400"></span>
                                            ) : (
                                                <span className="text-neutral-400">{date.Tour}</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* Botón para mostrar más fechas */}
                {!showAllDates && (
                    <div
                        onClick={handleShowMore}
                        className="w-fit mt-10 py-2 px-5 m-auto uppercase border border-black text-center"
                    >
                        {t('global.previous')}
                    </div>
                )}

                {/* Botón para mostrar menos fechas */}
                {showAllDates && (
                    <div
                        onClick={handleShowLess}
                        className="w-fit mt-10 py-2 px-5 m-auto uppercase border border-black text-center"
                    >
                        {t('global.seeless')}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Calendar;
