import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
export default function CBTIndex() {
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
    useEffect(() => {
        if(!window.sessionStorage.getItem("refresh-token")) {
            nav("/auth/login_user?redirect=/cbt")
            return;
        }
    }, [])
    

    return(
        <div className="h-screen bg-gradient-to-tr from-blue-gray-200 via-yellow-100 to-green-100">
            <Outlet></Outlet>
            
        </div>
    )
}