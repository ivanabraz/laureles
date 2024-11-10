import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";

const Calendar = ({ t }) => {
const [dates, setDates] = useState([]);
const [groupedDatesLimited, setGroupedDatesLimited] = useState({});
const [showAllDates, setShowAllDates] = useState(false);
const [loading, setLoading] = useState(true);
const currentDate = new Date();

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
    return <p className='text-center m-auto'>Cargando...</p>;
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
        <div key={index}>
            {/* Mostrar título solo si la propiedad tour no está vacía */}
            {tour !== 'Sin Tour' && (
            <div className="mb-3 mt-10">
                <p className="w-fit border border-black rounded-[50%] uppercase px-8">{tour}</p>
            </div>
            )}
            <div className="space-y-2">
            {groupedDatesLimited[tour].map((date, idx) => {
                const eventDate = new Date(`${date.Month} ${date.Day}, ${date.Year}`);
                const isPastEvent = eventDate < currentDate;

                return (
                <div
                    key={idx}
                    className={`grid grid-cols-[1fr,1fr,1fr,7fr,7fr,2fr] md:grid-cols-[1fr,1fr,1fr,9fr,9fr,2fr] pb-1 border-b border-neutral-500 text-left text-xs md:text-base ${isPastEvent ? 'text-neutral-400' : ''}`}
                >
                    <div>{date.Day}</div>
                    <div>{date.Month.slice(0, 3).toUpperCase()}</div>
                    <div>{date.Year}</div>
                    <div>{date.Venue}</div>
                    <div>{date.Place}</div>
                    <div className='text-right'>
                    {date.Tickets ? (
                        <a href={date.Tickets} target="_blank" rel="noopener noreferrer" className="text-emerald-400 whitespace-nowrap">TICKETS 🡥</a>
                    ) : <span className="hidden">TICKETS 🡥</span>}
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
