import { useNavigate} from "react-router-dom"
import getUserName from "../../utils/getUserName"
export default function SecurityWrapper(){
  const navigate = useNavigate()
  const user = getUserName()
  if (user===null){
    navigate("/Login")
  }
}
