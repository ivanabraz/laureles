import './App.css';
import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NavBarProvider } from './context/NavBarContext';
import { AnimatePresence } from "framer-motion";
import Home from './pages/Home';
import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';
import Loading from './components/Loading/Loading';
import Portfolio from './pages/Portfolio';

const App = () => {
    const { i18n } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { lang } = useParams();

    useEffect(() => {
        const selectedLanguage = lang || localStorage.getItem("i18nextLng") || 'es';
        if (i18n.language !== selectedLanguage) {
            i18n.changeLanguage(selectedLanguage);
        }
    }, [i18n, lang]);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, []);

    const changeLanguage = (newLang) => {
        i18n.changeLanguage(newLang);
        navigate(`/${newLang}`);
        localStorage.setItem("i18nextLng", newLang);
    };

    return (
        <NavBarProvider>
            <div className="app-container">
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <Loading i18n={i18n} />
                    ) : (
                        <>
                        <div className="content">
                            <NavBar 
                                onLanguageChange={changeLanguage} 
                                currentLanguage={i18n.language} 
                            />
                            <Routes>
                                <Route path={`/:lang?`} exact element={<Home />} />
                                <Route path={`/portfolio`} exact element={<Portfolio />} />
                            </Routes>
                            <Footer
                                onLanguageChange={changeLanguage} 
                                currentLanguage={i18n.language} 
                            />
                        </div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </NavBarProvider>
    );
}

export default App;
