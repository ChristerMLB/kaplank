import Card from '@mui/material/Card'
import { useEffect, useRef } from 'react';
import React from 'react'
import { useAuth } from '../contexts/AuthContext';

export default function BoardNote(props) {

    const { text, boardId, setError, editBoardNote } = props;
    const {currentUser} = useAuth();

    // const [ cardColor, setCardColor ] = useState("#CCCCCC");
    const newCardTextRef = useRef(text);
    let textTimeout;

    function textAreaAutosize(){
      newCardTextRef.current.style.height = "auto";
      newCardTextRef.current.style.height = newCardTextRef.current.scrollHeight-4 + "px";
    }

    useEffect(()=>{
      textAreaAutosize();
    },[text])

    async function handleTextChange(e){
      textAreaAutosize();
      const newText = newCardTextRef.current.value;
      clearTimeout(textTimeout);
      if(newText !== text){
        try{
          textTimeout = setTimeout(()=>{editBoardNote(boardId, newText, currentUser.uid);}, 3500);
        }catch(err){
          console.error(err);
          setError({message:`Error changing the board note to the following:`, message2: `"${newCardTextRef.current.value}"`, message3:"Please refresh the page and try again.", details:err.message});
        }
      }
    }
    async function handleKeyDown(e){
      e.stopPropagation();
      if(e.key === "Enter" && e.shiftKey === false){
        e.preventDefault();
        const newText = newCardTextRef.current.value;
        if(newText !== text){
          try{
            await editBoardNote(boardId, newText, currentUser.uid);
          }catch(err){
            console.error(err)
            setError({message:`Error changing the board note to the following:`, message2: `"${newCardTextRef.current.value}"`, message3:"Please refresh the page and try again.", details:err.message});
          }
        }
      }
    }

  return (

    
        <Card id='boardNote' className='myCard' sx={{backgroundColor:"#CCCCCC"}} >

                    <textarea
                        onKeyDown={handleKeyDown}
                        className="itemTextField"
                        ref={newCardTextRef}
                        onInput={handleTextChange}
                        defaultValue={text}
                    />

                    {/* <Button type='submit' sx={{width:"50%", marginTop:"1.6em"}}>Submit</Button>
                    <Button onClick={flipBack} sx={{width:"50%", marginTop:"1.6em"}}>Cancel</Button> */}
        </Card>
      )
}