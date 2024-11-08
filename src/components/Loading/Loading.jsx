import React from "react";
import { useTranslation } from 'react-i18next';

const Loading = () => {
    const { t } = useTranslation();
    const logo = `${process.env.PUBLIC_URL}/images/logo/logo.svg`;

    return (
        <div className="w-full h-[100vh] flex flex-col justify-center items-center space-x-1 text-sm text-neutral-500">
            <img 
                src={logo} 
                alt="Cuerto Tango logo" 
                className={`h-8 transition-all duration-300 invert`}
            />
            <p className="mt-5">
                {t('global.loading')}
            </p>
        </div>
    )
}

export default Loading;