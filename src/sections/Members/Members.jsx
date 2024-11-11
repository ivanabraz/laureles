import React from "react";
import 'swiper/css';
import { motion } from "framer-motion";
import { v4 as uuidv4 } from 'uuid';

const Members = ({ t }) => {
    const cueroMembers = [
        { name: "Emilio Cossani", instrument: t('global.guitar'), social: "emiliocossani", img: "member-02" },
        { name: "Federico Gómez", instrument: t('global.piano'), social: "fedgomez89", img: "member-01" },
        { name: "Martina Greiner", instrument: t('global.cello'), social: "greinma", img: "member-03" },
        { name: "Ignacio Santos", instrument: t('global.bandoneon'), social: "nach.santos", img: "member-04" },
    ];

    return (
        <div id="members" className="w-full condensed text-black">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                viewport={{ once: true }}
                className="grid grid-cols-2 md:grid-cols-4"
            >
                {cueroMembers.map((member) => (
                    <div key={uuidv4()} className="relative">
                        <img
                            className="aspect-[3/4] object-cover w-full h-full"
                            alt={member.name}
                            src={`${process.env.PUBLIC_URL}/images/photos/${member.img}.jpg`}
                        />
                        {/* Gradiente que cubre solo hasta la mitad inferior de la imagen */}
                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                            <div className="flex justify-between items-end w-full">
                                <div className="flex flex-col">
                                    <p className="uppercase">{member.name}</p>
                                    <p>{member.instrument}</p>
                                </div>
                                <a
                                    href={"https://www.instagram.com/" + member.social}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    @{member.social}
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default Members;
