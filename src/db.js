import { app } from "./firebase";
import { getFirestore, updateDoc, orderBy, collection, getDocs, query, where, getDoc, doc, deleteDoc, addDoc, serverTimestamp, setDoc, limit, runTransaction} from 'firebase/firestore/lite';

const db = getFirestore(app);

export async function addBoard(uid, boardName, color){
    try{
        const docRef = doc(db, "planks", await getUsername(uid)+": "+boardName);
        const newBoard = {
            name: boardName,
            users: [uid],
            color: color,
            boardNote: "Dette er tavlenotatet, du kan redigere det og erstatte denne teksten med noen detaljer om tavlen.",
            listOrder: [],
            createdAt: serverTimestamp(),
            historyCount: 0,
        };

        await setDoc(docRef, newBoard);
        const username = await getUsername(uid);
        const boardId = username+": "+boardName;
        addHistoryEntry(boardId, "denne tavlen", "opprettet", uid);

    }catch(err){
        throw new Error(err);
    }
}
export async function getBoards(currentUser) {
    try{
        const boardsCol = collection(db, 'planks');
        const q = query(boardsCol, where('users', 'array-contains', currentUser.uid), orderBy('createdAt', 'asc'));
        const boardsSnapshot = await getDocs(q);
        const boardsList = await boardsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return boardsList;
    }catch(err){
        throw new Error(err);
    }
}
export async function getBoardDoc(boardId){
    try{
        const boardsCol = collection(db, 'planks');
        const board = await getDoc(doc(boardsCol, boardId));
        const boardDoc = board.data();
        return boardDoc
    }catch(err){
        throw new Error(err);
    }
}
export async function deleteBoard(boardId){
    try {
        const docref = doc(db, "planks", boardId);
        await deleteDoc(docref);
    } catch(err){
        throw new Error(err);
    }
}
export async function getBoardCreator(boardId){
    try{
        const boardsCol = collection(db, 'planks');
        const board = await getDoc(doc(boardsCol, boardId));
        const creator = board.data().users[0];
        return creator
    }catch(err){
        throw new Error(err);
    }
}
export async function editBoardNote(boardId, newNote, uid){
    const boardDocRef = doc(db, "planks", boardId);
    try{
        await runTransaction(db, async (transaction) => {
            transaction.update(boardDocRef, { boardNote: newNote });
        });
        await addHistoryEntry(boardId, newNote, `endret tavlenotatet til `, uid);
    }catch(err){
        throw new Error(err);
    }
}

export async function getBoardHistory(boardId){

    const historyQuery = query(
        collection(db, `planks/${boardId}/history`), 
        orderBy('timestamp', 'desc'), 
        limit(8)
    );

    const historyCollection = await getDocs(historyQuery);

    const historyArr = historyCollection.docs.map(function(doc) {
        const data = doc.data();
        const time = data.timestamp.toDate().toLocaleString("no-NO", {dateStyle:"full", timeStyle:"short", hour12:false});
        return `${time}:\n${data.user} ${data.change} ${data.element}`
      })
    return historyArr
}
async function getHistoryCount(boardId){
    try{
        const boardDoc = await getBoardDoc(boardId);
        return boardDoc.historyCount;
    }catch(err){
        throw new Error(err);
    }

}
export async function getMoreHistory(boardId, pageCount){

    const endIndex = pageCount*8+8;

    const historyQuery = query(
        collection(db, `planks/${boardId}/history`), 
        orderBy('timestamp', 'desc'),
        limit(endIndex)
    )

    try{   
        const count = await getHistoryCount(boardId);
        const historyCollection = await getDocs(historyQuery);
            const historyArr = historyCollection.docs.map(function(doc) {
                const data = doc.data();
                const time = data.timestamp.toDate().toLocaleString("en-US", {dateStyle:"full", timeStyle:"short", hour12:false});
                return `${time}:\n${data.user} ${data.change} ${data.element}`
            })
            return {historyArr, count}
    }catch(err){
        throw new Error(err);
    }
}
export async function addHistoryEntry(boardId, elementPara, changePara, uid){
    const boardDocRef = doc(db, "planks", boardId);
    const historyRef = collection(db, `planks/${boardDocRef.id}/history`);

    try{
        const username = await getUsername(uid);

        await addDoc(historyRef, {
            element: elementPara,
            change: changePara,
            user: username,
            timestamp: serverTimestamp()
        });
        
        await runTransaction(db, async (transaction) => {
            const boardSnapshot = await transaction.get(boardDocRef);
            const historyCount = boardSnapshot.data().historyCount || 0;
            const updatedCount = historyCount + 1;
            transaction.update(boardDocRef, { historyCount: updatedCount });
        });

    }catch(err){
        throw new Error(err);
    }
}

export async function getUsername(uid) {
    try{
        const usersCollection = collection(db, 'users')
        const userDoc = await getDoc(doc(usersCollection, uid));
        return userDoc.data().username;

    }catch(err){
        throw new Error(err);
    }
}
export async function getUid(username) {
    try{
        const usersCollection = collection(db, 'users')
        const q = query(usersCollection, where('username', '==', username));
        const usersSnapshot = await getDocs(q);
        if (!usersSnapshot.empty){return usersSnapshot.docs[0].id }
        console.error(`Kunne ikke finne noen bruker med brukernavnet "${username}"`)
    }catch(err){
        throw new Error(err);
    }
}
export async function userNameExists(username) {
    try{
        const usersCollection = collection(db, 'users')
        const q = query(usersCollection, where('username', '==', username));
        const usersSnapshot = await getDocs(q);
        if (usersSnapshot.empty){
            return false
        }else{ 
            return true
        }
    }catch(err){
        throw new Error(err);
    } 
}
export async function setUserName(uname, uid){
    return await setDoc(
        doc(db, "users", uid), { 
            username: uname
        }
    );
    
}

export async function addList(boardId, listName, uid){
    try{
        const docRef = doc(db, "planks", boardId, "lists", listName);
        const newList = {
            name: listName,
            itemsOrder: [],
        };
        await setDoc(docRef, newList)
        await updateListOrder(boardId, listName, -1)
        await addHistoryEntry(boardId, 'listen "'+listName+'"', "opprettet", uid);
        
    }catch(err){
        throw new Error(err);
    }
}
export async function updateListOrder(boardId, listId, newIndex){
    const boardRef = doc(db, "planks", boardId);
    try{
        const boardSnap = await getDoc(boardRef);
        const boardData = boardSnap.data();
        const listOrder = boardData.listOrder;
        if(newIndex === -1){
            listOrder.push(listId)
        }else{
            listOrder.splice(newIndex, 0, listId)
        }
        await updateDoc(boardRef, {listOrder} )
    }catch(err){
        throw new Error(err);
    }
}
export async function getLists(boardId){
    const boardDoc = await getBoardDoc(boardId);
    const listsCol = collection(db, 'planks', boardId, "lists");
    let listsSnapshot = await getDocs(listsCol);
    let listsDocs = listsSnapshot.docs;
    listsDocs.sort((a, b) => {
        const aIndex = boardDoc.listOrder.indexOf(a.id);
        const bIndex = boardDoc.listOrder.indexOf(b.id);
        return aIndex - bIndex;
      });
    return listsDocs
}
export async function removeList(boardId, listName, uid){
    try {
        const docref = doc(db, "planks", boardId, "lists", listName);
        await deleteDoc(docref);
        await addHistoryEntry(boardId, 'listen "'+listName+'"', "fjernet", uid);
    } catch(err){
        throw new Error(err);
    }
}

export async function moveItem(boardId, fromList, toList, toIndex, uid, itemId){
    const boardRef = doc(db, "planks", boardId, "lists", toList);
    try{
        await runTransaction(db, async (transaction)=>{
            const fromListRef = doc(db, "planks", boardId, "lists", fromList);
            const listSnap = await transaction.get(fromListRef);
            const boardSnap = await transaction.get(boardRef);
            const listData = listSnap.data();
            const itemsOrder = listData.itemsOrder;
            itemsOrder.splice(itemsOrder.indexOf(itemId), 1);
            await transaction.update(fromListRef, {itemsOrder} );
            await updateItemOrder(boardId, toList, toIndex, itemId, transaction, boardSnap, boardRef);
        })
        await addHistoryEntry(boardId, 'en lapp fra listen "'+fromList+'" til listen "'+toList+'"', "flyttet", uid);

    }catch(err){
        throw new Error("Fikk ikke flyttet lappen: " + err.message);
    }
    return
}
export async function updateItemOrder(boardId, listId, newIndex, itemId, transaction = null, boardSnap=null, boardRef=null){

    if(transaction!==null){
        const boardData = boardSnap?.data();
        const itemsOrder = boardData?.itemsOrder;
        if(newIndex === -1){
            itemsOrder.push(itemId)
        }else{
            itemsOrder.splice(newIndex, 0, itemId)
        }
        transaction.update(boardRef, {itemsOrder} )
    }else{
        await runTransaction(db, async (transaction)=>{
            boardRef = doc(db, "planks", boardId, "lists", listId);
            boardSnap = await transaction.get(boardRef);
            const boardData = boardSnap.data();
            const itemsOrder = boardData.itemsOrder;
            if(newIndex === -1){
                itemsOrder.push(itemId)
            }else{
                itemsOrder.splice(newIndex, 0, itemId)
            }
            transaction.update(boardRef, {itemsOrder} )
        });
    }

}

export async function addItem(boardId, listName, uid, itemText, itemColor, index){
    try{
        const collectionRef = collection(db, "planks", boardId, "items");
        const newItem = {
            text: itemText,
            color: itemColor,
        };
        const itemRef = doc(collectionRef);
        await runTransaction(db, async (transaction)=>{
            transaction.set(itemRef, newItem);
            await updateItemOrder(boardId, listName, index, itemRef.id)
            await addHistoryEntry(boardId, 'en lapp med følgende tekst: "'+itemText+'" til listen "'+listName+'"', "la til", uid);
        })
        return itemRef;
        
    }catch(err){
        throw new Error(err);
    }
}
export async function removeItem(boardId, listName, uid, itemId){
    try {
        const docref = doc(db, "planks", boardId, "items", itemId);
        await deleteDoc(docref);
        await addHistoryEntry(boardId, 'en lapp fra listen "'+listName+'"', "fjernet", uid);
    } catch(err){
        throw new Error(err);
    }
}
export async function getItems(boardId, listId){

    const listDocRef = doc(db, "planks", boardId, "lists", listId)
    const listDocSnapshot = await getDoc(listDocRef);
    const listDoc = listDocSnapshot.data();

    const itemsColl = collection(db, 'planks', boardId, "items");
    let itemsSnapshot = await getDocs(itemsColl);
    let itemsDocs = itemsSnapshot.docs.filter((item)=>listDoc.itemsOrder.includes(item.id));

    itemsDocs.sort((a, b) => {
        const aIndex = listDoc.itemsOrder.indexOf(a.id);
        const bIndex = listDoc.itemsOrder.indexOf(b.id);
        return aIndex - bIndex;
      });

      const returArray = itemsDocs.map((item)=> {
        const id = item.id;
        const dataObject = item.data();
        return { id: id,...dataObject };
      })

    return returArray
}

export async function updateItemText(boardId, itemId, newText, uid){
    const itemDocRef = doc(db, "planks", boardId, "items", itemId);
    try{
        await runTransaction(db, async (transaction) => {
            transaction.update(itemDocRef, { text: newText });
        });
        await addHistoryEntry(boardId, newText, `endret teksten på en lapp til `, uid);
    }catch(err){
        throw new Error(err);
    }
}
export async function updateItemColor(boardId, itemId, newColor, uid){
    const itemDocRef = doc(db, "planks", boardId, "items", itemId);
    try{
        await runTransaction(db, async (transaction) => {
            transaction.update(itemDocRef, { color: newColor });
        });
        await addHistoryEntry(boardId, newColor, `endret fargen på en lapp til `, uid);
    }catch(err){
        throw new Error(err);
    }
}