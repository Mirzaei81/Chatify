import { useEffect,useRef } from 'react'
import './App.css'
import { useState,useCallback } from 'react';
import { IoArrowForward } from "react-icons/io5";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import toast from 'react-hot-toast';


  //Public API that will echo messages sent to it back to the client
let wsURL = "ws://127.0.0.1:8000/ws/chat/lobby/"

function App() {
  const [val,setVal] =useState("")
  const [socketUrl, setSocketUrl] = useState(wsURL);
  const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([]);
  const {sendMessage,lastMessage, readyState} = useWebSocket(socketUrl);
  
  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  const stateChanged = ()=>{
    return new Promise((resolve,reject)=>{
      const intervalId = setInterval(() => {
        if (readyState === ReadyState.OPEN) {
          clearInterval(intervalId); // Stop the interval
          resolve(readyState);
          console.log(readyState);
        } else if (readyState === ReadyState.CLOSED) {
          clearInterval(intervalId); // Stop the interval
          reject(readyState);
          console.log(readyState);
        }
      },1000);
    })
  }

  useEffect(() => {
    toast.promise(
      stateChanged(),
      {
        loading:"Connecting...",
        success:<b>Connected</b>,
        error:<b>Failed</b>
      },
      {
        success: {
          duration: 5000,
          icon: '🔥',
        },
        error: {
          duration: 5000,
          icon: '😕',
        },
    }
    )
    
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage!));
    }
  }, [lastMessage]);

  const handleClickChangeSocketUrl = useCallback(
    () => setSocketUrl(wsURL),
    []
  );

  const handleClickSendMessage = useCallback(()=>sendMessage(val), []);

  return (
    <div className='flex min-h-screen flex-col'>
      <div className='bg-white grow h-full rounded'>
        {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
        <ul>
          {messageHistory.map((message, idx) => (
            <span key={idx}>{message ? message.data : null}</span>
          ))}
        </ul>
      </div>
      <div className='flex-end bg- '>

        <div className='flex mb-2 w-screen  mr-2 bottom-0 fixed'>
          <input className='grow rounded-lg' value={val} onChange={(e) => setVal(e.target.value)} />
          <button
            className='rounded-lg '
            onClick={handleClickSendMessage}
            disabled={readyState !== ReadyState.OPEN }
          >
            <IoArrowForward className='' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default App
