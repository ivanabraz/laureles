import React from "react";
import { useTranslation } from 'react-i18next';
import Header from '../sections/Header/Header';
import Contact from "../sections/Contact/Contact";

const Portfolio = () => {
    const { t } = useTranslation();

    return (
        <>
            <Header t={t} />
            <Contact t={t}/>
        </>
    );
}

export default Portfolio;
