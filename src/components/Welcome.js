import React from 'react'
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
// import Dialog from '@mui/material/Dialog';

export default function Welcome() {
  return (
    <div className='flipCard welcomeFlip'>
        <Paper id="welcomePaper" sx={{p:6}} elevation={2}>
            <h2>Hold oversikten!</h2>
            <p>Kaplank! er en enkel digital kanban-tavle som gjør akkurat det en kanban-tavle skal gjøre, og ikke noe særlig mer enn det.</p>
            <p>En kanban-tavle er en tavle som er delt inn i lister, for eksempel: "venter", "pågår" og "fullført". Så kan man skrive små lapper som beskriver ulike arbeidsoppgaver, og plassere de der hvor de er i prosessen. Det kan gjøre det enklere å holde oversikt i et prosjekt.</p>
            <p>Sjekk ut demoen hvis du er nysgjerrig, registrer deg hvis du bare vil komme i gang, eller logg inn hvis du allerede har en konto.</p>

            <div id='welcomeButtons'>
              <Button variant='contained' sx={{mr:1}} type='link' href='/Demo' fullWidth>Prøv demoen</Button>
              <Button variant='default' sx={{mr:1}} type='link' href='/Register' fullWidth>Registrer deg</Button>
              <Button variant='default' type='link' href='/Login' fullWidth>Logg inn</Button>
            </div>
        </Paper>
    </div>
  )
}