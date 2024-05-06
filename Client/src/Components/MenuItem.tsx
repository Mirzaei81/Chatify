import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { AvatarImage } from "@radix-ui/react-avatar"
import { motion } from "framer-motion"
import { useState } from "react"
import { Link } from "react-router-dom"

const variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 }
    }
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 }
    }
  }
}
export default function MenuItem(Room: { name: string, icon: string | undefined}) {
  const [isLoaded,useIsloaded] = useState(true)
  return (
    <motion.li
      variants={variants}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="my-2 items-center justify-center align-middle"
    >
      <div className="w-full h-full flex flex-row m-2 justify-around" style={{ borderRadius: "50%" }} >
        {isLoaded ?
          (<>
          <Avatar style={{ borderRadius: "50%" }} >
            <AvatarImage src={Room.icon}/>
            <AvatarFallback className="text-primary">{Room.name[0].toUpperCase()}{Room.name[1]}</AvatarFallback>
          </Avatar>
            <Link className="text-3xl" to={`/${Room.name}`} style={{ borderRadius: "40" }} >
              {Room.name}
            </Link>
            </>
          )
          :
          <Skeleton className="rounded-full w-12 h-12" />
        }
      </div>
    </motion.li>
  )
}
