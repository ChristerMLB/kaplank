import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import { addBoard, getBoards, getUsername } from '../db';
import { useRef, useState } from 'react';
import React from 'react'
import { useAuth } from '../contexts/AuthContext';

export default function BoardEditCard(props) {

    const {flipBack, setMyBoards, setNewCard, newBoardNameRef} = props;
    const [ cardColor, setCardColor ] = useState("#EEEEEE")
    const colorRef = useRef("#EEEEEE");
    const {currentUser} = useAuth();
    const uid = currentUser.uid;
    const [error, setError] = useState(false);
    const [addingBoard, setAddingBoard] = useState(false);

    const handleColorChange = (e)=>{
        setCardColor(e.target.value);
    }
    const handleBoardEdit = async (event) =>{
        event.preventDefault();
        setError(false);
        setAddingBoard(true);
        try{
          const boardName = newBoardNameRef.current.value;
          await addBoard(uid, boardName, colorRef.current.value);
          const b = await getBoards(currentUser);
          newBoardNameRef.current.value = ""; // burde dette vare en state variable i stedet?
          const username = await getUsername(uid);
          setNewCard(username+": "+boardName);
          setMyBoards(b);
          flipBack();
          // await new Promise(resolve => setTimeout(resolve, 280));
          // document.querySelector('.flipInner').classList.add('pause'); 
          setNewCard("");
          // document.querySelector('.flipInner').classList.remove('pause'); 
        }catch(err){
          console.error(err)
          setError("Could not create board, please try again.\nError details: ",err);
        }
        setAddingBoard(false);
    }

    function handleKeyDown(e){
      if(e.key==="Enter"){
        e.preventDefault();
        handleBoardEdit(e);
      }else if(e.key==="Escape"){
        flipBack();
      }
    }

  return (
    <>
      <Card className='myCard addBoardCard' sx={{backgroundColor:cardColor}} >
          <div id="itemCardActions" style={{paddingTop:".5em"}} >
            <div>
                <Box className='fargevelgerdings' sx={{backgroundColor:cardColor, marginTop:"0.3em", right:".56em"}} ></Box>
                <label htmlFor="favcolor">Velg farge for tavlen: </label>
                <input type="color" className="newBoardColor" ref={colorRef} name="favcolor" value={cardColor} onChange={handleColorChange} />
            </div>
          </div>
          <TextField 
              id="NewBoardNameField"
              className='itemTextField addItemTextField'
              label="Navngi den nye tavlen"
              onKeyDown={handleKeyDown}
              minRows={1}
              inputRef={newBoardNameRef}
          />
          <div>
            <Button onClick={handleBoardEdit} disabled={addingBoard} className='bottomTwoButtons'>Lagre</Button>
            <Button onClick={flipBack}  className='bottomTwoButtons'>Avbryt</Button>
          </div>
      </Card>
      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}
    </>

  )
}
