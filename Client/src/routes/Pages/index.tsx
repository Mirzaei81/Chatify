import { useEffect, useRef } from "react"
import { useState, useCallback } from "react";

import { IoArrowForward } from "react-icons/io5";
import useWebSocket, { ReadyState } from "react-use-websocket";
import toast from "react-hot-toast";


//Public API that will echo messages sent to it back to the client
let wsURL = "ws://127.0.0.1:8000/ws/chat/lobby/"

export default function Index(){
  let promiseResolve:(value: string) => void, promiseReject:(value:string) => void;
  const [val, setVal] = useState("")
  const [socketUrl, setSocketUrl] = useState(wsURL);
  const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([]);
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl,{
   onOpen: ()=>toast.success("Connected",{icon:"🔥"}),
   onError:()=>toast.error("Failed!",{icon:"😕"})
  });
  const InputRef = useRef<HTMLInputElement>(null)
  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const focusInput = () => {
    if (InputRef.current) {
      InputRef.current.focus();
    }
  };

  useEffect(() => {
    focusInput();
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(JSON.parse(lastMessage.data).message));
      console.log(messageHistory)
      }
  }, [lastMessage]);

  const handleClickChangeSocketUrl = useCallback(
    () => setSocketUrl(wsURL),
    []
  );
  const handleInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter") {
      if (readyState == ReadyState.OPEN) {
        handleClickSendMessage()
      }
    }
  }
  const handleClickSendMessage = useCallback(() => {
    if (val !== "") {
      sendMessage(
        JSON.stringify({
          'user':crypto.randomUUID(),
          'message': val,
        })
      )
      setVal("")
    }
  }, [val]);

  return (
    <div className="flex bg-french_gray-200 min-h-screen flex-col">
      <div className="bg-grey-200 grow  rounded">
        <div className="m-2  p-2 h-full rounded bg-night-600">
          {lastMessage ? <span>{JSON.parse(lastMessage.data).message}</span> : null}
          <ul className="flex flex-col">
            {messageHistory.map((message, idx) => (
              <span id="Messages" className="" key={idx}>{message}</span>
            ))}
          </ul>
        </div>
      </div>
      <div className=" p-2 bottom-0 fixed h-1/7 ">
        <div className="flex  w-screen h-2/5 ">
          <input ref={(el) => { InputRef.current = el }} className="grow px-2 mx-2 rounded-lg"
            placeholder={`Send Message to ${connectionStatus}`}
            value={val} onKeyDown={handleInput} onChange={e => setVal(e.target.value)} />
          <button
            className="rounded-lg mr-10"
            onClick={handleClickSendMessage}
            disabled={readyState !== ReadyState.OPEN}
          >
            <IoArrowForward className="" />
          </button>
        </div>
      </div>
    </div>
  );
}
