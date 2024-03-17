import React from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Alert from '@mui/material/Alert';

export default function AddBoardDialog(props) {
    let { addingList, setAddingBoard, handleListAddition, newListNameRef, error } = props;
    function handleClose() {setAddingBoard(false);}

  return (
    <div>
        <Dialog open={addingList} onClose={handleClose} ref={dialogRef}>
            <DialogContent>
                <form onSubmit={handleListAddition}>
                    <TextField 
                        autoFocus
                        fullWidth
                        sx={{paddingBottom:"1em"}}
                        id="NewListNameField"
                        label="Navngi den nye tavlen"
                        type='text'
                        variant='standard'
                        inputRef={newListNameRef}
                    />
                    <Button type="submit" color="primary" variant='contained'>Lagre</Button>
                    <Button onClick={handleClose} sx={{marginLeft:"1em"}} variant="outlined">Avbryt</Button>
                </form>
            </DialogContent>
            {error && <Alert severity='error'>{error}</Alert>}
        </Dialog>
    </div>
  )
}