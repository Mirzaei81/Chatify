/// <reference types="vite-plugin-svgr/client" />
import Logo from "@img/logo.svg?react"
import { motion } from "framer-motion"
import { useState, useEffect, useRef, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { MenuToggle } from "@/Components/MenuToggle";
import useWindowDimensions from "@/utils/useDimensions";
import SideBar from "@/Components/SideBar";
import { Skeleton } from "@/components/ui/skeleton";
import { useTypedSupabaseQuery } from "@/utils/SupaBaseClient";
import MakeRoom from "@/components/ui/makeRoom";
import { IToggleSideBar, UserCTX } from "../App";
import JoinRoom from "@/components/ui/joinRoom";
import LeaveRoom from "@/components/ui/leaveRoom";
import { sidebar, fillLine } from "@/utils/variants";
import useLocalStorage from "@/Hooks/useLocalStorage";
import { IRoom } from "types/util";

export default function MainNav(Props: IToggleSideBar) {
  const [isLoaded, setIsLoaded] = useState(false)
  const param = useLocation().pathname
  const user = useContext(UserCTX)
  const navRef: React.MutableRefObject<HTMLElement | null> = useRef(null)
  const [refetch, setRefetch] = useState(true);
  const room = (param !== "/") ? param.slice(1) : "لابی"
  const [UserJoinedRooms, setUserRooms] = useLocalStorage<IRoom>(user ? user!.id : null, null)

  //getUserRooms
  const { isLoading } = useTypedSupabaseQuery((supabase) =>
    supabase.from("users").select("*,room!room_user(*)").eq("id", user?.id!).single(), {
    enabled: (user !== null) && refetch,
    queryKey: user?.id,
    onSuccess: (data: IRoom) => {
      setRefetch(false)
      setUserRooms(data)
    }
  }
  );

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (navRef && !navRef.current?.contains(e.target)) {
        Props.setShowSide(false)
      }
    }
    document.addEventListener('click', handleClickOutside, true)
    return (() => {
      document.removeEventListener('click', handleClickOutside, true)
    })
  }, [room])

  let size = useWindowDimensions();
  return (
    <>
      <motion.nav
        initial={false}
        animate={Props.ShowSide ? "open" : "closed"}
        custom={size}
        ref={navRef}
        className={`absolute bottom-0 top-0 left-0 h-${import.meta.env.VITE_HEIGHT_MAINNAV}
        w-${import.meta.env.VITE_HEIGHT_MAINNAV} flex flex-row font-BZiba`}
      >
        <motion.div
          className={`absolute bg-card font-BZiba top-0 left-0 bottom-0 w-${import.meta.env.VITE_WIDTH_SIDEBAR}px`}
          variants={sidebar}>
          <div style={{ marginTop: `${import.meta.env.VITE_HEIGHT_MAINNAV}px` }}>
            <motion.svg width={250} height={20} viewBox="0 0 250 20">
              <motion.path
                variants={fillLine}
                fill="transprent" strokeWidth="3"
                stroke="hsl(0,0%,80%)" strokeLinecap="round" d="M0 0 L 250 0" />
            </motion.svg>
          </div>
        </motion.div>
        <SideBar Rooms={UserJoinedRooms?.room!} RoomName={room} shouldRefetch={setRefetch}
          sideBarShown={Props.ShowSide} isLoading={isLoading} />
        <MenuToggle toggle={() => { Props.setShowSide(!Props.ShowSide) }} /> </motion.nav>
      <div className="bg-background  space-between text-card-foreground justify-around flex flex-row">
        <div className="flex flex-row  items-center ">
          <Logo width={85} height={85} />
          <p className="font-IranNastaliq text-3xl">خلوت نشین</p>
        </div >
        <div className="gap-4 flex flex-row items-center font-BZiba text-2xl justify-center">
          {isLoading ?
            (<>
              <Skeleton onClick={() => setIsLoaded(!isLoaded)} className="w-20 h-5  rounded-lg " style={{ "zIndex": 9999 }} />
              <Skeleton onClick={() => setIsLoaded(!isLoaded)} className="w-20 h-5  rounded-lg " style={{ "zIndex": 9999 }} />
              <Skeleton onClick={() => setIsLoaded(!isLoaded)} className="w-20 h-5  rounded-lg " style={{ "zIndex": 9999 }} />
            </>
            ) : (UserJoinedRooms && UserJoinedRooms.room!.length !== 0 && UserJoinedRooms.room.slice(0, 3).map((val, idx) => (
              val.name.replace(" ", "") != room ?
                <div key={idx}>
                  <Link className="hover:text-primary pointer" color="primary" key={idx} to={`/${val.name === 'لابی' ? "" : val.name.replace(" ", "")}`}>
                    {val.name}
                  </Link>
                </div> : null
            )
            ))
          }
          <div className="text-primary  ">{room}</div>
          <div className="flex flex-row gap-2 cursor-pointer hover:opacity-80">
            <MakeRoom sidebarShown={true} />
            <JoinRoom shouldRefetch={setRefetch} sidebarShown={true} />
            <LeaveRoom name={room} />
          </div>
        </div>
      </div>
    </>
  )
}
