import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

export default function IndexUserWithNisn() {
    const nav = useNavigate()
    useEffect(() => {
        import("../../service/constant").then(({getAuthorizeUser}) => {
            if(!getAuthorizeUser()) {
                nav("/auth/login_user")
                return;
            }
            const timeOut = setTimeout(() => {
                 nav("/cbt")
             }, 3000)
             return () => clearTimeout(timeOut)
        })

    }, [nav])


    return(
        <>
            Tunggu sebentar
        </>
    )
}

