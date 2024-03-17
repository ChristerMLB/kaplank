import React from 'react'
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom'
import { getUsername, editBoardNote, getBoardDoc, getLists, addList, moveItem, getItems, removeItem, addItem, removeList, updateItemColor, updateItemText } from '../noDb';
import Button from '@mui/material/Button';
import PlankeSidebar from './PlankeSidebar';
import AddListDialog from './AddListDialog';
import Liste from './Liste';
import ErrorDialog from './ErrorDialog';
import { DragDropContext } from 'react-beautiful-dnd';

export default function Planke() {
    let params = useParams();
    const boardName = "Demotavle";
    const boardId = "Demobruker: demotavle";

    const currentUser = useRef({uid:0});
    const newListNameRef = useRef();

    const [boardVisitorUsername, setBoardVisitorUsername ] = useState(null)
    const [boardDoc, setBoardDoc ] = useState(null);
    const [addingList, setAddingList ] = useState(false);
    const [lists, setLists ] = useState(null);
    const [listeError, setListeError] = useState(false)
    const [error, setError] = useState(false);


    useEffect(()=>{
        if(addingList){
            setTimeout(()=>{newListNameRef.current.focus();}, 50)
        }
    }, [addingList])
    useEffect(()=>{
        async function fetchBoardVisitorUsername(){
            if (currentUser){
                const username = await getUsername(currentUser.uid);
                setBoardVisitorUsername(username)
            }
        }
        async function fetchBoardDoc(){
            const boardDocId = params.user+": "+boardName;
            const doc = await getBoardDoc(boardDocId);
            setBoardDoc(doc);
            return doc
        }
        async function getListDocs(){

            let l = await getLists(boardId);
            
            const itemCardPromises = l.map((list) => getItems(boardId, list.id));
            const itemCardsArray = await Promise.all(itemCardPromises);

            for (let i = 0; i < l.length; i++) {
                l[i].itemCards = itemCardsArray[i];
            }
            setLists(l);
        }

        getListDocs()
        fetchBoardVisitorUsername()
        fetchBoardDoc()

      },[currentUser, params.user, boardName, boardId])
    async function handleListAddition(event){
        event.preventDefault();
        const listIds = lists.map((doc)=>doc.id);

        if(listIds.includes(newListNameRef.current.value)){
            setListeError("Navnet er tatt! Vennligst velg et unikt navn og prøv igjen.")
            return
        }else if(newListNameRef.current.value === ""){
            setListeError("Vennligst skriv inn et navn for den nye listen.")
            return
        }

        setAddingList(true);
        try{
            const lname = newListNameRef.current.value;
            let newLists = [...lists]
            const newList = {id:lname, itemCards:[]}
            newLists.push(newList);
            setLists(newLists);
            setAddingList(false);
            await addList(boardId, lname, currentUser.uid);
            setError(false);
        }catch(err){
            console.error(err)
            setError({message: `Error adding the list ${newListNameRef.current.value} to the database, Please refresh the page and try again.`, details:err.message})
            setAddingList(false);
        }
    }
    async function handleListRemoval(listName){
        try{
            const listeIndex = lists.findIndex((list)=>list.id === listName);
            let newLists = [...lists];
            newLists.splice(listeIndex,1)
            setLists(newLists);
            await removeList(boardId, listName, currentUser.uid);
        }catch(err){
            console.error(err);
            setError({message:`Error removing the list ${listName} from the database, Please refresh the page and try again.`, details:err.message})
        }
    }
    async function handleItemEdit(event, newCardText, color, liste){
        event.preventDefault();
        try{
            const listName = liste.id;
            const listeIndex = lists.findIndex((list)=>list.id === listName);
            const uid = currentUser.uid;
            let newLists = [...lists];
            let tmpId = (Math.random() + 1).toString(36).substring(7);
            const newCard = {text: newCardText, color:color, id:tmpId};
            newLists[listeIndex].itemCards.push(newCard);

            setLists(newLists)
            await addItem(boardId, listName, uid, newCardText, color, -1);

        }catch(err){
           console.error(err)
           setError({message:`Error adding card with the following text to the database:`, message2: `"${newCardText}"`, message3:"Please refresh the page and try again.", details:err.message})
        }
        return
    }
    async function handleRemoveItem(itemId, lista, text){
        try{
            const listIndex = lists.findIndex(list => list.id === lista.id);
            const itemCardIndex = lists[listIndex].itemCards.findIndex(item => item.id === itemId);
            let newLists = [...lists];
            newLists[listIndex].itemCards.splice(itemCardIndex,1);
            setLists(newLists)
            await removeItem(boardId, lista.id, currentUser.uid, itemId);
        }catch(err){
          console.log(err)
          setError({message:`Error removing item with the following text from the database:`, message2: `"${text}"`, message3:"Please refresh the page and try again.", details:err.message})
        }
    }
    async function handleDragEnd(result){

        const {destination, source, draggableId} = result;

        if(!destination){ return } 
        if(destination.index === source.index && destination.droppableId === source.droppableId){ return }

        try{
            let tmpLists = [...lists];

            // find and remove the item from the source list's itemCards array
            const sourceListIndex = tmpLists.findIndex(list => list.id === source.droppableId);
            const sourceItemCardIndex = tmpLists[sourceListIndex].itemCards.findIndex(item => item.id === draggableId);
            const cardObj = tmpLists[sourceListIndex].itemCards.splice(sourceItemCardIndex, 1)[0];
            
            // add the item to the destination list's itemCards array
            const destinationListIndex = tmpLists.findIndex(list => list.id === destination.droppableId);
            tmpLists[destinationListIndex].itemCards.splice(destination.index, 0, cardObj)

            // optimistically update the lists-variable and perform the database operation
            setLists(tmpLists);
            await moveItem(boardId, source.droppableId, destination.droppableId, destination.index, currentUser.uid, draggableId);
        }catch(err){
            console.error(err);
            setError({message:`Error moving card from the list named ${source.droppableId} to the list named ${destination.droppableId}. Please refresh the page and try again.`, details:err.message})
        }
    }

  return (
    <div id='container'>
        <DragDropContext onDragEnd={handleDragEnd}>
                <div id="planke">
                    <PlankeSidebar editBoardNote={editBoardNote} setError={setError} boardDoc={boardDoc} boardId={boardId} boardName={boardName} boardVisitorUsername={boardVisitorUsername} demo={true} />
                        {lists?.map((doc)=>{
                            return(
                                <Liste liste={doc} boardId={boardId} key={doc.id} setError={setError} handleRemoveItem={handleRemoveItem} handleListRemoval={handleListRemoval} handleItemEdit={handleItemEdit} updateItemText={updateItemText} updateItemColor={updateItemColor} />
                            )
                        })}

                <div id='addListContainer'>
                    <Button 
                        variant='contained' 
                        onClick={()=>{setAddingList(true);}} 
                        id="addListButton"
                    >
                        Legg til liste
                    </Button>
                </div>
                
                </div>
            </DragDropContext>
            
            <ErrorDialog error={error} setError={setError} />
            <AddListDialog newListNameRef={newListNameRef} listeError={listeError} addingList={addingList} handleListAddition={handleListAddition} setLists={setLists} lists={lists} setAddingList={setAddingList} />
    </div>
  )
}