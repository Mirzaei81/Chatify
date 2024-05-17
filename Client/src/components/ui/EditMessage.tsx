import { useEffect, useState } from "react"
import { supabaseClient } from "@/main";

import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/Dialog"

import { Input } from "./input";
import { Spinner } from "./spinner";

export default function EditMessage({ body, author, open, setOpen, setChange }: {
  body: string, author: string,
  open: boolean, setOpen: (val: boolean) => void,
  setChange: (val: string) => void
}) {
  const [loading, setLoading] = useState(false)
  const [val, setVal] = useState(body)

  const handleClick = () => {
    setLoading(true)
    supabaseClient.from("messages").update({ "body": val }).eq("body", body).select().then(() => {
      setOpen(false); setChange(val), setLoading(false)
    })
  }
  useEffect(() => setVal(body), [body])

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter")
      handleClick()
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md w-full bg-card">
        <DialogHeader className="w-full">
          {loading ? <Spinner /> : (<span>
            ایا مطمئنید میخواهید پیام خود را تغیر بدهید <br /> {author}</span>)}
        </DialogHeader>
        <Input onKeyDown={handleEnter} value={val} onChange={(e) => setVal(e.target.value)} />
      </DialogContent>
    </Dialog>
  )
}
