import JoinRoom from '@/components/ui/joinRoom';
import MakeRoom from '@/components/ui/makeRoom';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react';
import MenuItem from "./MenuItem";

const variants = {
  open: {
    overflowY: "auto",
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    overflowY: "hidden",
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  }
};


export interface ISideBar {
  Rooms: { creator: string; Icon: string | null; id: string; members: number | null; name: string; }[],
  isLoading: Boolean,
  sideBarShown: boolean,
  shouldRefetch: React.Dispatch<React.SetStateAction<boolean>>
  RoomName: string
}
interface IRoomStruct {
  shouldRefetch: React.Dispatch<React.SetStateAction<boolean>>,
  sideBarShown: boolean
}
export function RoomStruct({ shouldRefetch, sideBarShown }: IRoomStruct) {
  return (
    <motion.div
      initial="closed"
      animate={sideBarShown ? 'open' : 'closed'}
      variants={variants}
      className='w-full flex justify-center'>
      <div className='flex flex-col w-32 h-32 gap-4 p-2 ml-2 align-center justify-center'>
        <JoinRoom sidebarShown={sideBarShown} shouldRefetch={shouldRefetch} />
        <MakeRoom sidebarShown={sideBarShown} />
      </div>
    </motion.div>
  )
}

export default function SideBar(props: ISideBar) {
  const ulRef = useRef<HTMLUListElement>(null)
  useEffect(() => {
    if (ulRef.current && props.sideBarShown) {
      ulRef.current.style.display = "block"
    }
  }, [props.sideBarShown])

  const handleonANimationComplete = (name: string) => {
    if (name == "closed") {
      if (ulRef.current) {
        ulRef.current.style.display = "none"
      }
    }
  }
  return (
    <motion.ul
      ref={ulRef}
      className="hidden font-IranNastaliq relative sideElements w-[250px]"
      initial="closed"
      animate={props.sideBarShown ? 'open' : 'closed'}
      variants={variants}
      onAnimationComplete={handleonANimationComplete}
      style={{ overflowX: "hidden", display: "none", marginTop: `${import.meta.env.VITE_HEIGHT_MAINNAV}px` }}
    >{props.isLoading ? ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((val) => (
      <motion.li
        key={val}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="my-2 items-center justify-center align-middle"
      >
        <div className="relative  flex flex-row m-2 items-center align-center justify-around">
          {props.sideBarShown ? <Skeleton className="z-50 rounded-lg w-36 h-10" key={val} /> : null}
        </div>
      </motion.li>
    ))
    ) : (props.Rooms && props.Rooms.length === 0) ? <RoomStruct sideBarShown={props.sideBarShown} shouldRefetch={props.shouldRefetch} /> :
      (props.Rooms && props!.Rooms!.map((val, idx) => (
        <MenuItem key={idx} isCurrent={val.name.replace(" ", "") == props.RoomName} name={val.name} icon={val.Icon!} />
      ))
      )
      }
      <RoomStruct sideBarShown={props.sideBarShown} shouldRefetch={props.shouldRefetch} />
    </motion.ul>
  )

}
