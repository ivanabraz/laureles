import React from "react";
import { motion } from "framer-motion";

const Rider = ({ t, isOpen, setIsOpen }) => {
    const riderData = [
        { instrument: t('global.piano'), items: [t('global.pianoRider1'), t('global.pianoRider2')] },
        { instrument: t('global.bandoneon'), items: [t('global.bandoneonRider1'), t('global.bandoneonRider2'), t('global.bandoneonRider3')] },
        { instrument: t('global.cello'), items: [t('global.celloRider1'), t('global.celloRider2')] },
        { instrument: t('global.guitar'), items: [t('global.guitarRider1'), t('global.guitarRider2'), t('global.guitarRider3')] },
    ];

    if (!isOpen) return null;

    return (
        <m className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 condensed">
            <div className="bg-white rounded-lg w-full max-w-3xl mx-auto p-8 relative">
                <button onClick={() => setIsOpen(false)}
                    className="text-5xl absolute top-3 right-8 text-gray-400 hover:text-gray-800">
                    &times;
                </button>
                <p className="text-4xl mb-9 uppercase text-center text-black">
                    {t('global.rider')}
                </p>
                <div className="w-full mx-auto">
                    <div className="grid grid-cols-3 gap-y-4 border-b border-neutral-300 pb-2">
                        <div className="uppercase text-black">{t('global.instruments')}</div>
                        <div className="uppercase col-span-2 text-black">{t('global.requirements')}</div>
                    </div>
                    {riderData.map((item, index) => (
                        <div key={index} className="grid grid-cols-3 gap-y-4 py-4 border-b border-neutral-300">
                            <div className="text-neutral-500 uppercase">{item.instrument}</div>
                            <div className="col-span-2 grid text-neutral-400">
                                {item.items.map((requirement, idx) => (
                                    <div key={idx} >{requirement}</div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </m>
    );
};

export default Rider;
