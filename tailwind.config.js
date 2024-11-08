const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    content: ["./src/**/*.{html,js,jsx}"],
    darkMode:'class',
    theme: {
        screens: {
            'xs': '475px',
            ...defaultTheme.screens,
            },
            fontFamily: {
                'sans': ['TeXGyreHeros'],
                'body': ['TeXGyreHeros'],
                'condensed': ['TeXGyreHerosCondensed'],
            },
        extend: {
            animation: {
                'spin-slow': 'spin 5s linear infinite',
            },
        },
    },
    plugins: [
    ],
};