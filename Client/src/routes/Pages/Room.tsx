import React, { useState,useRef,useCallback,useEffect, useContext } from "react"
import { IoArrowForward } from "react-icons/io5";
import useWebSocket, { ReadyState } from "react-use-websocket";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useTypedSupabaseQuery } from "@/utils/SupaBaseClient";
import { motion } from "framer-motion";
import useWindowDimensions from "@/utils/useDimensions";
import { UserCTX } from "../App";
import "./Room.css"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { IMessage } from "types/util";
import useMessageSearch from "@/utils/useMessageSearch";
import { createMessages } from "@/utils/CreateMessages";

export interface IRoom{
  SideBarShown:boolean
}

const Variants={
  open:(WindowsWidth:number)=>({
    width:`${WindowsWidth-Number(import.meta.env.VITE_WIDTH_SIDEBAR)}px`,
    marginLeft:`${Number(import.meta.env.VITE_WIDTH_SIDEBAR)}px`,
  }),
  closed:{
    width:"100vw",
    marginLeft:"0",
    transition:{
      delay: .6
    }
  }
}

const InputVariants={
  open:(WindowsWidth:number)=>({
    width:`${WindowsWidth-Number(import.meta.env.VITE_WIDTH_SIDEBAR)}px`,
  }),
  closed:{
    width:"100vw",
    marginLeft:"0",
    transition:{
      delay: .6
    }
  }
}
//Public API that will echo messages sent to it back to the client
let wsURL = "ws://127.0.0.1:8000/ws/chat/"
export default function Room(props:IRoom){
  const [val, setVal] = useState("")
  const [roomName,setRoomname] = useState("")
  const [pageNumber,setPageNumber] = useState(1)
  const {isLoading,err,messages} = useMessageSearch(pageNumber)

  const User = useContext(UserCTX)
  const dimention = useWindowDimensions()
  const RoomParam = useParams()
  const lastElm = useRef<HTMLLIElement>(null)

  const [socketUrl, setSocketUrl] = useState(wsURL);
  const [messageHistory, setMessageHistory] = useState<IMessage[]>([]);

  const { data: messages } = useTypedSupabaseQuery((supabase) =>
      supabase.rpc("get_messages_by_room_name",
      { room_name: roomName}).,DefaultMessageCount*pageNumber),
      {enabled:(roomName!==""&&messageHistory.length!==0)}
  )

  const InputRef = useRef<HTMLDivElement>(null)
  useEffect(()=>{
        const room = (RoomParam.RoomName)?RoomParam.RoomName:"لابی"
        console.log(room)
        setRoomname(room!.replace(" ",""))
        document.title = room!
        setSocketUrl(wsURL+room+"/")
        if (messages){
          console.log(messages)
          setMessageHistory((prev)=>messages.concat(prev))
        }
  },[RoomParam])

  const { sendMessage, lastMessage, readyState } = useWebSocket(
  socketUrl,{
      onOpen: () => {toast.success("Connected", { icon: "🔥" })},
      onError: () => {toast.error("Failed!", { icon: "😕" })},
      queryParams: {
        room_name:roomName,
        user_name:User?User!.user_metadata.name:""
      }
  },(User!==null && roomName!==""));

  const focusInput = () => {
    if (InputRef.current) {
      InputRef.current.focus();
    }
  };

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  useEffect(() => {
    focusInput();
    if (lastMessage !== null) {
      const message = JSON.parse(lastMessage.data)
      if(message.type == "Notice"){
        const user = message.message.replace("%20"," ")
        if (user === User?.user_metadata.full_name) {
          toast(() => (
            <span className="w-full text-black" dir="rtl">
              خوش آمدی {message.message.replace("%20", " ")} 👋👋
            </span>
          ), { position: "top-center" })
        }
        else {
          toast(() => (
            <span className="w-full text-black" dir="rtl">
              {message.message.replace("%20", " ")} به اتاق پیوست ! 👋
            </span>
          ), { position: "top-center" })
        }
      }
      else if(message.type == "message"){
        const Msg:IMessage =
        {author: message!.author, message_body: message!.message,url:message.url,created_at:Date.now().toString() }
        setMessageHistory((prev) => prev.concat(Msg));
      }
      }
  }, [lastMessage]);
  useEffect(()=>{
      if(messageHistory.length===0){
        const messages =  createMessages(100)
        setMessageHistory((prev) => prev.concat(messages));
        console.log(messages)
      }
  },[])

  const handleInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter") {
      if (readyState == ReadyState.OPEN) {
        handleClickSendMessage()
      }
    }
  }
  const handleClickSendMessage = useCallback(() => {
  console.log(User?.user_metadata)
    if (val !== "") {
      sendMessage(
        JSON.stringify({
          'user_id':User?.user_metadata.name,
          'message': val,
          'url':User?.user_metadata.avatar_url
        })
      )
      setVal("")
    }
  }, [val]);
  const ChatHeight = dimention.height - InputRef.current?.offsetHeight! - Number(import.meta.env.VITE_HEIGHT_MAINNAV)
  
  return (
    <div className="flex w-screen  bg-zinc-950 h-full flex-col" style={{ overflow: "hidden",height:ChatHeight! }}>
      <div className="bg-grey-200 grow overflow-y-auto overflow-x-hidden  rounded">
        <motion.div 
          animate={props.SideBarShown ? "open" : "closed"}
          custom={dimention}
          variants={Variants}
          initial={false}
          className="m-2 p-2 h-full  rounded bg-night-600">
          <ul className="flex flex-col overflow-y-clip">
            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {messageHistory.length!==0 && messageHistory.map((message, idx) => 
                <li ref={lastElm} key={idx} className="m-2 flex flex-row  items-cente">
                  <Avatar className="" >
                    <AvatarImage className="block w-8 h-8 " style={{ borderRadius: "50%", objectFit: "scale-down" }} src={message.url!} />
                    <AvatarFallback style={{ borderRadius: "50%" }}
                      className="bg-muted p-2 text-primary">{message.author[0].toUpperCase()}{message.author[1]}</AvatarFallback>
                  </Avatar>
                  <div id="Messages" className="bg-sky-950 text-card-foreground m-2
              rounded w-fit p-2" key={idx}>{message.message_body!}
                  </div>
                </li>
            )}
          </ul>
        </motion.div>
      </div>
      <motion.div 
        animate={props.SideBarShown ? "open" : "closed"}
        custom={dimention.width}
        variants={Variants}
        initial={false}
        ref={InputRef}
        className="bottom-0 bg-card absolute h-1/7 ">
        <motion.div
        animate={props.SideBarShown ? "open" : "closed"}
        custom={dimention.width}
        initial={false}
            variants={InputVariants}
          className="flex items-center content-center h-28" >
          <input 
            className="grow px-2 mx-2 h-16 rounded-lg"
            placeholder={`Send Message to ${connectionStatus}`}
            value={val} onKeyDown={handleInput} onChange={e => setVal(e.target.value)} />
          <button
            className="border-white  hover:border-2 mr-10  p-2 w-14 h-14 flex items-center justify-center"
            style={{borderRadius:"50%"}}
            onClick={handleClickSendMessage}
            disabled={readyState !== ReadyState.OPEN}
          >
            <IoArrowForward className="" />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
