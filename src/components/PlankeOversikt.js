import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useState, useEffect, useRef } from 'react'
import { getBoards } from '../db'
import BoardCard from './BoardCard'
import BoardPlusCard from './BoardPlusCard'
import BoardEditCard from './BoardEditCard'
import { CSSTransition } from 'react-transition-group'


export default function PlankeOversikt() {

  const {currentUser} = useAuth(); 
  const [myBoards, setMyBoards] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [newCard, setNewCard] = useState("");
  const nodeRef = useRef();
  const newBoardNameRef = useRef();

  useEffect(()=>{
    async function fetchBoards(){
      const b = await getBoards(currentUser)
      setMyBoards(b)
    }
    fetchBoards()
  },[currentUser])

  function flipIt(){
    if(!flipped){
      setTimeout(()=>{ newBoardNameRef.current.focus();}, 50 )
    }
    setFlipped(!flipped);
  }

  return (
      <div id="plankeOversikt">
          {myBoards && myBoards.map((board)=> {
            return (
                <div hidden={newCard === board.id} key={board.id}>
                  <BoardCard 
                    boardId = {board.id} 
                    boardColor = {board.color} 
                    boardName = {board.name} 
                    myBoards={myBoards} 
                    setMyBoards={setMyBoards}
                  />
                </div>
              )
          })}
          <CSSTransition in={flipped} timeout={400} classNames="flipped" nodeRef={nodeRef} >
            <div className='flipCard boardFlip' ref={nodeRef}>
                <div className='flipInner'>
                  <div className="flipCardFront">
                    <BoardPlusCard flipToEdit={flipIt} />
                  </div>
                  <div className="flipCardBack">
                    <BoardEditCard currentUser={currentUser} setMyBoards={setMyBoards} flipBack={flipIt} setNewCard={setNewCard} newBoardNameRef={newBoardNameRef} />
                  </div>
                </div>
            </div>
          </CSSTransition>
      </div>
  )
}