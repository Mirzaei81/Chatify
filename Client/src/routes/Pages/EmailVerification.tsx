import { useNavigate } from "react-router-dom"
export default function EmailVerificaiton() {
  const navigate = useNavigate()
  setTimeout(() => navigate("/"), 5000)
  return (
    <div>
      لطفا ایمیل خود را تایید کنید
    </div>
  )
}
