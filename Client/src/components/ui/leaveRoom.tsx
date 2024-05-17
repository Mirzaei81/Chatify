import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog"
import { motion } from "framer-motion";
import { DialogClose } from "@radix-ui/react-dialog";
import { supabaseClient } from "@/main";
import { useContext, useState } from "react";
import { UserCTX } from "@/routes/App";
import { Spinner } from "./spinner";

export default function LeaveRoom({ name }: { name: string }) {
  const user = useContext(UserCTX)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const handleClick = () => {
    setLoading(true)
    console.log(name)
    supabaseClient.from("room").select("id").eq("name", name).single().then((id) => {
      console.log(id)
      supabaseClient.from("room_user").delete().eq("user_id", user?.id).eq("room_id", id.data.id).then((e) => {
        console.log(e), setLoading(false), console.log(loading)
      })
    })
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.2 }}
          className="bg-primary w-[6rem] font-sans rounded-lg p-1 flex justify-center" style={{ borderRadius: "8px" }}>
          خروج
        </motion.button>
      </DialogTrigger>
      <div dir="rtl">
        <DialogContent className="sm:max-w-md bg-card">
          <DialogHeader>
            <div>
              {name === "لابی" ? <DialogDescription style={{ textAlign: "center" }}>
                نمیتوانید از اتاق اصلی (لابی) خارج شوید
              </DialogDescription>
                : (loading ? <Spinner /> : (
                  <>
                    <DialogTitle style={{ textAlign: "start" }}>خروج از اتاق </DialogTitle>
                    <DialogDescription style={{ textAlign: "start" }}>
                      ایا مطئینی میخواهید از {name} خارج شوید
                    </DialogDescription>
                  </>
                ))}
            </div>
          </DialogHeader>
          {name === "لابی" ? null : (<div className="flex items-center  justify-between">
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
          </div>)}
        </DialogContent>
      </div>
    </Dialog>
  )
}
