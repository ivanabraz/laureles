const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    content: ["./src/**/*.{html,js,jsx}"],
    darkMode:'class',
    theme: {
        screens: {
            'xs': '475px',
            ...defaultTheme.screens,
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