import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import { useEffect, useRef, useState, useCallback } from 'react';
import React from 'react'

export default function ItemEditCard(props) {

    const { flipBack, liste, color, handleItemEdit, newCardTextRef } = props;

    const [ cardColor, setCardColor ] = useState("#CCCCCC");
    const colorRef = useRef("#CCCCCC");
    const [itemText, setItemText] = useState("");
    
    const textAreaAutosize = useCallback(()=>{
      newCardTextRef.current.style.height = "auto";
      newCardTextRef.current.style.height = newCardTextRef.current.scrollHeight-4 + "px";
    }, [newCardTextRef]);
    useEffect(() => { 
        colorRef.current.value = color;
        setCardColor(color);
        textAreaAutosize();
      }, [color, textAreaAutosize]);
    const handleColorChange = (e)=>{
        setCardColor(e.target.value);
    }
    function handleKeyDown(e){
      if(e.key==="Enter" && !e.shiftKey){
        e.preventDefault();
        handleItemEdit(e, newCardTextRef.current.value, colorRef.current.value, liste);
        setItemText("")
      }else if(e.key==="Escape"){
        flipBack();
      }
    }

  return (
        <Card className='myCard addItemCard' sx={{backgroundColor:cardColor}}>

            <div id="itemCardActions">
              <div>
              <Box className='fargevelgerdings' sx={{backgroundColor:cardColor, right:".5em", marginTop:"0.3em"}} ></Box>
              <label htmlFor="favcolor">Velg farge for lappen: </label>
              <input type="color" className="newBoardColor" ref={colorRef} name="favcolor" value={cardColor} onChange={handleColorChange} />
              </div>
            </div>
                    <textarea
                        onKeyDown={handleKeyDown}
                        className="itemTextField"
                        label="Skriv tekst her"
                        value={itemText}
                        onChange={(e)=>{ setItemText(e.target.value) }}
                        onInput={textAreaAutosize}
                        ref={newCardTextRef}
                    />
                    <div>
                      <Button 
                        className='bottomTwoButtons'
                        onClick={(event)=>{handleItemEdit(event, newCardTextRef.current.value, colorRef.current.value, liste); setItemText("");}}
                      >Lagre
                      </Button>
                      <Button 
                      onClick={flipBack} 
                      className='bottomTwoButtons'>
                        Avbryt
                      </Button>
                    </div>
        </Card>
  )
}