import React from "react";
import 'swiper/css';
import { motion } from "framer-motion";
import { v4 as uuidv4 } from 'uuid';

const cueroMembers = [
    { name: "Nombre Apellido", instrument: "Instrumento", social: "cuero.tango", img: "member-01" },
    { name: "Nombre Apellido", instrument: "Instrumento", social: "cuero.tango", img: "member-02" },
    { name: "Nombre Apellido", instrument: "Instrumento", social: "cuero.tango", img: "member-03" },
    { name: "Nombre Apellido", instrument: "Instrumento", social: "cuero.tango", img: "member-04" },
];

const Members = ({ t }) => {
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
                    <div>
                        <img className="aspect-square object-cover" alt={member.name} src={`${process.env.PUBLIC_URL}/images/photos/${member.img}.jpg`} />
                        <p className="uppercase">{member.name}</p>
                        <p className="text-neutral-400">{member.instrument}</p>
                        <a 
                            key={uuidv4()}
                            href={"https://www.instagram.com/" + member.social}
                            className="text-neutral-400"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            @{member.social}
                        </a>
                    </div>

                ))}
            </motion.div>
        </div>
    );
};

export default Members;
