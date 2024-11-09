import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";

const Calendar = ({ t }) => {
    const [dates, setDates] = useState([]);

    // URL de tu Google Apps Script
    const DATA_URL = 'https://script.google.com/macros/s/AKfycbxDm9vDT8RC77opDZ4VFD5akxNuU_0cWOgcyzR90DLaFhIk7mF-49loYJ4dR8LGzbDiuA/exec'; // Reemplaza con tu URL

    // Fetch de datos del Google Sheets
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(DATA_URL);
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data = await res.json();
                setDates(data); // Guardar datos en el estado
            } catch (error) {
                console.error("Error al obtener los datos:", error);
            }
        };
        fetchData();
    }, []);

    // Obtener la fecha actual
    const currentDate = new Date();

    // Función para agregar un 0 delante de números de un solo dígito
    const formatNumber = (num) => {
        return num < 10 ? `0${num}` : num;
    };

    // Agrupar las fechas por el valor en la columna "Tour"
    const groupedDates = dates.reduce((acc, date) => {
        if (date.Tour) {
            if (!acc[date.Tour]) {
                acc[date.Tour] = [];
            }
            acc[date.Tour].push(date);
        }
        return acc;
    }, {});

    // Filtrar las fechas que no tienen Tour
    const datesWithoutTour = dates.filter(date => !date.Tour);

    return (
        <div className="w-full bg-white my-16 text-center condensed uppercase text-black flex justify-center">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                viewport={{ once: true }}
                className="w-[100%] lg:w-[70%] xl:w-[60%] m-auto px-2 md:10"
            >
                {/* Título */}
                <p className="text-4xl mb-14">
                    {t('global.calendar')}
                </p>

                {/* Fechas sin Tour */}
                <div className="space-y-2 mb-10">
                    {datesWithoutTour.length > 0 ? (
                        datesWithoutTour.map((date, index) => {
                            // Crear una nueva fecha a partir de la fecha del calendario
                            const eventDate = new Date(`${date.Month} ${date.Day}, ${date.Year}`);
                            const isPastEvent = eventDate < currentDate;

                            // Formatear Día y Mes
                            const formattedDay = formatNumber(date.Day);
                            const formattedMonth = formatNumber(date.Month);

                            return (
                                <div
                                    key={index}
                                    className={`grid grid-cols-[1fr,1fr,1fr,7fr,7fr,2fr] md:grid-cols-[1fr,1fr,1fr,10fr,10fr,2fr] gap-2 pb-1 border-b border-neutral-500 text-left text-xs md:text-base ${isPastEvent ? 'text-neutral-400' : ''}`}
                                >
                                    {/* Día (con 0 delante si es menor que 10) */}
                                    <div>{formattedDay}</div>
                                    {/* Mes (con 0 delante si es menor que 10) */}
                                    <div>{formattedMonth.slice(0, 3).toUpperCase()}</div>
                                    {/* Año */}
                                    <div>{date.Year}</div>
                                    {/* Nombre del lugar */}
                                    <div>{date.Venue}</div>
                                    {/* Ciudad, País */}
                                    <div>{date.Place}</div>
                                    {/* Tickets */}
                                    <div className='text-right'>
                                        {date.Tickets ? (
                                            <a
                                                href={date.Tickets}
                                                className="text-emerald-400 whitespace-nowrap"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                TICKETS 🡥
                                            </a>
                                        ) : (
                                            <span className="text-neutral-400"></span>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-neutral-400">No hay fechas disponibles</p>
                    )}
                </div>

                {/* Iterar sobre los grupos de "Tour" */}
                {Object.keys(groupedDates).map((tour, index) => (
                    <div key={index}>
                        {/* Título del Tour */}
                        <div className="mb-3">
                            <p className="w-fit h-auto border border-black rounded-[50%] uppercase px-8 text-base xs:text-xs sm:text-sm md:text-base">{tour}</p>
                        </div>

                        {/* Listado de fechas para este Tour */}
                        <div className="space-y-2">
                            {groupedDates[tour].map((date, index) => {
                                // Crear una nueva fecha a partir de la fecha del calendario
                                const eventDate = new Date(`${date.Month} ${date.Day}, ${date.Year}`);
                                const isPastEvent = eventDate < currentDate;

                                // Formatear Día y Mes
                                const formattedDay = formatNumber(date.Day);
                                const formattedMonth = formatNumber(date.Month);

                                return (
                                    <div
                                        key={index}
                                        className={`grid grid-cols-[1fr,1fr,1fr,7fr,7fr,2fr] md:grid-cols-[1fr,1fr,1fr,10fr,10fr,2fr] gap-2 pb-1 border-b border-neutral-500 text-left text-xs md:text-base ${isPastEvent ? 'text-neutral-400' : ''}`}
                                    >
                                        {/* Día (con 0 delante si es menor que 10) */}
                                        <div>{formattedDay}</div>
                                        {/* Mes (con 0 delante si es menor que 10) */}
                                        <div>{formattedMonth.slice(0, 3).toUpperCase()}</div>
                                        {/* Año */}
                                        <div>{date.Year}</div>
                                        {/* Nombre del lugar */}
                                        <div>{date.Venue}</div>
                                        {/* Ciudad, País */}
                                        <div>{date.Place}</div>
                                        {/* Tickets */}
                                        <div className='text-right'>
                                            {date.Tickets ? (
                                                <a
                                                    href={date.Tickets}
                                                    className="text-emerald-400 whitespace-nowrap"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    TICKETS 🡥
                                                </a>
                                            ) : (
                                                <span className="text-neutral-400 whitespace-nowrap hidden">TICKETS 🡥</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default Calendar;
