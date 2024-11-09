import React from 'react';
import { motion } from "framer-motion";

const Calendar = ({ t }) => {

    return (
        <div className="w-full bg-white text-center py-16 condensed uppercase text-black">
            <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            viewport={{ once: true }}
            className="text-4xl pb-14">
                {t('global.calendar')}
            </motion.p>
            <div className="mb-5">
                <p className="w-fit h-auto border border-black rounded-[50%] uppercase px-8">TOUR '24</p>
            </div>
            <div className="text-left text-base grid grid-cols-12 flex flex-row m-auto pb-2 border-b gap-4">
                <div className="">23</div>
                <div className="">MAY</div>
                <div className="">2024</div>
                <div className="col-span-4">GALPÓN B.</div>
                <div className="col-span-4">BUENOS AIRES, ARGENTINA</div>
                <div className="text-emerald-400">TICKETS 🡥 </div>
            </div>
        </div>
    );
};

export default Calendar;
