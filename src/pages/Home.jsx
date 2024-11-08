import React from "react";
import { useTranslation } from 'react-i18next';
import Header from '../sections/Header/Header';
import About from "../sections/About/About";
import Songs from "../sections/Songs/Songs";

const Home = () => {
    const { t } = useTranslation();

    return (
        <>
            <Header t={t} />
            <About t={t} />
            <Songs t={t} />
        </>
    );
}

export default Home;
