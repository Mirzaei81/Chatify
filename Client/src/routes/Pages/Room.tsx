import React, { useState, useRef, useCallback, useEffect, useContext } from "react"
import { IoArrowForward } from "react-icons/io5";
import useWebSocket, { ReadyState } from "react-use-websocket";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import useWindowDimensions from "@/utils/useDimensions";
import { UserCTX } from "../App";
import "./Room.css"
import { IMessage } from "types/util";
import useMessageSearch from "@/utils/useMessageSearch";
import { createMessages } from "@/utils/CreateMessages";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import InfiniteScroll from "react-infinite-scroll-component";

export interface IRoom {
  SideBarShown: boolean
}


const Variants = {
  open: (WindowsWidth: number) => ({
    width: `${WindowsWidth - Number(import.meta.env.VITE_WIDTH_SIDEBAR)}px`,
    marginLeft: `${Number(import.meta.env.VITE_WIDTH_SIDEBAR)}px`,
  }),
  closed: {
    width: "100vw",
    marginLeft: "0",
    transition: {
      delay: .6
    }
  }
}

const InputVariants = {
  open: (WindowsWidth: number) => ({
    width: `${WindowsWidth - Number(import.meta.env.VITE_WIDTH_SIDEBAR)}px`,
  }),
  closed: {
    width: "100vw",
    marginLeft: "0",
    transition: {
      delay: .6
    }
  }
}
//Public API that will echo messages sent to it back to the client
let wsURL = "ws://127.0.0.1:8000/ws/chat/"
export default function Room(props: IRoom) {
  const [val, setVal] = useState("")
  const [roomName, setRoomname] = useState("")
  const [pageNumber, setPageNumber] = useState(1)
  const { isLoading, err, messages, hasMore } = useMessageSearch(roomName, pageNumber)


  const User = useContext(UserCTX)
  const dimention = useWindowDimensions()
  const RoomParam = useParams()

  const MessageCol = useRef<HTMLUListElement>(null)
  const TopElement = useRef<HTMLLIElement>(null)
  const observer = useRef<IntersectionObserver>()

  const loadMessage = useCallback((e: HTMLLIElement) => {
    if (isLoading) return
//    if (observer.current) observer.current.disconnect()
//    observer.current = new IntersectionObserver(entries => {
//      if (entries[0].isIntersecting ) {
//        console.log("has More")
//      }
//    })
//    if (e) observer.current.observe(e)
  }, [])

  const [socketUrl, setSocketUrl] = useState(wsURL);
  const [messageHistory, setMessageHistory] = useState<IMessage[]>([]);


  const InputRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const room = (RoomParam.RoomName) ? RoomParam.RoomName : "لابی"
    setRoomname(room!.replace(" ", ""))
    document.title = room!
    setSocketUrl(wsURL + room + "/")
    if (messages) {
      setMessageHistory((prev) => prev.concat(messages))
    }
  }, [RoomParam])

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    socketUrl, {
    onOpen: () => { toast.success("Connected", { icon: "🔥" }) },
    onError: () => { toast.error("Failed!", { icon: "😕" }) },
    queryParams: {
      room_name: roomName,
      user_name: User ? User!.user_metadata.name : ""
    }
  }, (User !== null && roomName !== ""));

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
 const focouseBottomElement = () =>{
   if(MessageCol.current){
   MessageCol.current.scroll({
    top:MessageCol.current.scrollHeight,
    behavior:"smooth",
    left:0
   })
   console.log(MessageCol.current.scrollHeight)
   }
 }
  useEffect(() => {
    focusInput();
    if (lastMessage !== null) {
      const message = JSON.parse(lastMessage.data)
      if (message.type == "Notice") {
        const user = message.message.replace("%20", " ")
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
      else if (message.type == "message") {
        const Msg: IMessage ={ author: message!.author, message_body: message!.message,
          url: message.url, created_at: Date.now().toString() }
        setMessageHistory((prev) => prev.concat(Msg));
      }
    }
        focouseBottomElement()
  }, [lastMessage]);
  //testing the Messages mocking
  useEffect(() => {
    setMessageHistory([])
    if (messageHistory.length === 0) {
      const messages = createMessages(100)
      setMessageHistory(messages);
    }

    if(MessageCol) MessageCol.current?.scrollIntoView({
      block:"end",
      behavior:"auto"

    })
    focouseBottomElement()
   console.log(MessageCol.current?.scrollHeight)
  }, [MessageCol])

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
          'user_id': User?.user_metadata.name,
          'message': val,
          'url': User?.user_metadata.avatar_url
        })
      )
      setVal("")
    }
  }, [val]);

  const ChatHeight = dimention.height - InputRef.current?.offsetHeight! - Number(import.meta.env.VITE_HEIGHT_MAINNAV)

  return (
    <div className="flex w-screen  bg-zinc-950 h-full flex-col" style={{ overflow: "hidden", height: ChatHeight?ChatHeight:"100vh" }}>
      <div className="bg-grey-200 grow overflow-y-auto overflow-x-hidden  rounded">
        <motion.div
          animate={props.SideBarShown ? "open" : "closed"}
          custom={dimention}
          variants={Variants}
          initial={false}
          className="m-2 p-2 h-full  rounded bg-night-600">
          <div
            id="scrollableDiv"
            style={{
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column-reverse',
            }}
          >
            {/*Put the scroll bar always on the bottom*/}
            <InfiniteScroll
              dataLength={length}
              next={()=>setPageNumber(pageNumber+1)}
              style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
              inverse={true} //
              hasMore={true}
              loader={<h4>Loading...</h4>}
              scrollableTarget="scrollableDiv"
            >
              {messageHistory.map((msg, index) => (
                <li key={index} className="m-2 flex flex-row  items-center"> <Avatar className="" >
                    <AvatarImage className="block w-8 h-8 " style={{ borderRadius: "50%", objectFit: "scale-down" }} src={msg.url!} />
                    <AvatarFallback style={{ borderRadius: "50%" }}
                      className="bg-muted p-2 text-primary">{msg.author[0].toUpperCase()}{msg.author[1]}</AvatarFallback>
                  </Avatar>
                  <div id="Messages" className="bg-sky-950 text-card-foreground m-2
            rounded w-fit p-2">{msg.message_body!} TopElement
                  </div>
                </li>
              ))}
            </InfiniteScroll>
          </div>
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
            style={{ borderRadius: "50%" }}
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
