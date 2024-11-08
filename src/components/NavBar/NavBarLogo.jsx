import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// IMAGES
const logo = `${process.env.PUBLIC_URL}/images/logo/logo.svg`;

const NavBarLogo = (props) => {
    const { customClassName } = props;

    // scrolled
    const [scrolled, setScrolled] = useState(false);
    const handleScroll = () => {
        if (window.scrollY > 150) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    };
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // scroll to top
    const handleScrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <div className={`flex w-100 ${customClassName !== null ? customClassName : ''}`}>
                <Link to="#" onClick={handleScrollToTop}>
                    <img 
                        src={logo} 
                        alt="Cuerto Tango logo" 
                        className={`h-8 transition-all duration-300 ${scrolled ? 'opacity-100' : 'opacity-0'} ${scrolled ? 'invert' : ''}`}
                    />
                </Link>
        </div>
    )
}

export default NavBarLogo;