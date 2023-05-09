import { useNavigate } from "react-router-dom"
import { getAuthorizeUser } from "../../service/constant"

export function IndexUser() {
    const u = getAuthorizeUser()
    const nav = useNavigate()
    if(!u) {
        nav("/auth/login_user")
        return;
    }


    setTimeout(() => {
        nav("/cbt")
    }, 3000)
    return(
        <>
            Tunggu sebentar
        </>
    )
}

