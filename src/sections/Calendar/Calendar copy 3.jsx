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

    return (
        <div className="w-full bg-white text-center py-16 condensed uppercase text-black flex justify-center">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                viewport={{ once: true }}
                className="w-[100%] lg:w-[70%] xl:w-[60%] mx-auto"
            >
                {/* Título */}
                <p className="text-4xl pb-14">
                    {t('global.calendar')}
                </p>

                {/* Contenedor del Tour */}
                <div className="mb-5">
                    <p className="w-fit h-auto border border-black rounded-full uppercase px-8 mx-auto">TOUR '24</p>
                </div>

                {/* Listado de fechas del calendario */}
                <div className="space-y-2 p-10 xs:p-3 sm:p-5 md:p-10">
                    {/* Mapeo de datos obtenidos del Google Sheets */}
                    {dates.length > 0 ? (
                        dates.map((date, index) => {
                            // Crear una nueva fecha a partir de la fecha del calendario (suponiendo el formato "Day-Month-Year")
                            const eventDate = new Date(`${date.Month} ${date.Day}, ${date.Year}`);
                            const isPastEvent = eventDate < currentDate;

                            return (
                                <div
                                    key={index}
                                    className={`grid grid-cols-[1fr,1fr,1fr,6fr,6fr,2fr] pb-2 border-b border-neutral-500 text-left px-2 text-base xs:text-xs sm:text-sm md:text-base ${isPastEvent ? 'text-neutral-400' : ''}`}
                                >
                                    {/* Día */}
                                    <div>{date.Day}</div>
                                    {/* Mes */}
                                    <div>{date.Month.slice(0, 3).toUpperCase()}</div>
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
                        <p className="text-neutral-500">No hay fechas disponibles</p>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Calendar;
