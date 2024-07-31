"use client"
import { useEffect } from 'react';

const DarkModeStyles = ({
    darkMode
}: {
    darkMode?: Boolean
}) => {
    console.log(darkMode)
    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = darkMode ? '/css/template.dark.min.css' : '/css/template.min.css';
        document.head.appendChild(link);
        return () => {
            document.head.removeChild(link);
        };
    }, [darkMode]);

    return null;
};

export default DarkModeStyles;
