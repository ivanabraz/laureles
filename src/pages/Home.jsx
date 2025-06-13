import React from "react";
import { useTranslation } from 'react-i18next';
import Header from '../sections/Header/Header';
import About from "../sections/About/About";
import Press from "../sections/Press/Press";
import Contact from "../sections/Contact/Contact";
import Quote from "../sections/Quote/Quote";
import MarqueeComponent from "../sections/Marquee/MarqueeComponent";
import Packages from "../sections/Packages/Packages";
import PortfolioSection from "../sections/PortfolioSection/PortfolioSection";

const Home = () => {
    const { t } = useTranslation();

    return (
        <>
            <Header t={t} />
            <Quote t={t} />
            <Packages t={t} />
            <MarqueeComponent t={t} />
            <PortfolioSection t={t} />
            <About t={t} />
            <Press t={t} />
            <Contact t={t}/>
        </>
    );
}

export default Home;
