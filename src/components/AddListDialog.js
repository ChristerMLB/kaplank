import React from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Alert from '@mui/material/Alert';

export default function AddListDialog(props) {
    let { addingList, setAddingList, handleListAddition, newListNameRef, listeError } = props;
    function handleClose() {setAddingList(false);}

  return (
    <div>
        <Dialog open={addingList} onClose={handleClose}>
            <DialogContent>
                <form onSubmit={handleListAddition}>
                    <TextField
                        fullWidth
                        sx={{paddingBottom:"1em"}}
                        id="NewListNameField"
                        label="Navngi den nye listen"
                        type='text'
                        variant='standard'
                        inputRef={newListNameRef}
                    />
                    <Button type="submit" color="primary" variant='contained'>Lagre</Button>
                    <Button onClick={handleClose} sx={{marginLeft:"1em"}} variant="outlined">Avbryt</Button>
                </form>
            </DialogContent>
            {listeError && <Alert severity='error'>{listeError}</Alert>}
        </Dialog>
    </div>
  )
}