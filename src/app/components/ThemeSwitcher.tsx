'use client';

import { Session } from 'next-auth';
import { useEffect, useState } from 'react';

interface ThemeProps {
    session: Session | null;
}

// Custom hook to determine the current theme mode
const ThemeSwitcher: React.FC<ThemeProps> = ({
    session,
}) => {
    const [darkMode, setDarkMode] = useState<boolean | undefined>(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const darkModeFromLocalStorage = window.localStorage.getItem("darkMode");
            if (darkModeFromLocalStorage !== null) {
                setDarkMode(darkModeFromLocalStorage && JSON.parse(darkModeFromLocalStorage));
            }
            else {
                setDarkMode(true);
            }
        }
    }, [session]);

    return (
        <>
            {darkMode ?
                <link href="/css/template.dark.min.css" rel="stylesheet" media="(prefers-color-scheme: dark)" />
                :
                <link href="/css/template.min.css" rel="stylesheet" />
            }
        </>
    )
};

export default ThemeSwitcher;