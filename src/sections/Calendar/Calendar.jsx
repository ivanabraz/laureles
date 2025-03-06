import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { ArrowUpRightIcon } from "@heroicons/react/24/solid";
import { useTranslation } from 'react-i18next';

const Calendar = () => {
    const { t, i18n } = useTranslation();
    const [allDates, setAllDates] = useState([]);
    const [visibleDates, setVisibleDates] = useState([]);
    const [showAllDates, setShowAllDates] = useState(false);
    const [loading, setLoading] = useState(true);

    const monthMap = {
        'Enero': 'january', 'Febrero': 'february', 'Marzo': 'march', 'Abril': 'april',
        'Mayo': 'may', 'Junio': 'june', 'Julio': 'july', 'Agosto': 'august',
        'Septiembre': 'september', 'Octubre': 'october', 'Noviembre': 'november', 'Diciembre': 'december'
    };

    const getPlaceColumn = (date) => {
        switch (i18n.language) {
            case 'en': return date['Place (EN)'] || date['Place (ES)'];
            case 'de': return date['Place (DE)'] || date['Place (ES)'];
            default: return date['Place (ES)'];
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    'https://script.google.com/macros/s/AKfycbyLKhfogIKzfD5rgdPeqtQZHMY6A3NRNL_dBI0aHolKp0ulRSmIaIdFwkCbHfA2pXkT-w/exec'
                );
                const data = await response.json();
                const filteredDates = data.filter(date => String(date['Show on website']).toUpperCase() === 'TRUE');

                const sortedDates = filteredDates.sort((a, b) => {
                    const dateA = new Date(`${monthMap[a.Month]} ${a.Day}, ${a.Year}`);
                    const dateB = new Date(`${monthMap[b.Month]} ${b.Day}, ${b.Year}`);
                    return dateB - dateA;
                });

                setAllDates(sortedDates);
                setVisibleDates(sortedDates.slice(0, 15));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [i18n.language]);

    const handleShowMore = () => {
        setVisibleDates(allDates);
        setShowAllDates(true);
    };

    const handleShowLess = () => {
        setVisibleDates(allDates.slice(0, 15));
        setShowAllDates(false);
    };

    if (loading) {
        return <p className='text-center m-auto p-24'>{t('global.loading')}</p>;
    }

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    return (
        <div id="calendar" className="w-full bg-white my-16 text-left condensed uppercase text-black flex flex-col justify-center">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                viewport={{ once: true }}
                className="w-[100%] lg:w-[70%] xl:w-[60%] m-auto px-2 md:10"
            >
                <p className="text-4xl mb-14 text-center">{t('global.calendar')}</p>

                {visibleDates.map((date, idx) => {
                    const eventMonth = monthMap[date.Month];
                    const eventDate = new Date(`${eventMonth} ${date.Day}, ${date.Year}`);
                    const eventYear = eventDate.getFullYear();
                    const isPastEvent = (eventYear < currentYear) || 
                                        (eventYear === currentYear && eventDate < currentDate);
                    const translatedMonth = t(`global.${eventMonth}`);

                    const showTourHeader = idx === 0 || date.Tour !== visibleDates[idx - 1].Tour;

                    return (
                        <div key={idx}>
                            {showTourHeader && date.Tour && (
                                <div className="mb-3 mt-10">
                                    <p className="w-fit border border-black rounded-[50%] uppercase px-8">
                                        {date.Tour}
                                    </p>
                                </div>
                            )}
                            <div className="grid grid-cols-[1fr,1fr,1fr,7fr,7fr,2fr] md:grid-cols-[1fr,1fr,1fr,9fr,9fr,2fr] pb-1 border-b border-neutral-500 text-left text-xs md:text-base">
                                <div className={`${isPastEvent ? 'text-neutral-400' : ''}`}>{date.Day}</div>
                                <div className={`${isPastEvent ? 'text-neutral-400' : ''}`}>
                                    {translatedMonth.slice(0, 3).toUpperCase()}
                                </div>
                                <div className={`${isPastEvent ? 'text-neutral-400' : ''}`}>{date.Year}</div>
                                <div className={`${isPastEvent ? 'text-neutral-400' : ''}`}>
                                    {date['Google maps']?.trim() ? (
                                        <a href={date['Google maps']} target="_blank" rel="noopener noreferrer">
                                            {date.Venue}
                                        </a>
                                    ) : date.Venue}
                                </div>
                                <div className={`${isPastEvent ? 'text-neutral-400' : ''}`}>
                                    {getPlaceColumn(date)}
                                </div>
                                <div className="text-right">
                                    {eventYear === currentYear && !isPastEvent && date.Tickets && date.Tickets !== "#" ? (
                                        <a href={date.Tickets} target="_blank" rel="noopener noreferrer" className="text-emerald-400 whitespace-nowrap flex items-center">
                                            TICKETS <ArrowUpRightIcon className="h-4 w-4 ml-1 relative top-[0.05em]" />
                                        </a>
                                    ) : (
                                        <span className="text-neutral-400"></span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {!showAllDates && (
                    <div
                        onClick={handleShowMore}
                        className="w-fit mt-10 py-2 px-5 m-auto uppercase border border-black text-center cursor-pointer"
                    >
                        {t('global.previous')}
                    </div>
                )}

                {showAllDates && (
                    <div
                        onClick={handleShowLess}
                        className="w-fit mt-10 py-2 px-5 m-auto uppercase border border-black text-center cursor-pointer"
                    >
                        {t('global.seeless')}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Calendar;
