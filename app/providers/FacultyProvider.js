'use client'

import {useState} from 'react';

import { FacultyContext } from '../contexts';

export default function FacultyProvider({children}) {
    const [faculty, setFaculty] = useState({});

    return(
        <FacultyContext.Provider value={{faculty, setFaculty}}>
            {children}
        </FacultyContext.Provider>
    )
}