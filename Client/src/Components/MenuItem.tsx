import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { AvatarImage } from "@radix-ui/react-avatar"
import { motion } from "framer-motion"
import { useState } from "react"
import { Link } from "react-router-dom"
import { FadeIn } from "@/utils/variants"

export default function MenuItem(Room: { name: string, icon: string | undefined, isCurrent: boolean }) {
  const [isLoaded, useIsloaded] = useState(true)
  return (
    <motion.li
      variants={FadeIn}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="my-2 items-center justify-center align-middle"
    >
      <div className="w-full h-full flex flex-row m-2 justify-around" style={{ borderRadius: "50%" }} >
        {isLoaded ?
          (<>
            <Avatar style={{ borderRadius: "50%" }} >
              <AvatarImage src={Room.icon} />
              <AvatarFallback className="text-primary">{Room.name[0].toUpperCase()}{Room.name[1]}</AvatarFallback>
            </Avatar>
            <Link className={`text-3xl ${Room.isCurrent ? "text-primary" : "text-foreground"}`} to={`/${Room.name}`} style={{ borderRadius: "40" }} >
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
