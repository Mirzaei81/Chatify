/// <reference types="vite-plugin-svgr/client" />
import  Logo  from "@img/logo.svg?react"
import {motion} from "framer-motion"
import { useState,useEffect,useRef, useContext} from "react";
import { Link } from "react-router-dom";
import { MenuToggle } from "@/Components/MenuToggle";
import useWindowDimensions from "@/utils/useDimensions";
import SideBar from "@/Components/SideBar";
import { Skeleton } from "@/components/ui/skeleton";
import { useTypedSupabaseQuery } from "@/utils/SupaBaseClient";
import MakeRoom from "@/components/ui/makeRoom";
import { IToggleSideBar, UserCTX } from "../App";
import { ModeToggle } from "@/components/ui/mode-toggle";

const  fillLine = {
  open:{
    pathLength: 1,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2
    }
  },
  closed:{
    pathLength: 0,
    transition: {
      delay: 0.5,
      type: "spring",
      stiffness: 400,
      damping: 40
    }
  }
}
const sidebar = {
  open: (height=1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2
    }
  }),
  closed: {
    clipPath: "circle(30px at 40px 40px)",
    transition: {
      delay: 0.5,
      type: "spring",
      stiffness: 400,
      damping: 40
    }
  }
}; 
export default function MainNav(Props:IToggleSideBar){
  const [isLoaded,setIsLoaded] = useState(false)
  const user = useContext(UserCTX)
  const navRef:React.MutableRefObject<HTMLElement|null> = useRef(null)

  const {data,isLoading}= useTypedSupabaseQuery((supabase)=>
      supabase.from("users").select("*,room!room_user(*)").eq("id",user?.id!).single(),
      {enabled:user!==null,queryKey:user?.id,staleTime:Infinity}
  );

  useEffect(()=>{
    const handleClickOutside=(e:any)=>{
      if(navRef && !navRef.current?.contains(e.target)){
        Props.setShowSide(false)
      }
    }
    document.addEventListener('click',handleClickOutside,true)
    return (()=>{
      document.removeEventListener('click',handleClickOutside,true)
    })
  },[])

  let size = useWindowDimensions();
  return(
    <>
      <motion.nav 
        initial={false}
        animate={Props.ShowSide?"open":"closed"}
        custom={size}
        ref={navRef}
        className={`absolute bottom-0 top-0 left-0 h-${import.meta.env.VITE_HEIGHT_MAINNAV}
        w-${import.meta.env.VITE_WIDTH_SIDEBAR} flex flex-row font-BZiba`}
      >
      <motion.div 
        className={`absolute bg-gray-900 font-BZiba top-0 left-0 bottom-0 w-${import.meta.env.VITE_WIDTH_SIDEBAR}`}
        variants={sidebar}>
          <div style={{"marginTop":"85px"}}>
            <motion.svg width={250} height={20} viewBox="0 0 250 20">
              <motion.path  
                   variants={fillLine}
                   fill="transprent" strokeWidth="3"
                   stroke="hsl(0,0%,80%)" strokeLinecap="round" d="M0 0 L 250 0"/>
            </motion.svg>
          </div>
        </motion.div>
          <SideBar Rooms={data?.room!} sideBarShown={Props.ShowSide} isLoading={isLoading}/>
        <MenuToggle toggle={() => {Props.setShowSide(!Props.ShowSide)}} />
      </motion.nav>
      <div className="bg-card  space-between text-card-foreground justify-around flex flex-row">
        <div className="flex flex-row  items-center ">
          <Logo width={85} height={85} />
          <p className="font-IranNastaliq text-3xl">خلوت نشین</p>
        </div >
        <div className="gap-4 flex flex-row items-center font-BZiba text-2xl justify-center">
        {isLoading?
          (<>
          <Skeleton onClick={()=>setIsLoaded(!isLoaded)} className="w-20 h-5  rounded-lg " style={{ "zIndex": 9999 }}/>
          <Skeleton onClick={()=>setIsLoaded(!isLoaded)} className="w-20 h-5  rounded-lg " style={{ "zIndex": 9999 }}/>
          <Skeleton onClick={()=>setIsLoaded(!isLoaded)} className="w-20 h-5  rounded-lg " style={{ "zIndex": 9999 }}/>
          </>
          ):(data && data!.room.length !== 0 && data!.room.slice(0, 3).map((val, idx) =>
              <div key={idx}>
                <Link className="hover:text-primary" color="primary" key={idx} to={`/${val.name.replace(" ","")}`}>
                  {val.name}
                </Link>
              </div>
            ))
        }
          <div className="flex flex-row cursor-pointer hover:opacity-80">
          <MakeRoom />
          </div>
            <div className="flex items-center">
              <ModeToggle />
            </div>
        </div>
      </div>
    </>
  )
}
