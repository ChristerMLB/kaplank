import React, {useState, useEffect, useRef, useCallback} from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getBoardHistory, getMoreHistory } from '../db'

export default function BoardHistory(props) {

    const [boardHistory, setBoardHistory] = useState([]);
    const [historyCount, setHistoryCount ] = useState(1000);
    const { boardId } = props;
    let pageCountRef = useRef(1);
    const historyContainerRef = useRef(null);
    const isThrottled = useRef(false);
    
    const LoadMoreHistory = useCallback(async () => {
          const moreHistory = await getMoreHistory(boardId, pageCountRef.current);
          setBoardHistory(moreHistory.historyArr);
          setHistoryCount(moreHistory.count);
          pageCountRef.current ++;
    }, [boardId]);

    async function handleExpand(e, expanded){
      if(expanded && pageCountRef.current === 1){
        await LoadMoreHistory();
      }
    }

    useEffect(() => {
      async function fetchBoardHistory() {
        const history = await getBoardHistory(boardId);
        setBoardHistory(history);
      }
        fetchBoardHistory();
    }, [boardId]);

    useEffect(() => {
        const container = historyContainerRef.current;
        function handleScroll(){
            if(!isThrottled.current && historyCount > boardHistory.length){
              const { scrollTop, scrollHeight, clientHeight } = container;
              if (scrollTop + clientHeight >= scrollHeight - 100) { LoadMoreHistory();}
              isThrottled.current = true;
            }
            setTimeout(()=> isThrottled.current = false, 300);
            if(historyCount === boardHistory.length){ container && container.removeEventListener('scroll', handleScroll);}

        }
        container && container.addEventListener('scroll', handleScroll);

        return () => {
          container && container.removeEventListener('scroll', handleScroll);
        };
      }, [LoadMoreHistory, boardHistory, historyCount]);

  return (
    <div id='boardHistory' sx={{zIndex: 998,margin:"20px"}}>
      <Accordion elevation={0} onChange={handleExpand}>
          <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
          >
          <Typography>Tavlehistorie</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{maxHeight:"30em",overflowY:"scroll"}} id="history" ref={historyContainerRef}>
                  {boardHistory && boardHistory
                      .map((historicalEvent, i)=>{
                          return(<p key={historicalEvent+i}>{historicalEvent}</p>)
                      })
                  }
          </AccordionDetails>
      </Accordion>
    </div>
  )
}
