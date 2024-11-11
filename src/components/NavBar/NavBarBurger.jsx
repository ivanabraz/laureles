import React, { useContext } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { NavBarContext } from '../../context/NavBarContext';

const NavBarBurger = () => {
    const { setOpen } = useContext(NavBarContext);

    return (
        <button type="button" className="relative rounded-md p-2 text-white lg:hidden" onClick={() => setOpen(true)}>
            <Bars3Icon className="h-8 w-8" aria-hidden="true" />
        </button>
    )
}

export default NavBarBurger;