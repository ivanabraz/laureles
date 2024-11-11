import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import Header from '../sections/Header/Header';
import About from "../sections/About/About";
import Songs from "../sections/Songs/Songs";
import Calendar from "../sections/Calendar/Calendar";
import Press from "../sections/Press/Press";
import Contact from "../sections/Contact/Contact";
import Rider from "../sections/Rider/Rider";
import Members from "../sections/Members/Members";

const Home = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Header t={t} />
            <About t={t} setIsOpen={setIsOpen} />
            <Members t={t} />
            <Calendar t={t}/>
            <Songs t={t} />
            <Press t={t}/>
            <Contact t={t}/>
            <Rider t={t} isOpen={isOpen} setIsOpen={setIsOpen} />
        </>
    );
}

export default Home;
