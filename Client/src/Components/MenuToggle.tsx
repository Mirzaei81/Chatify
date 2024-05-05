import { Cycle, motion } from "framer-motion";


const Path = (props:any) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="hsl(0, 0%, 80%)"
    strokeLinecap="round"
    {...props}
  />
);

interface toggleProp{
  toggle:()=>void
}

export const MenuToggle = (props:toggleProp) => (
  <motion.button
  className="absolute bg-transparent  left-7 bottom-0 z-50 w-12 h-12  p-0"
  style={{"borderRadius":"100%","top":18}}
  onClick={props.toggle}>
    <svg className=""
    width="23" height="23" viewBox="0 0 23 23"
    >
        <Path
        variants={{
          closed: { d: "M 2 1.5 L 20 2" },
          open: { d: "M 2 16.5 L 17 2.5" },
        }}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        variants={{
          closed: { d: "M 2 16.346 L 20 16.346" },
          open: { d: "M 3 2.5 L 17 16.346" },
        }}
      />
    </svg>
  </motion.button>
);

