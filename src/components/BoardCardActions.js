import React from 'react'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Box from '@mui/material/Box';
import { deleteBoard } from '../db';

export default function BoardCardActions(props) {

    const setMyBoards = props.setMyBoards;
    const myBoards = props.myBoards;

    async function handleBoardDeletion(boardId){
        try{
          await deleteBoard(boardId);
          setMyBoards(myBoards.filter(board => board.id !== boardId));
        }catch(err){
          console.error(err)
        }
    }

  return (
    <Box className='boardCardActions'>
    {/* <IconButton
        aria-label={"settings for "+props.boardId}
        sx={{marginRight:"20px", marginBottom:"20px"}}
        className="boardSettingsButton"
    >
    <MoreHorizIcon />
    </IconButton> */}
    <IconButton
        aria-label={"delete "+props.boardId}
        sx={{marginRight:"20px"}} 
        onClick={() => handleBoardDeletion(props.boardId)}
        className="boardDeleteButton"
    >
    
        <DeleteIcon />
        
    </IconButton>
  </Box>
  )
}
