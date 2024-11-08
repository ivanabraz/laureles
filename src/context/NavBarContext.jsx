import { createContext, useState, } from "react";

// CREATE CONTEXT
export const NavBarContext = createContext();

// CREATE PROVIDER COMPONENT
export const NavBarProvider = ({ children }) => {

    // OPEN MENU
    const [open, setOpen] = useState(false)

    // RETURN CONTEXT
    return (
        <NavBarContext.Provider value={{ open, setOpen }}>
            { children }
        </NavBarContext.Provider>
    );
};