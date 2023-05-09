import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { changePriorityCBT_list, getCBT } from "../../../service/dashboard/cbt";
import { Checkbox, Input } from "@material-tailwind/react";

export function TableCBTElement({Live}) {
    const [live, setLive] = useState([])
    const ChangePriority = (event, id) => {
        
        changePriorityCBT_list(Number(id), event.target.checked).then(e => {
            console.log(e, id)
        })
        
    }
    useEffect(() => {
        getCBT().then(d => {
            setLive(d)
        })
    }, [live])
    return(
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">

                            </th>
                            <th scope="col" className="px-6 py-3">
                                Nama
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Jenis
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Durasi (menit)
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Minim selesai (menit)
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Dimulai
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Selesai
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Acak
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Kode
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Kelas
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <span className="sr-only">Edit</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            live.map((e,k) => (
                                <tr key={k} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        <Checkbox onChange={(event) => ChangePriority(event, e.id)} checked={e.priority}/>
                                    </th>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                       {e.name}
                                    </th>
                                    <td className="px-6 py-4">
                                        {e.jenis}
                                    </td>
                                    <td className="px-6 py-4">
                                        {e.durasi}
                                    </td>
                                    <td className="px-6 py-4">
                                        {e.min_durasi}
                                    </td>
                                    <td className="px-6 py-4">
                                        {e.mulai}
                                    </td>
                                    <td className="px-6 py-4">
                                        {e.berakhir}
                                    </td>
                                    <td className="px-6 py-4">
                                        {e.acak ? (
                                            <span className="bg-lime-300 rounded-lg py-1 px-2 text-lime-800"> YA </span>
                                        ) : (
                                            <span className="bg-red-500 rounded-lg py-1 px-2 text-white"> TIDAK </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {e.code}
                                    </td>
                                    <td className="px-6 py-4">
                                        {e.tokelas}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link to={"/dashboard/cbt/id/" + e.id} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</Link>
                                    </td>
                                </tr>

                            ))
                        }
                    </tbody>
                </table>
            </div>
    )
}