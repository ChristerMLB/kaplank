import React, { useEffect, useState } from 'react'
import PlankeOversikt from './PlankeOversikt'
import ControlPanel from './ControlPanel'
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

export default function Dashboard() {
    const [value, setValue] = useState("boards")
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    useEffect(()=>{
        function handleResize(){
            setIsSmallScreen(window.innerWidth <= 700);
        };
        handleResize();

        window.addEventListener("resize", handleResize);
        return ()=>window.removeEventListener("resize", handleResize);
    });

    const handleChange = (event, newValue) => {
        setValue(newValue);
        console.log(newValue)
    };

    return (
        <div id="dashboardWrapper">

            { isSmallScreen ? (
                <>
                    <Tabs id="dashboardTabs" value={value} onChange={handleChange}>
                        <Tab value="boards" label="Mine tavler" />
                        <Tab value="settings" label="Innstillinger" />
                    </Tabs>
                    <div hidden={value !== "boards"}><PlankeOversikt /></div>
                    <div hidden={value !== "settings"}><ControlPanel /></div>
                </>
            ) : (
                <>
                    <ControlPanel />
                    <PlankeOversikt />
                </>
            )}

        </div>
    )
}