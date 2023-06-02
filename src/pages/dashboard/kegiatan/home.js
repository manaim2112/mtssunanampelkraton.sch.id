import { Button, Typography } from "@material-tailwind/react";
import useDocumentTitle from "../../../elements/useDocumentTitle";
import { useEffect, useState } from "react";
import { countKegiatan, getKegiatanWithPage } from "../../../service/kegiatan";
import { Link, useNavigate } from "react-router-dom";

export default function HomeKegiatanDashboard() {
    useDocumentTitle("Kegiatan Sekolah")
    const [count, setCount] = useState(0)
    const [page, setPage] = useState(1)
    const [data, setData] = useState([])
    const nav = useNavigate()
    useEffect(() => {
        countKegiatan().then(c => {
            setCount(c)
        })
        console.log("count")
    }, [count])

    useEffect(() => {
        getKegiatanWithPage(page).then(r => {
            setData(r)
        })
        console.log("page")
    }, [page])

    const prevHandler = () => {
        if(page > 1) {
            setPage(page-1)
        }
    }
    const nextHandler = () => {
        const total = Math.ceil(count/10)
        if(page < total) {
            setPage(page+1)
        }
    }
    return(
        <>
            <Typography variant="h2">Kegiatan Sekolah</Typography>
            
            <div className="mb-4 mt-8">
                <Button onClick={() => nav("/dashboard/kegiatan/create")} color="blue" variant="gradient" ripple>+ TAMBAH KEGIATAN</Button>

            </div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mb-3">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Nama kegiatan
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Tanggal
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <span className="sr-only">Edit</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        data.map((e,k) => (
                            <tr key={k} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {e.name}
                                </th>
                                <td className="px-6 py-4">
                                    {atob(e.updated_at)}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link to={"/dashboard/kegiatan/id/"+ e.id} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</Link>
                                </td>
                            </tr>
                        ))
                    }

                    </tbody>
                </table>
            </div>
            <div className="flex items-center justify-center col-span-2 mb-2">
                <div className="flex items-center justify-between w-full text-gray-600 dark:text-gray-400 bg-gray-100 rounded-lg dark:bg-gray-600 max-w-[128px] mx-2">
                    <button type="button" onClick={prevHandler} className="inline-flex items-center justify-center h-8 px-1 bg-gray-100 rounded-l-lg dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-800">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path clipRule="evenodd" fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"></path>
                        </svg>
                        <span className="sr-only">Previous page</span>
                    </button>
                    <span className="flex-shrink-0 mx-1 text-sm font-medium">1 of {count}</span>
                    <button type="button" onClick={nextHandler} className="inline-flex items-center justify-center h-8 px-1 bg-gray-100 rounded-r-lg dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-800">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path clipRule="evenodd" fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"></path>
                        </svg>
                        <span className="sr-only">Next page</span>
                    </button>
                </div>
            </div>

        </>
    )
}