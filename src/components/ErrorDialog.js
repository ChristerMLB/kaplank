import React from 'react'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function ErrorDialog(props) {
    let {error, setError} = props;

    return (

    <Dialog open={error}>
            <DialogContent sx={{padding:0}}>
            <Alert severity='error' icon={false} >
                {error?.message && <Alert icon={false} severity="error" variant='filled'> {error.message}</Alert>}
                {error?.message2 && <p>{error.message2}</p>}
                {error?.message3 && <p>{error.message3}</p>}
                <Accordion sx={{margin:"1em 0 1em 0"}}>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="error-details-content"
                    id="error-details-header"
                    >
                        Tekniske detaljer
                    </AccordionSummary>
                    <AccordionDetails sx={{overflow:"auto"}}>
                        <p>{error?.details}</p>
                    </AccordionDetails>
                </Accordion>
            </Alert>
                <Button size='large' className='bottomTwoButtons' onClick={()=>{window.location.reload(true)}}>Last p&aring; nytt</Button>
                <Button size='large' className='bottomTwoButtons' onClick={()=>{setError(false)}}>Avbryt</Button>
            </DialogContent>
    </Dialog>

  )
}