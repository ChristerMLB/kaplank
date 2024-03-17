import { CSSTransition } from 'react-transition-group';
import React, { useRef, useState } from 'react'
import ItemCard from './ItemCard';
import ItemPlusCard from './ItemPlusCard';
import AddItemCard from './AddItemCard'
import Button from '@mui/material/Button';
import { Droppable } from 'react-beautiful-dnd';

export default function Liste(props) {
  const {liste, updateItemColor, updateItemText, boardId, handleRemoveItem, handleItemEdit, handleListRemoval, setError} = props;

  const [flipped, setFlipped] = useState(false);
  const nodeRef = useRef();
  const newCardTextRef = useRef(null);

  function flipIt(){
    if(!flipped){
      setTimeout(()=>{ newCardTextRef.current.focus();}, 50 )
    }
    setFlipped(!flipped);
  }


  return (
    <Droppable droppableId={liste.id} key={liste.id} direction='vertical'>
    {(provided)=>(
      <div className="liste" ref={provided.innerRef} {...provided.droppableProps}>
        <span className='listHeader'>
          <h2>{liste.id}</h2>
          <Button variant='outlined' size='small' className='removeListButton' onClick={()=>handleListRemoval(liste.id)}>Fjern</Button>
        </span>
        {liste.itemCards && liste.itemCards.map((item, index)=> {
            return (
                    <ItemCard 
                      updateItemText={updateItemText} 
                      updateItemColor={updateItemColor}
                      setError={setError}
                      text={item.text} 
                      color={item.color} 
                      flipBack={flipIt} 
                      liste={liste}
                      id={item.id}
                      boardId={boardId}
                      handleRemoveItem={handleRemoveItem}  
                      newCard={Boolean(item.newCard)}
                      draggableId={item.id}
                      index={index}
                      key={item.id}
                    />
            )
          })}

        {provided.placeholder}

        <CSSTransition in={flipped} timeout={400} classNames="flipped" nodeRef={nodeRef} >
          <div className='flipCard' ref={nodeRef}>
              <div className='flipInner'>
                <div className="flipCardFront">
                  <ItemPlusCard flipToEdit={flipIt} />
                </div>
                <div className="flipCardBack">
                  <AddItemCard flipBack={flipIt} color="#CCCCCC" handleItemEdit={handleItemEdit} newCardTextRef={newCardTextRef} boardId={boardId} liste={liste} />
                </div>
              </div>
          </div>
        </CSSTransition>

      </div>
      )}
    </Droppable>
  )
}