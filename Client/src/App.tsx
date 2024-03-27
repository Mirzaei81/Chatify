import { useEffect } from 'react'
import './App.css'
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useState,useCallback } from 'react';
import { IoArrowForward } from "react-icons/io5";
import toast, { Toast, Toaster } from 'react-hot-toast';

const wsURL = "ws://127.0.0.1:8000/ws/chat/lobby/"
function App() {

  //Public API that will echo messages sent to it back to the client
  const [socketUrl, setSocketUrl] = useState(wsURL);
  const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([]);
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    toast.error(connectionStatus);
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage]);

  const handleClickChangeSocketUrl = useCallback(
    () => setSocketUrl(wsURL),
    []
  );

  const handleClickSendMessage = useCallback(() => sendMessage('Hello'), []);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return (
    <div className=''>
      <Toaster/>
      <button onClick={handleClickChangeSocketUrl}>
        Click Me to change Socket Url
      </button>
      <button
      className='w-100% rounded-sm'
        onClick={handleClickSendMessage}
        disabled={readyState !== ReadyState.OPEN}
      >
        <IoArrowForward/>
      </button>
      <span>The WebSocket is currently {connectionStatus}</span>
      {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
      <ul>
        {messageHistory.map((message, idx) => (
          <span key={idx}>{message ? message.data : null}</span>
        ))}
      </ul>
    </div>
  );
};

export default App
