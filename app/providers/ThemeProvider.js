'use client'

import {useState} from 'react';

import { ThemeContext } from '../contexts';

export default function ThemeProvider({children}) {
    const [theme, setTheme] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return(
        <ThemeContext.Provider value={{theme, setTheme, sidebarOpen, setSidebarOpen}}>
            {children}
        </ThemeContext.Provider>
    )
}