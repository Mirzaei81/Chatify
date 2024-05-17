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
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import InfiniteScroll from "react-infinite-scroll-component";
import { Variants, InputVariants } from "@/utils/variants";
import { Spinner } from "@/components/ui/spinner";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/ContextMenu"
import { FaEdit, FaTrash } from "react-icons/fa";
import { supabaseClient } from "@/main";
import EditMessage from "@/components/ui/EditMessage";

export interface IRoom {
  SideBarShown: boolean
}
interface SelectedMessage {
  body: string, author: string,
  open: boolean, setOpen: (val: boolean) => void,
  setChange: (val: string, idx: number) => void, idx: number
}
//Public API that will echo messages sent to it back to the client
let wsURL = "ws://127.0.0.1:8000/ws/chat/"

export default function Room(props: IRoom) {
  const [val, setVal] = useState("")
  const [roomName, setRoomname] = useState("")
  const [pageNumber, setPageNumber] = useState(1)
  const { messages, hasMore } = useMessageSearch(roomName, pageNumber)
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [body, setBody] = useState("")
  const [author, setAuthor] = useState("")
  const [idx, setIdx] = useState(-1)

  const User = useContext(UserCTX)
  const dimention = useWindowDimensions()
  const RoomParam = useParams()

  const [socketUrl, setSocketUrl] = useState(wsURL);
  const [messageHistory, setMessageHistory] = useState<IMessage[]>([]);

  const InputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const room = (RoomParam.RoomName) ? RoomParam.RoomName : "لابی"
    setRoomname(room!)
    document.title = room!.replace(" ", "")
    setSocketUrl(wsURL + room + "/")
    if (messages) {
      setMessageHistory((prev) => prev.concat(messages))
    }
  }, [RoomParam])
  let user_name: string | null = User?.user_metadata.name ? User?.user_metadata.name : User?.user_metadata.user_name

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    socketUrl, {
    onOpen: () => { toast.success("Connected", { icon: "🔥" }), setLoading(true) },
    onError: () => { toast.error("Failed!", { icon: "😕" }) },
    queryParams: {
      room_name: roomName,
      user_name: user_name!
    }
  }, (user_name !== undefined && user_name !== "" && roomName !== ""));


  const connectionStatus = {
    [ReadyState.CONNECTING]: "در حال تاال 🔄",
    [ReadyState.OPEN]: " متصل شدی ✓",
    [ReadyState.CLOSING]: "",
    [ReadyState.CLOSED]: "بسته است ❌",
    [ReadyState.UNINSTANTIATED]: " درحتل انصال □",
  }[readyState];

  useEffect(() => {
    if (lastMessage !== null) {
      const message = JSON.parse(lastMessage.data)
      if (message.type == "Notice") {
        const user = message.message.replaceAll("%20", " ")
        if (user.trim() === user_name?.trim()) {
          toast(() => (
            <span className="w-full text-black" dir="rtl">
              خوش آمدی {user} 👋👋
            </span>
          ), { position: "top-center" })
        }
        else {
          toast(() => (
            <span className="w-full text-black" dir="rtl">
              {user} به اتاق پیوست ! 👋
            </span>
          ), { position: "top-center" })
        }
      }
      else if (message.type == 'init') {
        setMessageHistory(message.data)
        setLoading(false)
      }
      else if (message.type == "message") {
        const Msg: IMessage = {
          author: message!.author, message_body: message!.message_body,
          url: message.url, created_at: Date.now().toString()
        }
        if (Msg.author !== user_name) {
          setMessageHistory((prev) => [Msg].concat(prev));
        }
      }
    }
  }, [lastMessage]);


  const changeOpen = (val: boolean) => {
    console.log(val)
    setDialogOpen(false)
  }

  const changeMessage = (newBody: string) => {
    console.log(newBody)
    let msgCopy = messageHistory.slice()
    msgCopy[idx].message_body = newBody
    setMessageHistory(msgCopy)
  }


  const handleInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter") {
      if (readyState == ReadyState.OPEN) {
        handleClickSendMessage()
      }
    }
  }
  const removeMessage = (idx: number, body: string) => {
    let historyCopy = [...messageHistory]
    historyCopy.splice(idx, 1)
    setMessageHistory(historyCopy)
    supabaseClient.from("messages").delete().eq("body", body)
  }
  const handleClickSendMessage = useCallback(() => {
    if (val !== "") {
      const CurrentMessage: IMessage = {
        'author': user_name!,
        'message_body': val,
        'url': User?.user_metadata.avatar_url ? User?.user_metadata.avatar_url : "",
        created_at: Date.now().toString()
      }
      setMessageHistory((prev) => [CurrentMessage].concat(prev))
      sendMessage(
        JSON.stringify(CurrentMessage)
      )
      setVal("")
    }
  }, [val]);

  const setSelectMessage = (body: string, author: string, index: number) => {
    setDialogOpen(true)
    setBody(body)
    setIdx(index)
    setAuthor(author)
  }

  const ChatHeight = dimention.height - InputRef.current?.offsetHeight! - Number(import.meta.env.VITE_HEIGHT_MAINNAV) - 10
  return (
    <motion.div className="flex font-Maktoob w-screen  bg-zinc-950 h-full flex-col"
      animate={props.SideBarShown ? "open" : "closed"}
      custom={dimention.width}
      variants={Variants}
      initial={false}
      style={{ height: ChatHeight ? ChatHeight : "100vh" }}>
      <EditMessage author={author} body={body} open={dialogOpen}
        setOpen={setDialogOpen} setChange={changeMessage} />
      {loading ? <Spinner className="h-full" size="large" /> :
        <div className="m-2 p-2 h-full ">
          <div id="scrollableDiv"
            style={{
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column-reverse',
              height: `${ChatHeight}px`
            }}
          >
            <InfiniteScroll
              dataLength={length}
              next={() => setPageNumber(pageNumber + 1)}
              style={{ display: 'flex', flexDirection: 'column-reverse', whiteSpace: "pre" }} //To put endMessage and loader to the top.
              inverse={true}
              hasMore={hasMore}
              loader={<h4>Loading...</h4>}
              scrollableTarget="scrollableDiv"
            >
              {messageHistory.map((msg, index) => (
                <li key={index} className={`m-2 flex ${msg.author === user_name ? "flex-row-reverse content-end" : "flex-row"}  items-center`}>
                  <Avatar className="" >
                    <AvatarImage className="block w-8 h-8 " style={{ borderRadius: "50%", objectFit: "scale-down" }} src={msg.url!} />
                    <AvatarFallback style={{ borderRadius: "50%" }}
                      className="bg-muted p-2 text-primary">{msg.author[0].toUpperCase()}{msg.author[1]}</AvatarFallback>
                  </Avatar>
                  <ContextMenu>
                    <ContextMenuTrigger>
                      <pre id="Messages" className="bg-sky-950 text-card-foreground m-2 rounded w-fit p-2">
                        {msg.message_body}
                      </pre>
                    </ContextMenuTrigger>
                    <ContextMenuContent className="w-64">
                      <ContextMenuItem onClick={() => removeMessage(index, msg.message_body)}
                        inset disabled={msg.author === user_name ? false : true}>
                        Remove
                        <ContextMenuShortcut><FaTrash /></ContextMenuShortcut>
                      </ContextMenuItem>
                      <ContextMenuItem onClick={() => setSelectMessage(msg.message_body, msg.author, index)}
                        inset disabled={msg.author === user_name ? false : true}>
                        Edit
                        <ContextMenuShortcut><FaEdit /></ContextMenuShortcut>
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                </li>
              ))}
            </InfiniteScroll>
          </div>
        </div>}
      <motion.div
        ref={InputRef}
        animate={props.SideBarShown ? "open" : "closed"}
        custom={dimention.width}
        variants={InputVariants}
        initial={false}
        className="bottom-0 w-full absolute h-1/7 ">
        <div
          className="flex items-center content-center h-28" >
          <input
            dir="rtl"
            className="grow px-2 mx-2 font-BZiba h-16 rounded-lg text-black"
            placeholder={`پیغامتو بفرست    ${connectionStatus}`}
            value={val} onKeyDown={handleInput} onChange={e => setVal(e.target.value)} />
          <button
            className="border-white bg-zinc-950 hover:border-2 mr-10  p-2 w-14 h-14 flex items-center justify-center"
            style={{ borderRadius: "50%" }}
            onClick={handleClickSendMessage}
            disabled={readyState !== ReadyState.OPEN}
          >
            <IoArrowForward />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}






