import { useState } from "react"
import { useEffect } from "react"
import { getCBTResultWIthListId } from "../../../service/cbt/result"
import { Link, useParams } from "react-router-dom"
import { getStudent } from "../../../service/dashboard/users"
import { RemoveResultWithId, getWithIdCBT } from "../../../service/dashboard/cbt"
import { SkeletonTable } from "../../../elements/skeleton/table"
import { Suspense } from "react"
import { Chip, IconButton, Typography } from "@material-tailwind/react"
import Swal from "sweetalert2"

export function ResultCBT() {
    const {id} = useParams()
    const [result, setResult] = useState([])
    const [kelas, setKelas] = useState([])
    const [list, setList] = useState([])
    const [user, setUser] = useState([])
    const [waiting, setWaiting] = useState(true)
    useEffect(() => {
        getResult()
    }, [])

    const getResult = () => {
        getCBTResultWIthListId(id).then(e => {
            setResult(e)
            getWithIdCBT(id).then(l => {
                setList(l)
                const k = l.tokelas.split(",").map(u => u.trim())
                setKelas(k)
                getStudent(k[0]).then(ruser => {
                    setUser(ruser)
                    setWaiting(false)
                })
            })
            
        })
    }
    const resetResult = (id) => {
        const index = result.findIndex(Obj => Obj.iduser === id)
        if(index === -1) return;

        Swal.fire({
            "title" : "Warning",
            "icon" : "warning",
            "text" : "Anda Yakin ingin Reset hasil peserta didik ini ?",
            "showCancelButton" : true,
            "cancelButtonText" : "Tidak jadi",
            "confirmButtonText" : "reset saja",
            "cancelButtonColor" : "gray",
            "confirmButtonColor" : "red"
        }).then(e => {
            if(e.isConfirmed) {
                RemoveResultWithId(result[index].id).then(r => {
                    if(!r) return Swal.fire({
                        title : "Gagal Hapus",
                        icon : "error",
                        showConfirmButton : false
                    })
                    setWaiting(true)
                    getResult();

                    Swal.fire({
                        title : "Berhasil di Reset",
                        icon : "success",
                        text : "Silahkan refresh kembali untuk bisa melakukan pengujian",
                        showConfirmButton : false
                    })
                })
            }
        })
    }
    const status = (id) => {
        try {
            return result[result.findIndex(Obj => Obj.iduser === id)].process
        } catch (error) {
            return null
        }
    }
    if(waiting) return (
        <>
            <SkeletonTable/>
        </>
    )
    return(
        <Suspense fallback={"Menunggu Permintaan"}>
            <Typography variant="h3">Hasil {list.tipe} pada {list.name}</Typography>
            <div className="mt-5">
                {
                    kelas.map((e,k)=> (
                        <IconButton key={k} value={e} onClick={() => {
                            getStudent(e).then(ruser => {
                                setUser(ruser)
                            })
                        }} className="mx-1">{e}</IconButton>
                    ))
                }
            </div>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mt-4">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Absen
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Nama
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Kelas
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Progress
                            </th>
                            <th scope="col" className="px-6 py-3">
                                cek hasil
                            </th>
                            <th scope="col" className="px-6 py-3">
                                
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        user.map((e,k) => (
                            <tr key={k} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4">{k+1}</td>
                                <td className="px-6 py-4">{e.name}</td>
                                <td className="px-6 py-4">{e.kelas}</td>
                                <td className="px-6 py-4">{
                                    status(e.id) === "start" ? (
                                        <Chip color="orange" value={"Sedang mengerjakan"}/>
                                    ) : status(e.id) === "finish" ? (
                                        <Chip color="green" value={"Tuntas"}/>
                                    ) : (
                                        <>
                                            <Chip color="gray" value={"Belum Absen"}/>
                                        </>
                                    )
                                }</td>
                                <td>
                                    {
                                        status(e.id) === "finish" ? (
                                            <Link className="text-blue-400 hover:text-blue-600 hover:underline" to={"/dashboard/cbt/id/"+ id + "/result/"+ e.id +"/view"}>Cek Hasil</Link>
                                        ) : "Cek Hasil"
                                    }
                                    <span className="ml-3 text-red-400 hover:text-red-600 hover:underline" onClick={() => resetResult(e.id)}> Reset </span>
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
            </table>
        </Suspense>
    )
}