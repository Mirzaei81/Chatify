import {useRef,useState,useEffect} from "react"
import toast from "react-hot-toast"

const useWebSocket= (url:string) =>{
  const [lastMessage,setLastMessage] = useState<MessageEvent<any>>()
  const [ready,setReady] = useState<string>("Uninstantiated")
  const conn  = useRef<WebSocket>()
  const shouldKeppAlive = useRef<boolean>(false)

  const sendMessage=(message:string)=>{
    if ((conn && conn.current && conn.current.readyState === 1)) {
        conn.current.send(message);
    }
  }

  useEffect(()=>{
      if (!(conn && conn.current && conn.current.readyState === 1)) {
        conn.current = new WebSocket(url);
        conn.current.onopen = () => {
            toast.success("Connected !!",{
              icon:"🔥"
            })
            setReady("Success")
        }
        conn.current.onclose = () => {
            setReady("Failure")
            toast.success(" Server Down !!",{
              icon:"😔"
            })
        };
        conn.current.onmessage = (e) => {
          setLastMessage(e)
        };
      }
      else{
        setReady("")
      }
    },[])
    return [lastMessage,sendMessage, ready] as const
  }
export default useWebSocket