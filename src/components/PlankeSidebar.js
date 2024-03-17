import React from 'react'
import BoardHistory from './BoardHistory';
import BoardNote from './BoardNote';
import SettingsMenu from "./SettingsMenu";

export default function PlankeSidebar(props) {

    const { editBoardNote, setError, boardDoc, boardId, boardName, boardVisitorUsername, demo } = props;

  return (
    <div id="boardSidebar">
        <span className='listHeader'><h2>{boardName}</h2></span>
        <SettingsMenu username={boardVisitorUsername} />

        <BoardNote  editBoardNote={editBoardNote} text={boardDoc && boardDoc.boardNote} boardId={boardId} setError={setError} />

        { !demo && <BoardHistory boardId={boardId} />}
    </div>
  )
}