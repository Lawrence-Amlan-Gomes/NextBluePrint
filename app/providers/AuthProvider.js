'use client'

import {useState} from 'react';

import { AuthContext } from '../contexts';

export default function AuthProvider({children}) {
    const [auth, setAuth] = useState(null);
    const [googleAuth, setGoogleAuth] = useState({name: "", email: "", image: ""});
    const [wantToRegWithGoogle, setWantToRegWithGoogle] = useState(0);

    return(
        <AuthContext.Provider value={{auth, setAuth, googleAuth, setGoogleAuth, wantToRegWithGoogle, setWantToRegWithGoogle}}>
            {children}
        </AuthContext.Provider>
    )
}