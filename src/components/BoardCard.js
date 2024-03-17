import React, {useState, useEffect} from 'react'
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import { getBoardCreator, getUsername } from '../db';
import { useNavigate } from 'react-router-dom';
import BoardCardActions from './BoardCardActions';

export default function BoardCard(props) {

    const { boardId, boardColor, boardName, myBoards, setMyBoards } = props;
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
      async function fetchBoardCreator() {
        try {
          const creatorUid = await getBoardCreator(boardId);
          const creatorUserName = await getUsername(creatorUid);
          setUserName(creatorUserName);
        } catch (err) {
          console.error(err);
        }
      }
      fetchBoardCreator();
    }, [boardId]);
  
    function navigateToBoard() {
      const spaceLessBoardname = boardName.replace(' ', '_');
      navigate(`/${userName}/${spaceLessBoardname}`);
    }

  return (
    <Card className='myCard boardCard' sx={{backgroundColor:boardColor, margin:"20px"}} >

    <Button
        onClick={()=> navigateToBoard(boardId, boardName)}
        aria-label={"navigate to "+boardId}
        sx={{ margin:"20px"}} 
        variant="outlined"
        className="boardButtons" 
    >
        {boardName}
        
    </Button>

    <BoardCardActions boardId={boardId} myBoards={myBoards} setMyBoards={setMyBoards} />

  </Card>
  )
}