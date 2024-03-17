import React, { createContext, useContext, useState } from 'react'

const PlankContext = createContext();

export function usePlankContext(){
    return useContext(PlankContext);
}

export default function PlankContextProvider() {

    
    const [boardName2, setBoardName2] = useState("");
    const [boardId2, setBoardId2] = useState("");

    

  return (
        <PlankContext.Provider value={value} >
            {!loading && children}
        </PlankContext.Provider>
    )
}
