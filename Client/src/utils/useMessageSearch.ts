import { supabaseClient } from "@/main";
import { PostgrestError } from "@supabase/supabase-js";
import { useEffect, useState } from "react"
import { IMessage } from "types/util";

const DefaultMessageCount = 100

export default function useMessageSearch(roomName:string,pageNumber:number){
    const [isLoading,setIsLoading] = useState(true)
    const [err,setErr] = useState<PostgrestError>()
    const [messages,setMessages] = useState<IMessage[]>()
    useEffect(()=>{
	supabaseClient.rpc("get_messages_by_room_name", { room_name: roomName}).range(DefaultMessageCount*(pageNumber-1),
	    DefaultMessageCount*(pageNumber)).then((data)=>{
	    if(data.error) setErr(data.error)
	    setMessages(data.data!)
	    setIsLoading(false)
	})
    },[roomName])
    return {isLoading,err,messages}
}
