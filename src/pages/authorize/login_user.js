import { useState } from "react";
import useDocumentTitle from "../../elements/useDocumentTitle";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Suspense } from "react";
import { SkeletonTable } from "../../elements/skeleton/table";
import { lazy } from "react";
import { startTransition } from "react";


const NavbarElement = lazy(() => import("../../elements/navbar"))

export default function IndexLoginUser() {
    useDocumentTitle("Masuk sebagai Peserta didik")
    const [nisn, setNisn] = useState("")
    const [sandi, setSandi] = useState("")
    const [isLoading, setLoading] = useState(false)
    const [alert, setAlert] = useState(false)
    let [searchParams] = useSearchParams();
    const nav = useNavigate()
    const getToken = window.sessionStorage.getItem("refresh-token")
    if(getToken) {
            const redirect = searchParams.get("redirect")
            const json = JSON.parse(atob(getToken))
            if (redirect == null) {
                nav("/user/"+ json.nisn)
            } else {
                nav(redirect)
            }

    }

    const LoginButton = () => {
        setLoading(true)
        setAlert(false)
        import("../../service/authorize").then(({LoginWithUser}) => {
            LoginWithUser(nisn, sandi).then(e => {
                if(e) {
                    window.sessionStorage.setItem("refresh-token", e)
                    const redirect = searchParams.get("redirect")
                    const json = JSON.parse(atob(e))
                    if (redirect == null) {
                        nav("/user/"+ json.nisn)
                    } else {
                        nav(redirect)
                    }
                } else {
                    setAlert(true)
                }
    
                setLoading(false)
            }).catch(err => {
                setLoading(false)
            })
        })
    }
    return (
        <Suspense fallback={<SkeletonTable/>}>
            <NavbarElement/>

            <div className="w-64 mx-auto mt-11">    
                <h2 className="text-3xl">Masuk Sebagai Peserta Didik</h2>
                { alert ? (
                    <div id="alert-border-4" className="flex p-4 mb-4 text-yellow-800 border-t-4 border-yellow-300 bg-yellow-50 dark:text-yellow-300 dark:bg-gray-800 dark:border-yellow-800" role="alert">
                        <svg className="flex-shrink-0 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                        <div className="ml-3 text-sm font-medium">
                        Nomer Induk Sekolah Nasional (NISN) atau Kata sandi anda salah <Link to="#" className="font-semibold underline hover:no-underline">Lupa sandi ?</Link>. Silahkan hubungi operator sekolah.
                        </div>
                        <button type="button" className="ml-auto -mx-1.5 -my-1.5 bg-yellow-50 text-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-400 p-1.5 hover:bg-yellow-200 inline-flex h-8 w-8 dark:bg-gray-800 dark:text-yellow-300 dark:hover:bg-gray-700" data-dismiss-target="#alert-border-4" aria-label="Close" onClick={() => setAlert(false)}>
                        <span className="sr-only">Dismiss</span>
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        </button>
                    </div>
                ) : "" }
                
                <div className="mb-6 mt-8">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nomer Induk Standart Nasional (NISN)</label>
                    <input type="email" id="email" onChange={(event) => setNisn(event.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="128237xxxX" required/>
                </div>
                <div className="mb-6">
                    <label htmlFor="password"  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Kata Sandi</label>
                    <input type="password" id="password" onChange={(event) => setSandi(event.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                </div>
                <div className="flex items-start mb-6">
                    <div className="flex items-center h-5">
                    <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required/>
                    </div>
                    <label htmlFor="remember" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
                </div>
                <button type="submit" onClick={LoginButton} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:bg-blue-400" disabled={isLoading}>
                    { isLoading ? (
                        <div className="flex">
                            <svg aria-hidden="true" className="w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg> Prosesing ...
                        </div>
                    ) : "Masuk sekarang"}
                    </button>

                <div className="mt-5">
                    <Link to={"/auth/login_admin"} className="text-sm hover:text-blue-400 hover:underline">Masuk Sebagai Pegawai ?</Link>
                </div>
            </div>
        </Suspense>
    )

}