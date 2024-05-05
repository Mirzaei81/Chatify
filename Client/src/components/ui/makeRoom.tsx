import { CopyIcon } from "@radix-ui/react-icons"
import { FaArrowAltCircleLeft } from "react-icons/fa";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa6";
import { useState } from "react";
import { motion } from "framer-motion";

 export default function MakeRoom() {
  const [RoomName,setRoomname ] = useState("")
  return (
    <Dialog >
      <DialogTrigger asChild>
        <motion.button
        whileHover={{scale:1.2}}
        className="bg-primary rounded-lg p-2 flex items-center">
          <FaPlus className="self-center" size={15} />  اتاق بساز 
        </motion.button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>یه اتاق نو </DialogTitle>
          <DialogDescription>
            اسم اتاق حدیدت چی می تونه باشه  🧐
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
            <Input
              placeholder="اسم اتاق"
            />
          <Button type="submit" size="sm" className="px-3 mx-10">
            <span className="sr-only">Copy</span>
             <FaArrowAltCircleLeft size={16}/>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

