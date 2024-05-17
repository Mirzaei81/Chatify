import { useEffect, useState } from "react"
import { supabaseClient } from "@/main";

import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/Dialog"

import { Spinner } from "./spinner";

export default function DeleteMessage({ body, open, setOpen, setChange }: {
  body: string, author: string,
  open: boolean, setOpen: (val: boolean) => void,
  setChange: (val: string) => void
}) {
  const [loading, setLoading] = useState(false)
  const [val, setVal] = useState(body)

  const handleClick = () => {
    setLoading(true)
    supabaseClient.from("messages").delete().eq("body", body).select().then(() => {
      setOpen(false); setChange(val), setLoading(false)
    })
  }
  useEffect(() => setVal(body), [body])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md w-full bg-card">
        <DialogHeader className="w-full">
          {loading ? <Spinner /> : (<span>
            ایا مطمئنید میخواهید پیام خود را حذف  کنید<br /> {body}</span>)}
        </DialogHeader>
        <button
          onClick={handleClick}
          className="bg-destructive hover:shadow-[0px_0px_40px_2px_hsl(var(--destructive))] w-28 font-sans rounded-lg p-2 mx-4 flex justify-center" style={{ borderRadius: "8px" }}>
          خروج
        </button>
        <DialogClose
          className="bg-primary hover:shadow-[0px_0px_40px_2px_hsl(var(--primary))] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]
            font-sans w-28 rounded-lg p-2 flex justify-center" style={{ borderRadius: "8px" }}
        >
          کنسل
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}
