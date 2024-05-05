import { Skeleton } from '@/components/ui/skeleton';
import {motion} from  'framer-motion'
import MenuItem from "./MenuItem";

const variants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  }
};

const SkeletonVariants = {
  open: {
    width: "26rem",
    heigh:"5rem"
  },
  closed: {
    width:0,
    heigh:0
  }
}

export interface ISideBar{
 Rooms:{creator: string; Icon: string | null; id: string; members: number | null; name: string; }[],
 isLoading:Boolean
 sideBarShown:Boolean
}

export default function SideBar(props:ISideBar){
    if (props.isLoading||props.Rooms == null ){
      return(
          <motion.ul  className="align-center relative font-BZiba content-around mt-22 sideElements w-[250px] "
          style={{overflowX:"hidden"}} variants={variants}>
            {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map((val) => (
              <motion.li
                key={val}
                variants={variants}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="my-2 items-center justify-center align-middle"
              >
              <div className="relative  flex flex-row m-2 items-center align-center justify-around">
                {props.sideBarShown?<Skeleton className="z-50 w-36 h-10" key={val} />:null}
              </div>
              </motion.li>
            ))
            }
            </motion.ul>
            )
    }
    return(

          <motion.ul className="align-center font-IranNastaliq relative content-around mt-22 overflow-y-auto sideElements mt-22  w-[250px]"
                   style={{overflowX:"hidden",overflowY:`${props.sideBarShown?"auto":"hidden"}`}}
         variants={variants}>
            {props.Rooms && props!.Rooms!.map((val, idx) => (
                <MenuItem key={idx} name={val.name.replace(" ","")} icon={val.Icon!} />
            ))
            }
            </motion.ul>
    )

}
