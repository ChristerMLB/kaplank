export async function addBoard(uid, boardName, color){
    await setTimeout(()=>{return}, 1500);
    return
}
export async function getBoards(currentUser) {
    await setTimeout(()=>{return}, 1500);
    return
}
export async function getBoardDoc(boardId){
    await setTimeout(()=>{return}, 1500);
    return {
        "color": "#eeeeee",
        "listOrder": [],
        "name": "Demotavle",
        "boardNote": "Velkommen til demotavlen! Bruk den til å teste funksjonaliteten til Kaplank!, men ikke bruk den til noe viktig, siden ingenting faktisk blir lagret!",
        "users": [
          "0"
        ],
        "createdAt": {
          "seconds": 1685354964,
          "nanoseconds": 606000000
        },
        "historyCount": 0
      }
}
export async function deleteBoard(boardId){
    await setTimeout(()=>{return}, 1500);
    return
}
export async function getBoardCreator(boardId){
    await setTimeout(()=>{return}, 1500);
    return "Demobruker"
}
export async function editBoardNote(boardId, newNote, uid){
    await setTimeout(()=>{return}, 1500);
    return
}
export async function getBoardHistory(boardId){
    await setTimeout(()=>{return}, 1500);
    return ["I den fulle versjonen av appen, vil denne holde en liste over alt som har blitt gjort på tavlen."]
}
export async function getMoreHistory(boardId, pageCount){
    await setTimeout(()=>{return}, 1500);
    return {historyArr:[], count:0}
}
export async function addHistoryEntry(boardId, elementPara, changePara, uid){
    await setTimeout(()=>{return}, 1500);
    return
}
export async function getUsername(uid) {
    await setTimeout(()=>{return}, 1500);
    return "Demobruker"
}
export async function getUid(username) {
    await setTimeout(()=>{return}, 1500);
    return "1"
}
export async function userNameExists(username) {
    await setTimeout(()=>{return}, 1500);
    return false
}
export async function setUserName(uname, uid){
    await setTimeout(()=>{return}, 1500);
    return
}

export async function addList(boardId, listName, uid){
    await setTimeout(()=>{return}, 1500);
    return
}
export async function updateListOrder(boardId, listId, newIndex){
    await setTimeout(()=>{return}, 1500);
    return
}
export async function getLists(boardId){
    await setTimeout(()=>{return}, 1500);
    return []
}
export async function removeList(boardId, listName, uid){
    await setTimeout(()=>{return}, 1500);
    return
}
export async function moveItem(boardId, fromList, toList, toIndex, uid, itemId){
    await setTimeout(()=>{return}, 1500);
    return
}
export async function updateItemOrder(boardId, listId, newIndex, itemId){
    await setTimeout(()=>{return}, 1500);
    return
}
export async function addItem(boardId, listName, uid, itemText, itemColor, index){
    await setTimeout(()=>{return}, 1500);
    return
}
export async function removeItem(boardId, listName, uid, itemId){
    await setTimeout(()=>{return}, 1500);
    return
}
export async function getItems(boardId, listId){
    await setTimeout(()=>{return}, 1500);
    return []
}

export async function updateItemText(boardId, itemId, newText, uid){
    await setTimeout(()=>{return}, 1500);
    return
}
export async function updateItemColor(boardId, itemId, newColor, uid){
    await setTimeout(()=>{return}, 1500);
    return
}