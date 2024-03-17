import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import React, {useRef, useState} from 'react'
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userNameExists, setUserName } from '../db';



export default function Register() {

  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const unameRef = useRef();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const {signup} = useAuth();

  async function handleSubmit(event){
    event.preventDefault();

    if (!unameRef.current.value || !passwordRef.current.value || !passwordConfirmRef.current.value || !emailRef.current.value ){
      return setError("Vennligst fyll ut alle feltene")
    }

    if (passwordRef.current.value !== passwordConfirmRef.current.value){
      return setError("Passordene matcher ikke, vennligst prøv igjen.");
    }

    if(await userNameExists(unameRef.current.value)){
      return setError("Brukernavnet du ville ha er allerede tatt, vennligst forsøk et annet.");
    }

    try{
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value)
        .then((login)=>{
          setUserName(unameRef.current.value, login.user.uid);
        });
      setSuccess(true)
      setError(false)
    }
    catch(err){
      setSuccess(false)
      if (err.code === "auth/email-already-in-use"){
        setError("Kunne ikke registrere konto, det finnes allerede en konto med denne epostadressen.");
      } else {
        setError("Kunne ikke registrere konto, fordi noe gikk galt. Tekniske detaljer: "+err.message)
      }
      console.error(err);
    }
    setLoading(false);
  }

  return (
    <Box
    sx={{alignItems:"center", justifyContent:"center", display:"flex", flexDirection:"column", width:400, height:"100vh", margin:"auto"}}
    >
        <Paper id="registerpaper" elevation={2} sx={{p:6}}>
            <form onSubmit={handleSubmit}>
                  <TextField id="email" label="epostadresse" variant="standard" fullWidth inputRef={emailRef} sx={{ mb: 2}} />
                  <TextField id="username" label="ønsket brukernavn" variant="standard" fullWidth inputRef={unameRef} sx={{mb:2}} />
                  <TextField id="password" label="passord" type="password" variant="standard" fullWidth inputRef={passwordRef} sx={{ mb: 2 }} />
                  <TextField id="password-confirm" label="bekreft passord" type="password" variant="standard" inputRef={passwordConfirmRef} fullWidth sx={{ mb: 3 }} />
                  <Button disabled={loading} variant="contained" type='submit' fullWidth sx={{ p:2 }}>Registrer konto!</Button>
            </form>
            { success && <Alert severity="success" sx={{ pt: 3, mt: -2}}>Registreringen var vellykket! Du kan nå <Link to="/login">logge inn</Link>.</Alert> }
            { error && <Alert severity="error" sx={{ pt: 3, mt: -2}}>{error}</Alert>}
        </Paper>
        <Box sx={{ mt: 2 }}>
          <Typography>
            <Link to="/login">Logg inn på eksisterende konto</Link> -o- <Link to="/pw-recovery">Glemt passordet?</Link>
           </Typography>
        </Box>        
    </Box>
  )
}