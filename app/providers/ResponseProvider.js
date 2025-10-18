'use client'
import {useState} from 'react';

import { ResponseContext } from '../contexts';

export default function ResponseProvider({children}) {
    const [myText, setMyText] = useState("");
    const [aiResponse, setAiResponse] = useState("");
    const [inputOuputPair, setInputOutputPair] = useState([]);

    return(
        <ResponseContext.Provider value={{myText,setMyText,aiResponse,setAiResponse,inputOuputPair, setInputOutputPair}}>
            {children}
        </ResponseContext.Provider>
    )
}