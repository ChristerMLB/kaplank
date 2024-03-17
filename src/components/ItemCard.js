import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useRef, useState } from 'react';
import React from 'react'
import { useAuth } from '../contexts/AuthContext';
import Box from '@mui/material/Box';
import { Draggable } from 'react-beautiful-dnd';

export default function ItemCard(props) {

    const { newCard, updateItemText, updateItemColor, liste, text, color, id, handleRemoveItem, boardId, setError, draggableId, index } = props;
    let {currentUser} = useAuth();
    if (currentUser === null) {
      currentUser = {uid:0};
    }

    const [ cardColor, setCardColor ] = useState("#CCCCCC");
    const [saving, setSaving] = useState(false);
    const newCardTextRef = useRef("");
    const colorRef = useRef("#CCCCCC");
    const colorChangeTimeoutRef = useRef(null);
    let textTimeout;

    useEffect(() => {
        setCardColor(color);
    }, [color]);

    function textAreaAutosize(){
      newCardTextRef.current.style.height = "auto";
      newCardTextRef.current.style.height = newCardTextRef.current.scrollHeight-4 + "px";
    }

    useEffect(()=>{
      if(newCard){ 
        setSaving(true);
        setTimeout(()=>{setSaving(false);}, 2000);
      }
      textAreaAutosize();
    },[newCard])

    async function handleColorChange(e){
        const newColor = e.target.value;
        clearTimeout(colorChangeTimeoutRef.current);
        colorChangeTimeoutRef.current = setTimeout(async ()=>{
          if(newColor !== color){
            try{
              setSaving(true);
              await updateItemColor(boardId, id, newColor, currentUser.uid)
              setCardColor(newColor);
              setSaving(false);
            }catch(err){
              console.error(err);
              setError({message:`Error setting the color ${newColor} to the card with the following text:`, message2: `"${newCardTextRef.current.value}"`, message3:"Please refresh the page and try again.", details:err.message});
            }
          }
        }, 700);


    }
    async function handleTextChange(e){
      textAreaAutosize();
      const newText = newCardTextRef.current.value;
      clearTimeout(textTimeout);
      if(newText !== text){
        try{
          textTimeout = setTimeout(async ()=>{
            setSaving(true); 
            await updateItemText(boardId, id, newCardTextRef.current.value, currentUser.uid);
            setSaving(false);
          ;}, 1500);
        }catch(err){
          console.error(err);
          setError({message:`Error changing the card's text to the following:`, message2: `"${newCardTextRef.current.value}"`, message3:"Please refresh the page and try again.", details:err.message});
        }
      }
      setSaving(false);
    }
    // async function handleKeyDown(e){
    //   e.stopPropagation();
    //   setSaving(true);
    //   if(e.key === "Enter" && e.shiftKey === false){
    //     e.preventDefault();
    //     const newText = newCardTextRef.current.value;
    //     if(newText !== text){
    //       try{
    //         await updateItemText(boardId, id, newText, currentUser.uid);
    //       }catch(err){
    //         console.error(err)
    //         setError({message:`Error changing the card's text to the following:`, message2: `"${newCardTextRef.current.value}"`, message3:"Please refresh the page and try again.", details:err.message});
    //       }
    //     }
    //   }
    //   setSaving(false);
    // }

  return (
    <Draggable draggableId={draggableId} index={index} isDragDisabled={saving}>
        {(provided)=>(
          <div className='ItemCardWrapper' ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
            <Card className='myCard itemCard' sx={{backgroundColor:cardColor}} >
                <div id="itemCardActions">
                  <div>
                    <Box className='fargevelgerdings' sx={{backgroundColor:cardColor}} ></Box>
                    <input type="color" className="newBoardColor" ref={colorRef} name="favcolor" value={cardColor} onInput={handleColorChange} onChange={(e)=>{setCardColor(e.target.value)}}/>
                      { 
                        handleRemoveItem && <IconButton aria-label="delete item" size="small" className='removeItemButton' onClick={()=>{return handleRemoveItem(id, liste, newCardTextRef.current.value)}}>
                          <DeleteIcon />
                        </IconButton>
                      }
                  </div>
                  {saving && <div className='saveIndicator'><em>Lagrer...</em></div>}
                </div>

                        <textarea
                            // onKeyDown={handleKeyDown}
                            className="itemTextField"
                            ref={newCardTextRef}
                            onInput={handleTextChange}
                            defaultValue={text}
                        />

                        {/* <Button type='submit' sx={{width:"50%", marginTop:"1.6em"}}>Submit</Button>
                        <Button onClick={flipBack} sx={{width:"50%", marginTop:"1.6em"}}>Cancel</Button> */}
            </Card>
            </div>
        )}
    </Draggable>
      )
}