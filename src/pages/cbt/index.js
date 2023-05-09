import { getAuthorizeUser } from "../../service/constant";
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
    if(!getAuthorizeUser()) {
        nav("/auth/login_user?redirect=/cbt")
    }

    return(
        <>
            <Outlet></Outlet>
            
        </>
    )
}