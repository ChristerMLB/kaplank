import React from 'react'
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext';
import { getUsername, editBoardNote, getBoardDoc, getLists, addList, moveItem, getItems, removeItem, addItem, removeList, updateItemColor, updateItemText } from '../db';
import Button from '@mui/material/Button';
import PlankeSidebar from './PlankeSidebar';
import AddListDialog from './AddListDialog';
import Liste from './Liste';
import ErrorDialog from './ErrorDialog';
import { DragDropContext } from 'react-beautiful-dnd';

export default function Planke() {
    let params = useParams();
    const boardName = params.board.replace("_", " ");
    const boardId = params.user+": "+boardName;

    const {currentUser} = useAuth();
    const newListNameRef = useRef();

    const [boardVisitorUsername, setBoardVisitorUsername ] = useState(null)
    const [boardDoc, setBoardDoc ] = useState(null);
    const [addingList, setAddingList ] = useState(false);
    const [lists, setLists ] = useState(null);
    const [listeError, setListeError] = useState(false)
    const [error, setError] = useState(false);
    
    const refreshTimerRef = useRef(null);
    const lastReloadRef = useRef(Date.now());
    const REFRESH_INTERVAL = 1800000; // 1800000ms = 30 minutter
    const THROTTLE_INTERVAL = 600000; // 600000ms = 10 minutter

    function handlePageRefresh(){
        const currentTime = Date.now();
        if( (currentTime - lastReloadRef.current) > THROTTLE_INTERVAL){
            window.location.reload();
        }
    }

    useEffect(()=>{
        function startRefreshTimer() {
            refreshTimerRef.current = setTimeout(handlePageRefresh, REFRESH_INTERVAL);
        };
        function resetRefreshTimer() {
            clearTimeout(refreshTimerRef.current);
            startRefreshTimer();
        }
        startRefreshTimer();
        window.addEventListener('focus', handlePageRefresh);

        return () => {
            clearTimeout(refreshTimerRef.current);
            window.removeEventListener('focus', resetRefreshTimer);
        };

    },[])
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
            setError({message: `Det skjedde noe feil når vi forsøkte å legge listen ${newListNameRef.current.value} til databasen, Vennligst last siden på nytt og forsøk igjen.`, details:err.message})
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
            setError({message:`Det skjedde noe galt da vi forsøkte å fjerne ${listName} fra databasen, vennligst last siden på nytt og forsøk igjen.`, details:err.message})
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
            let newCard = {text: newCardText, color:color, id:tmpId, newCard:true}; //HER?!
            newLists[listeIndex].itemCards.push(newCard);

            setLists(newLists)
            const newItemRef = await addItem(boardId, listName, uid, newCardText, color, -1);
            newCard = {...newCard, id:newItemRef.id};
            newLists[listeIndex].itemCards.splice(-1, 1, newCard);
            const newerLists = [...newLists];
            setLists(newerLists);

        }catch(err){
           console.error(err)
           setError({message:`Det skjedde noe galt da vi forsøkte å legge til lappen med følgende tekst i databasen:`, message2: `"${newCardText}"`, message3:"Vennlist last siden på nytt og forsøk igjen.", details:err.message})
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
          setError({message:`Det skjedde noe galt da vi forsøkte å fjerne lappen med den følgende teksten fra databasen:`, message2: `"${text}"`, message3:"Vennligst last siden på nytt og prøv igjen.", details:err.message})
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
            setError({message:`Det skjedde noe galt da vi forsøkte å flytte en lapp fra listen med navn ${source.droppableId} til listen med navn ${destination.droppableId}. Vennligst last siden på nytt og forsøk igjen.`, details:err.message})
        }
    }

  return (
    <div id='container'>
                <div id="planke">
                    <PlankeSidebar editBoardNote={editBoardNote} setError={setError} boardDoc={boardDoc} boardId={boardId} boardName={boardName} boardVisitorUsername={boardVisitorUsername} />
                    <DragDropContext onDragEnd={handleDragEnd}>
                        {lists?.map((doc)=>{
                            return(
                                <Liste liste={doc} boardId={boardId} key={doc.id} setError={setError} handleRemoveItem={handleRemoveItem} handleListRemoval={handleListRemoval} handleItemEdit={handleItemEdit} updateItemText={updateItemText} updateItemColor={updateItemColor} />
                            )
                        })}
                    </DragDropContext>

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
            
            <ErrorDialog error={error} setError={setError} />
            <AddListDialog newListNameRef={newListNameRef} listeError={listeError} addingList={addingList} handleListAddition={handleListAddition} setLists={setLists} lists={lists} setAddingList={setAddingList} />
    </div>
  )
}