import MainNav from "./Pages/MainNav"
import { Route,Routes,} from "react-router-dom";
import Room from "./Pages/Room";
import { createContext, useEffect, useState } from "react";
import Signup from "./Pages/SignUp";
import Login from "./Pages/Login";
import { Session, User } from "@supabase/supabase-js";
import { supabaseClient } from "@/main";
import { useQuery } from "react-query";
import FourOhFour from "./Pages/FourOhFour";

export interface IToggleSideBar{
    ShowSide:Boolean,
    setShowSide:(e:boolean)=>void
}

export const UserCTX = createContext<User|null>(null)

const getUserId = async () => {
  const data = (await supabaseClient.auth.getUser())
  return data
}

function App() {
  const [session, setSession] = useState<Session|null>(null)
  const [ShowSide, setShowSide] = useState(false)
  const [user,setUser] = useState<User|null>(null)
  const [room_name,setUser_name] = useState("") 
  
  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user!)
    },)

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!session) {
    return (
      <Routes >
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    )
  }

  return (
    <>
  
    <UserCTX.Provider value={user!}>
      <MainNav ShowSide={ShowSide} setShowSide={(e: boolean) => setShowSide(e)} />
      <Routes>
        <Route path="/" element={<Room SideBarShown={ShowSide} />} >
          <Route path="/:RoomName"

          element={<Room SideBarShown={ShowSide} />} />
        </Route>
      <Route path="*" element={<FourOhFour/>} />
      </Routes>
    </UserCTX.Provider>
    </>
  )
};

export default App
