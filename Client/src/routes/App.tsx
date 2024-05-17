import MainNav from "./Pages/MainNav"
import { Route, Routes, } from "react-router-dom";
import Room from "./Pages/Room";
import { createContext, useEffect, useState } from "react";
import Signup from "./Pages/SignUp";
import Login from "./Pages/Login";
import { Session, User } from "@supabase/supabase-js";
import { supabaseClient } from "@/main";
import FourOhFour from "./Pages/FourOhFour";
import EmailVerificaiton from "./Pages/EmailVerification";
import Loading from "./Pages/Loading";

export interface IToggleSideBar {
  ShowSide: boolean,
  setShowSide: (e: boolean) => void
}

export const UserCTX = createContext<User | null>(null)

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [ShowSide, setShowSide] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [Load, setLoading] = useState(true)

  useEffect(() => {
    try {
      supabaseClient.auth.getSession().then(({ data: { session } }) => {
        setSession(session)
        setUser(session?.user!)
        setLoading(false)
      },)

      const {
        data: { subscription },
      } = supabaseClient.auth.onAuthStateChange((_event, session) => {
        setSession(session)
      })

      return () => subscription.unsubscribe()
    } catch (e) { console.log(e) }
  }, [])
  if (Load) {
    return (<Loading />)
  }

  if (!session) {
    return (
      <Routes >
        <Route path="/" element={<Login />} />
        <Route path="/email_verification" element={<EmailVerificaiton />} />
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
          <Route path="*" element={<FourOhFour />} />
        </Routes>
      </UserCTX.Provider>
    </>
  )
};

export default App
