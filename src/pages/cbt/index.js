import { Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
export function CBTIndex() {
    // const videoRef = useRef(null);
    const nav = useNavigate()
    // useEffect(() => {
    //     navigator.mediaDevices.getUserMedia({ video: true })
    //     .then(stream => {
    //         videoRef.current.srcObject = stream;
    //         videoRef.current.play();
    //     })
    //     .catch(error => console.error('Error accessing camera:', error));
    // }, []);
    const [notif, setNotif] = useState(false)
    const [countFocus, setCountFocus] = useState(0)
    if(document.onfocus) {
        console.log("focus")
    } else {
        console.log("tida  fokus")
    }
    // useEffect(() => {

    //     const g = window.sessionStorage.getItem("notif")
    //     if(g) {
    //         setNotif(g)
    //     }

    //     document.addEventListener("visibilitychange", (event) => {
    //         if (document.visibilityState === "visible") {
    //           console.log("tab is active")
    //         } else {
    //             const tt = setTimeout(() => {
    //                 window.sessionStorage.setItem("notif", true)
    //                 setNotif(true)
    //                 if(document.visibilityState !== "visible") {
    //                     setNotif(false)
    //                 }
    //             }, 10*1000)

    //           console.log("tab is inactive")
    //         }
    //       });
    // }, [])

    useEffect(() => {
        if(!window.sessionStorage.getItem("refresh-token")) {
            nav("/auth/login_user?redirect=/cbt")
            return;
        }
    }, [])
    
    if(notif) {
        return(
            <>
                <div className="fixed h-screen w-full bg-red-400 text-white p-8 text-center">
                    <div className="mt-32">
                        <Typography variant="h2">
                            Anda Terdeteksi Tidak Fokus pada ujian, silahkan hubungi pengawas
                        </Typography>
                    </div>
                </div>
            </>
        )
    }
    return(
        <div className="h-screen bg-gradient-to-tr from-blue-gray-200 via-yellow-100 to-green-100">
            <Outlet></Outlet>
            
        </div>
    )
}