import { NextUIProvider} from "@nextui-org/react";
import MainNav from "./Pages/MainNav"
import { Route,Routes, useNavigate } from "react-router-dom";
import Index from "./Pages/index"
function App() {
  const navigate = useNavigate();
  return (
    <NextUIProvider navigate={navigate}>
      <MainNav/>
      <Routes>
        <Route path="/" element=<Index/>>
        </Route>
      </Routes>
    </NextUIProvider>
  )
};

export default App
