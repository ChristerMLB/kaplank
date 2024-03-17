import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import React, {useRef, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';



export default function Login() {

  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {login} = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event){
    event.preventDefault();
    try{
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      setError(false)
      navigate("/")
    }
    catch(err){
        if (err.code === "auth/invalid-email"){
            setError("Det ser ut som du skrev noe feil i epostadressen din, vennligst prøv igjen.")
        }else if (err.code === "auth/too-many-requests"){
            setError("Vi har midlertidig suspendert kontoen din på grunn av for mange påloggingsforsøk. Dette er for at hackere og botter ikke skal kunne gjette seg til passordet ditt. Vennligst vent litt før du prøver igjen.");
        }else if (err.code === "auth/wrong-password"){
            setError("Ser ut som du har skrevet noe feil i passordet ditt, vennligst prøv igjen.")
        }else{
             setError("Kunne ikke logge deg inn, fordi det skjedde en feil. Tekniske detaljer: "+err.message)
        }
        console.error(err);
    }
    setLoading(false);
  }

  return (
    <Box
  sx={{
    alignItems:"center", justifyContent:"center", display:"flex", flexDirection:"column", width:400, height:"100vh", margin:"auto"
  }}
>
  <Paper id="loginpaper" elevation={2} sx={{ p: 6 }}>
    <form onSubmit={handleSubmit}>
      <TextField
        id="email"
        label="epostadresse"
        variant="standard"
        fullWidth
        inputRef={emailRef}
        sx={{ mb: 2 }}
      />
      <TextField
        id="password"
        label="passord"
        type="password"
        variant="standard"
        fullWidth
        inputRef={passwordRef}
        sx={{ mb: 2 }}
      />
      <Button
        disabled={loading}
        variant="contained"
        type="submit"
        fullWidth
        sx={{ p: 2 }}
      >
        Logg inn
      </Button>
    </form>
    {error && (
      <Alert severity="error" sx={{ pt: 3, mt: -2 }}>
        {error}
      </Alert>
    )}
  </Paper>
  <Box sx={{ mt: 2 }}>
    <Typography>
      <Link to="/register">Registrer ny konto</Link> -o- <Link to="/pw-recovery">Glemt passordet?</Link>
    </Typography>
  </Box>
</Box>
  )
}