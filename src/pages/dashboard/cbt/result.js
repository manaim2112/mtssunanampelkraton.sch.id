import { useRef, useState } from "react"
import { useEffect } from "react"
import { getCBTResultWIthListId } from "../../../service/cbt/result"
import { Link, useParams } from "react-router-dom"
import { getStudent } from "../../../service/dashboard/users"
import { RemoveResultWithId, getDataWithIdCBT, getWithIdCBT } from "../../../service/dashboard/cbt"
import { SkeletonTable } from "../../../elements/skeleton/table"
import { Suspense } from "react"
import { Chip, IconButton, Typography } from "@material-tailwind/react"
import Swal from "sweetalert2"
import jsPDF from "jspdf"
import { JSONParse } from "../../../service/constant"
import { PrinterIcon, SignalIcon } from "@heroicons/react/24/outline"
import XLSX from "xlsx"
import { getUserWithKelas } from "../../../service/cbt/user"

export function ResultCBT() {
    const {id} = useParams()
    const [result, setResult] = useState([])
    const [kelas, setKelas] = useState([])
    const [list, setList] = useState([])
    const [user, setUser] = useState([])
    const [soal, setSoal] = useState([])
    const [waiting, setWaiting] = useState(true)
    const [score, setScore] = useState([])
    const [v, setV] = useState(null)
    const HtmlRef = useRef(null)
    const [load, setLoad] = useState(false)
    const [loadExportToExcel, setLoadExportToExcel] = useState(false)

    useEffect(() => {
        processData()
    }, [id, v])

    const processData = () => {
        setLoad(true)
        getCBTResultWIthListId(id).then(e => {
            setResult(e)
            getDataWithIdCBT(id).then(so => {
                setSoal(so)
                getWithIdCBT(id).then(l => {
                    setList(l)
                    const k = l.tokelas.split(",").map(u => u.trim())
                    setKelas(k)
                    const settKe = v ? v : k[0];
                    getStudent(settKe).then(ruser => {
                        const myscore = [];
                        ruser.forEach(element => {
                            const index = e.findIndex(Obj => Obj.iduser === element.id)
                            if(index === -1) return myscore.push(0)
                            const ans = JSONParse(e[index].answer)
                            if(ans.length === 0) {
                                myscore.push(0)
                            } else {
                                const scoreItem = [];
                                so.forEach(sss => {
                                    const indexAns = ans.findIndex(OO => OO[0] === sss.id);
                                    if(indexAns === -1) {
                                        return scoreItem.push(0)
                                    }
                                    if(!ans[indexAns][1]) {
                                        return scoreItem.push(0)
                                    }
                                    if(ans[indexAns][1].length === 0) {
                                        return scoreItem.push(0)
                                    }
                                    switch(sss.tipe) {
                                        case "pilgan" : 
                                            if(JSON.stringify(ans[indexAns][1].sort((a,b) => a-b)) === JSON.stringify(JSONParse(sss.answer).sort((a,b) => a-b))) {
                                                scoreItem.push(sss.score)
                                            } else {
                                                scoreItem.push(0)
                                            }
                                        break;
                                        case "isian_singkat" :
                                            if(ans[indexAns][1] === JSONParse(sss.answer)[0]) {
                                                scoreItem.push(sss.score)
                                            }else {
                                                scoreItem.push(0)
                                            }
                                        break;
                                        case "isian_panjang" :
                                            if(ans[indexAns][2]) {
                                                scoreItem.push(sss.score)
                                            } else {
                                                scoreItem.push(0)
                                            }
                                        break;
                                        default : 
                                            scoreItem.push(0)
                                        
                                    }
                                })
                                myscore.push(scoreItem.reduce((a,b) => Number(a) + Number(b)))
                            }
                        });
                        setScore(myscore)
                        setUser(ruser)
                        setWaiting(false)
                        setLoad(false)
                    })
                })
            })
            
        })
    }

    const exportToExcel = () => {
        setLoadExportToExcel(true)
        const ll = list.tokelas.split(",").map(e => e.trim())
        getUserWithKelas(ll).then(response => {
            const workbook =  XLSX.utils.book_new()
            response.forEach((user, keyUser) => {
                // Check Score
                const myscore = [];
                user.forEach(element => {
                    const index = result.findIndex(Obj => Obj.iduser === element.id)
                    if(index === -1) return myscore.push(0)
                    const ans = JSONParse(result[index].answer)
                    if(ans.length === 0) {
                        myscore.push(0)
                    } else {
                        const scoreItem = [];
                        soal.forEach(sss => {
                            const indexAns = ans.findIndex(OO => OO[0] === sss.id);
                            if(indexAns === -1) {
                                return scoreItem.push(0)
                            }
                            if(!ans[indexAns][1]) {
                                return scoreItem.push(0)
                            }
                            if(ans[indexAns][1].length === 0) {
                                return scoreItem.push(0)
                            }
                            switch(sss.tipe) {
                                case "pilgan" : 
                                    if(JSON.stringify(ans[indexAns][1].sort((a,b) => a-b)) === JSON.stringify(JSONParse(sss.answer).sort((a,b) => a-b))) {
                                        scoreItem.push(sss.score)
                                    } else {
                                        scoreItem.push(0)
                                    }
                                break;
                                case "isian_singkat" :
                                    if(ans[indexAns][1] === JSONParse(sss.answer)[0]) {
                                        scoreItem.push(sss.score)
                                    }else {
                                        scoreItem.push(0)
                                    }
                                break;
                                case "isian_panjang" :
                                    if(ans[indexAns][2]) {
                                        scoreItem.push(sss.score)
                                    } else {
                                        scoreItem.push(0)
                                    }
                                break;
                                default : 
                                    scoreItem.push(0)
                                
                            }
                        })
                        myscore.push(scoreItem.reduce((a,b) => Number(a) + Number(b)))
                    }
                });
                // End score
                const rows = [];
                user.forEach((u, k) => {
                    rows.push({
                        Absen : k+1,
                        Nisn : u.nisn,
                        Nama : u.name,
                        Kelas : u.kelas,
                        Progress : status(u.id) === "start" ? "Sedang mengerjakan" : status(u.id) === "finish" ? "Tuntas" : "Belum Absen",
                        Nilai : myscore[k]
                    })
                })
                const worksheet = XLSX.utils.json_to_sheet(rows);
                XLSX.utils.book_append_sheet(workbook, worksheet, ll[keyUser])
            })
            XLSX.writeFile(workbook, list.name + "_RekapNilai_"+ Date.now() +".xlsx", { compression: true });
            setLoadExportToExcel(false)
        })
        // writeXLSX
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
                    setV(v)

                    Swal.fire({
                        title : "Berhasil di Reset",
                        icon : "success",
                        text : "Silahkan refresh kembali untuk bisa melakukan pengujian",
                        showConfirmButton : false
                    })
                    return processData();
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
            pdf.context2d.scale(.5, .6)
           pdf.html(element, {
            margin : .5,
            width : pdf.internal.pageSize.getWidth(),
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
            <div className="flex flex-nowrap gap-4">
                <div className="mt-5">
                    {
                        kelas.map((e,k)=> (
                            <IconButton key={k} value={e} onClick={() => {
                                setV(e)
                                
                            }} className="mx-1" variant={ e === v ? "gradient" : "outlined"} selected>{e}</IconButton>
                        ))
                    }
                </div>
            </div>
        {
            load ? (
                <SkeletonTable/>
            ) : (
                <table ref={HtmlRef} className="w-full text-sm text-left text-black dark:text-gray-400 mt-4 print">
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
                                    Nilai
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
                                    <td className="px-6 py-1">{score[k]}</td>

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
            )
        }

        <div className="fixed z-50 bottom-5 right-5">
            <IconButton onClick={exportToExcel} color="green" variant="gradient" className="ml-3" disabled={loadExportToExcel}>
                {
                    loadExportToExcel ? (
                        <SignalIcon className="w-4 h-4 animate-spin"></SignalIcon>
                    ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-filetype-xlsx" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM7.86 14.841a1.13 1.13 0 0 0 .401.823c.13.108.29.192.479.252.19.061.411.091.665.091.338 0 .624-.053.858-.158.237-.105.416-.252.54-.44a1.17 1.17 0 0 0 .187-.656c0-.224-.045-.41-.135-.56a1.002 1.002 0 0 0-.375-.357 2.028 2.028 0 0 0-.565-.21l-.621-.144a.97.97 0 0 1-.405-.176.37.37 0 0 1-.143-.299c0-.156.061-.284.184-.384.125-.101.296-.152.513-.152.143 0 .266.023.37.068a.624.624 0 0 1 .245.181.56.56 0 0 1 .12.258h.75a1.093 1.093 0 0 0-.199-.566 1.21 1.21 0 0 0-.5-.41 1.813 1.813 0 0 0-.78-.152c-.293 0-.552.05-.777.15-.224.099-.4.24-.527.421-.127.182-.19.395-.19.639 0 .201.04.376.123.524.082.149.199.27.351.367.153.095.332.167.54.213l.618.144c.207.049.36.113.462.193a.387.387 0 0 1 .153.326.512.512 0 0 1-.085.29.558.558 0 0 1-.255.193c-.111.047-.25.07-.413.07-.117 0-.224-.013-.32-.04a.837.837 0 0 1-.249-.115.578.578 0 0 1-.255-.384h-.764Zm-3.726-2.909h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415H1.5l1.24-2.016-1.228-1.983h.931l.832 1.438h.036l.823-1.438Zm1.923 3.325h1.697v.674H5.266v-3.999h.791v3.325Zm7.636-3.325h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415h-.861l1.24-2.016-1.228-1.983h.931l.832 1.438h.036l.823-1.438Z"/>
                            </svg>
                    )
                }
            </IconButton>
            <IconButton onClick={handleSaveAsPDF} color="red" variant="gradient" className="ml-3">
                <PrinterIcon className="w-4 h-4"/>
            </IconButton>
        </div>
        </Suspense>
    )
}