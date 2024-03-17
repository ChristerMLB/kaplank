import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import SettingsMenu from './SettingsMenu';
import { getUsername } from '../db';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useRef } from 'react';
import { Alert } from '@mui/material';

export default function ControlPanel() {

    const { currentUser, updateEmail, updatePassword } = useAuth();
    const [boardVisitorUsername, setBoardVisitorUsername] = useState("");

    const [emailLabel, setEmailLabel] = useState("");
    // const [usernameLabel, setUsernameLabel] = useState("");

    const [emailError, setEmailError ] = useState(false);
    const [passwordError, setPasswordError ] = useState(false);
    // const [usernameError, setUsernameError ] = useState(false);

    const [emailSuccess, setEmailSuccess ] = useState(false);
    const [passwordSuccess, setPasswordSuccess ] = useState(false);
    // const [usernameSuccess, setUsernameSuccess ] = useState(false);

    const emailFieldRef = useRef("");
    const passwordFieldRef = useRef("");
    const passwordConfirmRef = useRef("");
    // const usernameFieldRef = useRef("");
    
    useEffect(()=>{
        async function fetchBoardVisitorUsername(){
            if (currentUser.uid){
                const username = await getUsername(currentUser.uid);
                setBoardVisitorUsername(username);
                setEmailLabel(currentUser.email);
                // setUsernameLabel(username);
            }
        }
        fetchBoardVisitorUsername();
    }, [currentUser])

    async function handleEmailChange(e){

        e.preventDefault();
        setEmailError(false);
        setEmailSuccess(false);

        if(emailLabel === emailFieldRef.current.value){
            return setEmailError("Epostadressen du har skrevet inn er den samme som den gamle");
        }
        const newEmail = emailFieldRef.current.value;
        try{
            await updateEmail(newEmail);
        }catch(err){
            
            if (err.code === "auth/email-already-in-use"){
                return setEmailError("Kunne ikke endre epostadressen, det finnes allerede en konto med denne adressen.");
            }
            if (err.code === "auth/invalid-email"){
                return setEmailError("Dette ser ikke ut som en gyldig epostadresse, vennligst kontroller den og prøv igjen.");
            }
            if (err.code === "auth/requires-recent-login"){
                return setEmailError("Dette er en sensitiv operasjon, for sikkerhets skyld må vi be deg logge inn på nytt og forsøke igjen.");
            }
            return setEmailError("Kunne ikke endre epostadressen, noe gikk galt. Tekniske detaljer: "+err.message);
            
        }
        setEmailSuccess(true);
        setEmailLabel(newEmail);
    }
    async function handlePasswordChange(e){

        e.preventDefault();
        setPasswordError(false);
        setPasswordSuccess(false);

        if(passwordFieldRef.current.value !== passwordConfirmRef.current.value){
            return setPasswordError("Passordene matcher ikke, vennligst prøv igjen");
        }
        if(passwordFieldRef.current.value === "" || passwordFieldRef.current.value.length < 6){
            return setPasswordError("Passordet må være minst 6 tegn");
        }

        const newPassword = passwordFieldRef.current.value;
        try{
            await updatePassword(newPassword);
        }catch(err){
            
            if (err.code === "auth/requires-recent-login"){
                return setPasswordError("Dette er en sensitiv operasjon, for sikkerhets skyld må vi be deg logge inn på nytt og forsøke igjen.");
            }
            return setPasswordError("Kunne ikke endre passordet, noe gikk galt. Tekniske detaljer: "+err.message);
            
        }
        setPasswordSuccess(true);
    }
    // async function handleUsernameChange(e){

    //     e.preventDefault();
    //     setUsernameError(false);
    //     setUsernameSuccess(false);

    //     if(usernameFieldRef.current.value === "" || usernameFieldRef.current.value === usernameLabel) {
    //         return setUsernameError("Skriv inn et nytt brukernavn hvis du vil endre brukernavnet");
    //     }

    //     const newUsername = usernameFieldRef.current.value;
    //     try{
    //         await setUserName(newUsername, currentUser.uid);
    //     }catch(err){

    //         if (err.code === "auth/requires-recent-login"){
    //             return setUsernameError("Dette er en sensitiv operasjon, for sikkerhets skyld må vi be deg logge inn på nytt og forsøke igjen.");
    //         }

    //         return setUsernameError("Kunne ikke endre brukernavnet, noe gikk galt. Tekniske detaljer: "+err.message);
            
    //     }
    //     setUsernameSuccess(true);
    //     setUsernameLabel(newUsername);
    // }

    return (
        <div id="controlPanelWrapper">
            <SettingsMenu username={boardVisitorUsername} />
            <h3>Epostadresse</h3>
            <TextField fullWidth inputRef={emailFieldRef} label={emailLabel} onKeyDown={(e) => { e.key==="Enter" && handleEmailChange(e) }}></TextField>
            <Button variant='contained' onClick={handleEmailChange} fullWidth>Endre epostadresse</Button>
            { emailError && <Alert severity='error' sx={{pt:3, mt:-2}}>{emailError}</Alert> }
            { emailSuccess && <Alert severity='success' sx={{pt:3, mt:-2}}>Epostadressen er endret!</Alert> }
            <h3>Passord</h3>
            <TextField fullWidth inputRef={passwordFieldRef} label="Passord" type='password' ></TextField>
            <TextField fullWidth inputRef={passwordConfirmRef} label="Bekreft passord" type='password' onKeyDown={(e) => { e.key==="Enter" && handlePasswordChange(e) }} ></TextField>
            <Button variant='contained' fullWidth onClick={handlePasswordChange}>Endre passord</Button>
            { passwordError && <Alert severity='error' sx={{pt:3, mt:-2}}>{passwordError}</Alert> }
            { passwordSuccess && <Alert severity='success' sx={{pt:3, mt:-2}}>Passordet er endret!</Alert> }
            {/* <h3>Brukernavn</h3>
            <TextField 
                fullWidth 
                inputRef={usernameFieldRef} 
                label={usernameLabel} 
                onKeyDown={(e) => { e.key==="Enter" && handleUsernameChange(e) }} 
            ></TextField>
            <Button variant='contained' fullWidth onClick={handleUsernameChange}>Endre brukernavn</Button>
            { usernameError && <Alert severity='error' sx={{pt:3, mt:-2}}>{usernameError}</Alert> }
            { usernameSuccess && <Alert severity='success' sx={{pt:3, mt:-2}}>Brukernavnet er endret!</Alert> } */}

            {/* reklame */}
        </div>
    )
}
