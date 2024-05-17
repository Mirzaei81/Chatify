import { FaArrowAltCircleLeft } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { useSupabaseMutation } from "supabase-query";
import { useQueryClient } from "react-query";
import { Spinner } from "./spinner";
import { UserCTX } from "@/routes/App";
import { useTypedSupabaseQuery } from "@/utils/SupaBaseClient";
import { LeftFadeIn } from "@/utils/variants";

export interface IRoomProp {
  shouldRefetch: React.Dispatch<React.SetStateAction<boolean>>,
  sidebarShown: Boolean
}

export default function JoinRoom({ shouldRefetch, sidebarShown }: IRoomProp) {
  const User = useContext(UserCTX)
  const [ShouldSearch, setShouldSearch] = useState(false)
  const [err, setErr] = useState("")
  const [RoomName, setRoomname] = useState("")

  const queryClient = useQueryClient()
  const { mutate, isLoading: JoingTheRoom } = useSupabaseMutation({
    onSuccess: () => { queryClient.invalidateQueries("room"); shouldRefetch((prev) => { console.log(prev); return true }) },
  });

  const handleSubmit = (data: any) => {
    setRoomname("")
    mutate((supabase) =>
      supabase.from("room_user").insert({ room_id: data.id, user_id: User?.id })
    )
    setShouldSearch(false)
  }

  const { isLoading } = useTypedSupabaseQuery((supabase) =>
    supabase.from("room").select("id").eq("name", RoomName).single(),
    {
      enabled: ShouldSearch,
      onSuccess: handleSubmit,
      onError: () => { setShouldSearch(false); setErr("اتاق مورد نظر یافت نشد (شاید اسم رو  اشتباهی نوشتی)"); return false; },
      retry: 2
    }
  )

  const handlerEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter') {
      console.log(e.key)
      setShouldSearch(true)
    }
  }

  return (
    <Dialog >
      <DialogTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.2 }}
          variants={LeftFadeIn}
          initial={false}
          custom={1}
          animate={sidebarShown ? "open" : "closed"}
          className="bg-primary w-[6rem] font-sans rounded-lg p-2 flex justify-center" style={{ borderRadius: "8px" }}>
          ورود
        </motion.button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          {(isLoading || JoingTheRoom) ? <Spinner /> : (<div>
            <DialogTitle>یه اتاق نو </DialogTitle>
            <DialogDescription>
              {isLoading ? <Spinner /> : (err !== "" ? err : <span> اسم اتاقی که میخوای بری توش چیه ؟؟   🤔</span>)}
            </DialogDescription>
          </div>)}
        </DialogHeader>
        <div className="flex items-center justify-betweeen">
          <Input
            value={RoomName}
            onChange={(e) => setRoomname(e.target.value)}
            onKeyDown={handlerEnter}
            placeholder="اسم اتاق"
          />
          <Button type="submit" onClick={() => setShouldSearch(true)}
            size="sm" style={{ borderRadius: 7, marginRight: 5 }} className="px-3 ml-10">
            <span className="sr-only">Copy</span>
            <FaArrowAltCircleLeft size={16} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
