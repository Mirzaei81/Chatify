import { Skeleton } from '@/components/ui/skeleton';
import {motion} from  'framer-motion'
import { useEffect, useRef} from 'react';
import MenuItem from "./MenuItem";

const variants = {
  open: {
    overflowY:"auto",
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    overflowY: "hidden",
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  }
};

export interface ISideBar{
 Rooms:{creator: string; Icon: string | null; id: string; members: number | null; name: string; }[],
 isLoading:Boolean
 sideBarShown:Boolean
}

export default function SideBar(props:ISideBar){
    const ulRef = useRef<HTMLUListElement>(null)
    useEffect(()=>{
      if (ulRef.current && props.sideBarShown){
        ulRef.current.style.display = "block"
      } 
    },[props.sideBarShown])

    const handleonANimationComplete = (name:string)=>{
      if (name == "closed") {
        if (ulRef.current) {
          ulRef.current.style.display = "none"
        }
      }
    }
    return(
      <motion.ul
        ref={ulRef}
        className="align-center hidden font-IranNastaliq relative content-around mt-22 sideElements mt-22  w-[250px]"
        initial="closed"
        animate={props.sideBarShown ? 'open' : 'closed'}
        variants={variants}
        onAnimationComplete={handleonANimationComplete}
        style={{ overflowX: "hidden",display:"none"}}
           >{props.isLoading?
            ([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map((val) => (
              <motion.li
                key={val}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="my-2 items-center justify-center align-middle"
              >
              <div className="relative  flex flex-row m-2 items-center align-center justify-around">
                {props.sideBarShown?<Skeleton className="z-50 w-36 h-10" key={val} />:null}
              </div>
              </motion.li>
            ))
            ):(props.Rooms && props!.Rooms!.map((val, idx) => (
                <MenuItem key={idx} name={val.name.replace(" ","")} icon={val.Icon!} />
            ))
            )}
        </motion.ul>
    )

}
