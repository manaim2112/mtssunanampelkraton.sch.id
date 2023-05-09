import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export function SidebarDashboard({active}) {
    const [act, setAct] = useState("home")
    const nav = useNavigate()
    useEffect(() => {
        setAct(active)
    }, [active])
    return(
        <>
            <div className="text-3xl font-righteous text-right pr-8 text-white">YAMI-sis</div>
                    <ul className="text-center mx-auto">
                        <li onClick={() => nav("/dashboard")} className="cursor-pointer flex items-center text-md text-blue-600 bg-white px-4 py-2 rounded-full">
                            Home
                        </li>
                    </ul>
                    <h3 className="mt-5 text-white">
                        Pembelajaran online
                    </h3>
                    <ul className="text-center mx-auto">
                        { act === "materi" ? (
                            <li className="cursor-pointer flex items-center mt-1 text-md text-blue-600 bg-white px-4 py-2 rounded-full">
                                Materi
                            </li>
                        ) : (
                            <li onClick={() => nav("/dashboard/materi")} className="cursor-pointer flex items-center mt-1 text-md text-white hover:text-blue-600 hover:bg-white px-4 py-2 rounded-full">
                                Materi
                            </li>
                        )}

                        {
                            act === "penugasan" ? (
                                <li className=" cursor-pointer flex items-center mt-1 text-md text-blue-600 bg-white px-4 py-2 rounded-full">
                                    Penugasan
                                </li>
                            ) : (
                                <li onClick={() => nav("/dashboard/penugasan")} className=" cursor-pointer flex items-center mt-1 text-md text-white hover:text-blue-600 hover:bg-white px-4 py-2 rounded-full">
                                    Penugasan
                                </li>

                            )
                        }

                        {
                            act === "cbt" ? (
                                <li className="cursor-pointer flex items-center mt-1 text-md text-blue-600 bg-white px-4 py-2 rounded-full">
                                    CBT (Computer Based Test)
                                </li>
                            ) : (
                                <li onClick={() => nav('/dashboard/cbt')} className="cursor-pointer flex items-center mt-1 text-md text-white hover:text-blue-600 hover:bg-white px-4 py-2 rounded-full">
                                    CBT (Computer Based Test)
                                </li>

                            )
                        }
                    </ul>
                    <h3 className="mt-5 text-white">
                        Pengelolaan Peserta didik
                    </h3>
                    <ul className="text-center mx-auto">
                        {
                            act === "guru" ? (
                                <li className="cursor-pointer flex items-center mt-1 text-md text-blue-600 bg-white px-4 py-2 rounded-full">
                                    Data Guru
                                </li>
                            ) : (
                                <li onClick={() => nav("/dashboard/guru")} className="cursor-pointer flex items-center mt-1 text-md text-white hover:text-blue-600 hover:bg-white px-4 py-2 rounded-full">
                                    Data Guru
                                </li>
                            )
                        }
                        {
                            act === "peserta didik" ? (
                                <li className=" cursor-pointer flex items-center mt-1 text-md text-blue-600 bg-white px-4 py-2 rounded-full">
                                    Peserta Didik
                                </li>
                            ) : (
                                <li onClick={() => nav("/dashboard/users")} className=" cursor-pointer flex items-center mt-1 text-md text-white hover:text-blue-600 hover:bg-white px-4 py-2 rounded-full">
                                    Peserta Didik
                                </li>
                            )
                        }
                        <li className=" cursor-pointer flex items-center mt-1 text-md text-white hover:text-blue-600 hover:bg-white px-4 py-2 rounded-full">
                            PPDB
                        </li>
                    </ul>
                    <h3 className="mt-5 text-white">
                        Pengelolaan Situs
                    </h3>
                    <ul className="text-center mx-auto">
                        <li className="cursor-pointer flex items-center mt-1 text-md text-white hover:text-blue-600 hover:bg-white px-4 py-2 rounded-full">
                            Blog/Content
                        </li>
                        <li className=" cursor-pointer flex items-center mt-1 text-md text-white hover:text-blue-600 hover:bg-white px-4 py-2 rounded-full">
                            Kegiatan
                        </li>
                    </ul>
                    <h3 className="mt-5 text-white">
                        Lainnya
                    </h3>
                    <ul className="text-center mx-auto">
                        <li className="cursor-pointer flex items-center mt-1 text-md text-white hover:text-blue-600 hover:bg-white px-4 py-2 rounded-full">
                            Pengaturan 
                        </li>
                        <li className=" cursor-pointer flex items-center mt-1 text-md text-white hover:text-blue-600 hover:bg-white px-4 py-2 rounded-full">
                            Keluar
                        </li>
                    </ul>
        </>
    )
}