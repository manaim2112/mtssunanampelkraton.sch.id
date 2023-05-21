import { useRef, useState } from "react"
import { useEffect } from "react"
import { getCBTResultWIthListId } from "../../../service/cbt/result"
import { Link, useParams } from "react-router-dom"
import { getStudent } from "../../../service/dashboard/users"
import { RemoveResultWithId, getWithIdCBT } from "../../../service/dashboard/cbt"
import { SkeletonTable } from "../../../elements/skeleton/table"
import { Suspense } from "react"
import { Button, Chip, IconButton, Typography } from "@material-tailwind/react"
import Swal from "sweetalert2"
import jsPDF from "jspdf"

export function ResultCBT() {
    const {id} = useParams()
    const [result, setResult] = useState([])
    const [kelas, setKelas] = useState([])
    const [list, setList] = useState([])
    const [user, setUser] = useState([])
    const [waiting, setWaiting] = useState(true)
    const [v, setV] = useState("9A")
    const HtmlRef = useRef(null)

    useEffect(() => {
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
    }, [id])

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

    const handleSaveAsPDF = () => {
        const element = HtmlRef.current;
        const pdf  = new jsPDF({
            orientation: 'p',
            unit: 'pt',
            format: 'legal',
            putOnlyUsedFonts:true,
            floatPrecision: 16, // or "smart", default is 16,
            compress : true,
           })
           pdf.setFont("helvetica");
            pdf.setFontSize(12);
            pdf.context2d.scale(.7, .6)
           pdf.html(element, {
            margin : .5,
            callback: function (doc) {
              doc.save(list.name + "_" + v + "_" + Date.now());
            },
            x: 10,
            y: 10
         });
        // var opt = {
        //     filename:     'myfile-'+ Date.now() +'.pdf',
        //     margin : 2.5,
        //     pagebreak: { mode: 'avoid-all' },
        //     jsPDF: { unit: 'pt', format: 'legal', orientation: 'portrait' }
        //   };
        // html2pdf().set(opt).from(element).toContainer().save();
    };

    if(waiting) return (
        <>
            <SkeletonTable/>
        </>
    )
    return(
        <Suspense fallback={"Menunggu Permintaan"}>
            <Typography variant="h3">Hasil {list.tipe} pada {list.name}</Typography>
            <div className="flex gap-4">
                <div className="mt-5">
                    {
                        kelas.map((e,k)=> (
                            <IconButton key={k} value={e} onClick={() => {
                                setV(e)
                                getStudent(e).then(ruser => {
                                    setUser(ruser)
                                })
                            }} className="mx-1" variant={ e === v ? "gradient" : "outlined"} selected>{e}</IconButton>
                        ))
                    }
                </div>
                <div className="mt-5">
                    <Button onClick={handleSaveAsPDF} color="purple">Print Absensi</Button>
                </div>
            </div>
            <table ref={HtmlRef} className="w-full text-sm text-left text-black dark:text-gray-400 mt-4">
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
                            <tr key={k} className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 ${k % 19 === 0 ? "page-break" : ""}`}>
                                <td className="px-6 py-1">{k+1}</td>
                                <td className="px-6 py-1">{e.name}</td>
                                <td className="px-6 py-1">{e.kelas}</td>
                                <td className="px-6 py-1">{
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