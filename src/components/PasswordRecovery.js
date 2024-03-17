import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import React, {useRef, useState} from 'react'
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';



export default function PasswordRecovery() {

  const emailRef = useRef();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const {passwordReset} = useAuth();

  async function handleSubmit(event){
    event.preventDefault();
    try{
      setLoading(true);
      await passwordReset(emailRef.current.value);
      setSuccess(true)
      setError(false)
    }
    catch(err){
      setSuccess(false)
      if (err.code === "auth/user-not-found"){
        setError("Beklager, vi kunne ikke finne noen brukere med den epostadressen, vennligst dobbeltsjekk at den er skrevet riktig og prøv igjen.");
      } else {
        setError("Fikk ikke sendt passordlenke fordi det oppsto en feil. Tekniske detaljer: "+err.message)
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
                   <Button disabled={loading} variant="contained" type='submit' fullWidth sx={{ p:2 }}>Send passordlenke</Button>
            </form>
            { success && <Alert severity="success" sx={{ pt: 3, mt: -2}}>Sjekk eposten din for en lenke du kan bruke til å lage et nytt passord.</Alert> }
            { error && <Alert severity="error" sx={{ pt: 3, mt: -2}}>{error}</Alert>}
        </Paper>
        <Box sx={{ mt: 2 }}>
          <Typography>
            <Link to="/login">Logg inn på eksisterende konto</Link> -o- <Link to="/register">Registrer ny konto</Link>
           </Typography>
        </Box>        
    </Box>
  )
}