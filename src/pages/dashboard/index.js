import { Outlet, useNavigate, useOutletContext } from "react-router-dom";
import { NavbarDashboard } from "./element/navbar";
import { Typography } from "@material-tailwind/react";

export function IndexDashboard() {
    const nav = useNavigate()

    const Auth = window.sessionStorage.getItem("refresh-admin")
    if(!Auth) {
        nav("/auth/login_admin")
    }

    // useEffect(() => {
    // }, [])
    return(
        <>
            <NavbarDashboard/>
            <div className="px-12">
                <Outlet/>   

            </div>
            <footer className="w-full bg-white p-8">
      
      <hr className="my-8 border-blue-gray-50" />
      <Typography color="blue-gray" className="text-center font-normal">
        &copy; 2023 MTs Sunan Ampel Kraton
      </Typography>
    </footer>
            {/* <div className="grid grid-cols-5">
                <div className="px-2 lg:col-span-1 md:col-span-2 md:block lg:block xl:block max-xl:block hidden bg-blue-600 rounded-r-xl pt-5 shadow-xl">
                    <SidebarDashboard active={sidebarActive} setActive={setSidebarActive}/>
                </div>
                <div className="lg:col-span-4 md:-col-span-3 col-span-5 h-screen overflow-auto">
                            

                    <div className="bg-white p-4">
                        <Outlet context={{sidebarActive, setSidebarActive}} />   
                    </div>
                </div>
            </div> */}
        </>
    )
}

export function useSidebarActive() {
    return useOutletContext();
}