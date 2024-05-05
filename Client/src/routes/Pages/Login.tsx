import {  useEffect, useRef, useState } from "react"
import useWindowDimensions from "@/utils/useDimensions"
import { Button } from "@/components/ui/button"
import {  motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import "./Login.css"
import {supabaseClient} from"@/main"
import { useTypedSupabaseMutation } from "@/utils/SupaBaseClient"
import { validateEmail } from "@/utils/validateEmail"
import { Spinner } from "@/components/ui/spinner"
import { SiGmail } from "react-icons/si";
import { FaLock } from "react-icons/fa"
import {Turnstile, TurnstileInstance} from"@marsidev/react-turnstile"

  
interface ISize{
    width:number,
    height:number
  }

const variation={
  onHover:{
    scale: 1.1,
    pathLength:1,
    transition:{duration:0.4}
  },
  initial:{
    pathLength:0,
    scale: .8,
  }
}
export default function Login(){
  const captcha = useRef<TurnstileInstance>(null)
  useTypedSupabaseMutation()
  const bgref = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [size,setSize] = useState<ISize>({width:0,height:0})
  const [captchaToken,setCaptchaToken] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [err,setErr]=  useState("")
  const [loading,setLoading]=useState(false)
  let Size  = useWindowDimensions()
  const Navigate = useNavigate()

  const handleSubmition = async (e:React.FormEvent)=>{
    e.preventDefault()
    setLoading(!loading)
    if(captchaToken===""){
      setErr("لطفا captacha  را انجام دهید")
    }
    if (validateEmail(email)){
      supabaseClient.auth.signInWithPassword({email:email,
      password:password,
      options:{captchaToken:captchaToken}}).then((val)=>{
        if (val.error){
          setTimeout(
            ()=>{setErr("رمز عبور یا ایمیل درست نمی باشد !"),setLoading(false),captcha.current?.reset()},2000)
          }
        else{
          if (val.data.user && val.data.user.id) {
            Navigate("/")
          }
          else{
            setErr("به مشکل بر خوردیم")
          }
        }
      }).catch((error)=>{setErr(error),setLoading(false),console.log("opssie daisy")})
    }
    else{
        setErr("ایمیل درست نمی باشد !")
        setLoading(false)
        }
  }

  const SignInwithGoogle= async ()=>{
    const {data,error} = await supabaseClient.auth.signInWithOAuth({provider:"google"})
    console.log(data,error)
  }

  useEffect(()=>{
    setSize(Size)
  },[])

  const url = `https://source.unsplash.com/random/${size!.width}x${size!.height}`

  return(
      <div
        ref={bgref}
        style={{ backgroundImage: `url(${url})`,backgroundSize:"cover"}}
        className="flex text-nastaliq w-screen h-screen items-center justify-center align-center" dir="rtl">
        <div className="relative bg-card-foreground  font-BZiba rounded-lg  w-1/5   bg-foreground">
        <form className="" onSubmit={handleSubmition} ref={formRef}>
          <div className="flex h-full flex-col  text-2xl items-center">
            ورود
            <div className="flex h-full w-full flex-col align-center mt-2  items-center">
              {loading ? <Spinner/>:
              <motion.div
                initial={false}
                animate={(err===""&&!loading)?{
                x:100,
                opacity:0
                }:{
                x:0,
                opacity:1
                }}
              dir="rtl" style={{backgroundColor:"#DB4437"}} className="font-bold text-xs
               font-BZiba  p-1 rounded-sm
               border-red-950 border-2 text-red-800
               ">
              {err}
              </motion.div>
              }
              <div className="relative w-10/12">
                <SiGmail className="absolute top-[15px] left-[10px] hover:text-primary" width={48} height={48} />
                <input name="email" autoComplete="email" placeholder="ایمیل: "
                className="rounded-lg p-5 my-2 w-full text-xs h-10 "
                  type="text" value={email}
                  onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="relative w-10/12">
                <FaLock  className="absolute top-[15px] left-[10px] hover:text-primary" width={48} height={48} />
                <input name="password" autoComplete="current-password" placeholder="رمز عبور :" className="rounded-lg my-2 p-4 text-xs h-10 w-full " type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <Link to="/forgotpass" className="font-BZiba text-xs hover:text-primary mt-2">
                  رمز عبور فراموش کردی؟
                </Link>
                <Button onClick={(e)=>{e.preventDefault(),setLoading(true),handleSubmition(e)}} 
                type="submit" className="font-BZiba text-xl m-2 hover:text-foreground  hover:scale-110">
                  ورود
                </Button>
                <Link className="text-sm text-white hover:text-primary" to="/signup">ثبت نام نکردی هنوز ؟</Link>
                <div className="line"><h1>یا</h1></div>
                <Turnstile
                ref={captcha}
                siteKey="0x4AAAAAAAZCNQiiqW5ir4kw"
                onLoad={()=>console.log("loading")}
                onSuccess={(token) => {
                  setCaptchaToken(token)
                }}
                />
                <motion.div className="mt-auto w-10/12 mb-2 flex"
                  initial="initial"
                  animate="initial"
                  whileHover="onHover">
                  <Button onClick={(e)=>{
                    e.preventDefault(),SignInwithGoogle(),setLoading(true)}
                  }  className="parent w-full  font-BZiba p-5 flex mt-2">
                    اتصال با گوگل
                    <svg className="mx-5 child"
                      xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48px" height="48px">
                      <defs>
                        <linearGradient id="myGradient" gradientTransform="rotate(90)">
                          <stop offset="25%" stopColor="#DB4437" />
                          <stop offset="50%" stopColor="#F4B400" />
                          <stop offset="85%" stopColor="#0F9D58" />
                        </linearGradient>
                      </defs>
                      <motion.path
                        variants={variation}
                        fill="url('#myGradient')"
                        strokeWidth={0.8}
                        stroke="white"
                        d="M12.545,12.151L12.545,12.151c0,1.054,0.855,1.909,1.909,1.909h3.536c-0.607,1.972-2.101,3.467-4.26,3.866 c-3.431,0.635-6.862-1.865-7.19-5.339c-0.34-3.595,2.479-6.62,6.005-6.62c1.002,0,1.946,0.246,2.777,0.679 c0.757,0.395,1.683,0.236,2.286-0.368l0,0c0.954-0.954,0.701-2.563-0.498-3.179c-1.678-0.862-3.631-1.264-5.692-1.038 c-4.583,0.502-8.31,4.226-8.812,8.809C1.945,16.9,6.649,22,12.545,22c6.368,0,8.972-4.515,9.499-8.398 c0.242-1.78-1.182-3.352-2.978-3.354l-4.61-0.006C13.401,10.24,12.545,11.095,12.545,12.170" /></svg>
                  </Button>
                </motion.div>
              </div>
            </div>
        </form>
          </div>
      </div>
  )
}
