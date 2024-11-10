import React from "react";
import { useTranslation } from 'react-i18next';
import Header from '../sections/Header/Header';
import About from "../sections/About/About";
import Songs from "../sections/Songs/Songs";
import Calendar from "../sections/Calendar/Calendar";
import Press from "../sections/Press/Press";

const Home = () => {
    const { t } = useTranslation();

    return (
        <>
            <Header t={t} />
            <About t={t} />
            <Songs t={t} />
            <Calendar t={t}/>
            <Press t={t}/>
        </>
    );
}

export default Home;
