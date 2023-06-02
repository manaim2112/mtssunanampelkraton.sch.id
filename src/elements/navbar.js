import { useEffect, useState } from "react"
import { getHeaderDataService } from "../service/home"
import { Link } from "react-router-dom"

export default function NavbarElement({active}) {
    const [head, setHead] = useState([])
    useEffect(() => {
        getHeaderDataService().then(d => {
            setHead(d)
        })
    }, [])
    return(
        <>
            <nav className=" rounded-t-3xl border-gray-200 dark:bg-gray-900 position-fixed z-50 w-full">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
                    <a href="https://flowbite.com" className="flex items-center">
                        <img src={head.logo} className="h-8 mr-3" alt="Flowbite Logo" />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">{head.logoname}</span>
                    </a>
                    <div className="flex items-center">
                        <Link to="tel:5541251234" className="mr-6 text-sm  text-gray-500 dark:text-white hover:underline">{head.phone}</Link>
                        <Link to="/auth/login_user" className="text-sm  text-blue-600 dark:text-blue-500 hover:underline">Login</Link>
                    </div>
                </div>
            </nav>
            <nav className="bg-gray-50 dark:bg-gray-700">
                <div className="max-w-screen-xl px-4 py-3 mx-auto">
                    <div className="flex items-center overflow-auto">
                        <ul className="flex flex-row font-medium mt-0 mr-6 space-x-8 text-sm">
                            <li>
                                <Link to="/" className="text-gray-900 dark:text-white hover:underline" aria-current="page">Home</Link>
                            </li>
                            <li>
                                <Link to="/berita" className="text-gray-900 dark:text-white hover:underline">Berita</Link>
                            </li>
                            <li>
                                <Link to="/kegiatan" className="text-gray-900 dark:text-white hover:underline">Kegiatan</Link>
                            </li>
                            <li>
                                <Link to="/unduhan" className="text-gray-900 dark:text-white hover:underline">File unduhan</Link>
                            </li>
                            <li>
                                <Link to="/ppdb" className="text-gray-900 dark:text-white hover:underline">PPDB</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

        </>
    )
}