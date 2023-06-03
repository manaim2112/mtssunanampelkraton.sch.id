import { useRef, useState } from "react"
import { useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { RemoveResultWithId} from "../../../service/dashboard/cbt"
import { SkeletonTable } from "../../../elements/skeleton/table"
import { Suspense } from "react"
import { Chip, IconButton, SpeedDial, SpeedDialAction, SpeedDialContent, SpeedDialHandler, Tooltip, Typography } from "@material-tailwind/react"
import Swal from "sweetalert2"
import jsPDF from "jspdf"
import { JSONParse } from "../../../service/constant"
import { Cog8ToothIcon, PrinterIcon, SignalIcon} from "@heroicons/react/24/outline"
import XLSX from "xlsx"
import { ExcelIcon } from "../../../icons/excelIcon"

export default function ResultCBT() {
    const {id} = useParams()
    const [creator, setCreator] = useState(false)
    const [result, setResult] = useState([])
    const [kelas, setKelas] = useState([])
    const [list, setList] = useState([])
    const [user, setUser] = useState([])
    const [soal, setSoal] = useState([])
    const [waiting, setWaiting] = useState(true)
    const [score, setScore] = useState([])
    const [scoreEnd, setScoreEnd] = useState([])
    const [v, setV] = useState(null)
    const HtmlRef = useRef(null)
    const [load, setLoad] = useState(false)
    const [loadExportToExcel, setLoadExportToExcel] = useState(false)
    const [loadExportToExcelEnd, setLoadExportToExcelEnd] = useState(false)
    const [loadExportToExcelKehadiran, setLoadExportToExcelKehadiran] = useState(false)

    useEffect(() => {
        processData();
        import("../../../service/constant").then(({getOperator}) => {
            setCreator(getOperator())
        })
    }, [id, v])

    function mapToRange(arr, min, max) {
        const minValue = Math.min(...arr);
        const maxValue = Math.max(...arr);
      
        const mappedArray = arr.map((value) => {
          if (value < minValue) {
            return min;
          } else if (value > maxValue) {
            return max;
          } else {
            const percentage = (value - minValue) / (maxValue - minValue);
            return Math.ceil(min + percentage * (max - min));
          }
        });
      
        return mappedArray;
      }
      
     
      

    const processData = () => {
        setLoad(true)
        import("../../../service/dashboard/cbt").then(({getDataWithIdCBT, getWithIdCBT}) => {
            import("../../../service/cbt/result").then(({getCBTResultWIthListId}) => {
                import("../../../service/dashboard/users").then(({getStudent}) => {
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
                                    const mappedArray = mapToRange(myscore, Number(l.mulai), Number(l.berakhir));
                                    
                                    setScore(myscore)
                                    setScoreEnd(mappedArray)
                                    setUser(ruser)
                                    setWaiting(false)
                                    setLoad(false)
                                })
                            })
                        })
                        
                    })
                })
            })
        })
    }

    const exportToExcel = () => {
        setLoadExportToExcel(true)
        const ll = list.tokelas.split(",").map(e => e.trim())
        import("../../../service/cbt/user").then(({getUserWithKelas}) => {
            getUserWithKelas(ll).then(response => {
                const workbook =  XLSX.utils.book_new()
                response.forEach((user, keyUser) => {
                    // Check Score
                    const myscore = []
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
                            "Nilai Sementara" : myscore[k],
                        })
                    })
                    const worksheet = XLSX.utils.json_to_sheet(rows);
                    XLSX.utils.book_append_sheet(workbook, worksheet, ll[keyUser])
                })
                XLSX.writeFile(workbook, list.name + "_RekapNilaiSementara_"+ Date.now() +".xlsx", { compression: true });
                setLoadExportToExcel(false)
            })
        })
        // writeXLSX
    }
    const exportToExcelEnd = () => {
        setLoadExportToExcelEnd(true)
        const ll = list.tokelas.split(",").map(e => e.trim())
        import("../../../service/cbt/user").then(({getUserWithKelas}) => {
            getUserWithKelas(ll).then(response => {
                const workbook =  XLSX.utils.book_new()
                response.forEach((user, keyUser) => {
                    // Check Score
                    const myscore = []
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
                    const endScore = mapToRange(myscore, Number(list.mulai), Number(list.berakhir));
    
                    const rows = [];
                    user.forEach((u, k) => {
                        rows.push({
                            Absen : k+1,
                            Nisn : u.nisn,
                            Nama : u.name,
                            Kelas : u.kelas,
                            Progress : status(u.id) === "start" ? "Sedang mengerjakan" : status(u.id) === "finish" ? "Tuntas" : "Belum Absen",
                            "Nilai Sementara" : myscore[k],
                            "Nilai Akhir" : endScore[k]
                        })
                    })
                    const worksheet = XLSX.utils.json_to_sheet(rows);
                    XLSX.utils.book_append_sheet(workbook, worksheet, ll[keyUser])
                })
                XLSX.writeFile(workbook, list.name + "_RekapNilaiAkhir_"+ Date.now() +".xlsx", { compression: true });
                setLoadExportToExcelEnd(false)
            })
        })
        // writeXLSX
    }
    const exportToExcelKehadiran = () => {
        setLoadExportToExcelKehadiran(true)
        const ll = list.tokelas.split(",").map(e => e.trim())
        import("../../../service/cbt/user").then(({getUserWithKelas}) => {
            getUserWithKelas(ll).then(response => {
                const workbook =  XLSX.utils.book_new()
                response.forEach((user, keyUser) => {
                    // End score
                    const rows = [];
                    console.log(user)
                    user.forEach((u, k) => {
                        const ind = result.findIndex(Obj => Obj.iduser === u.id)
                        if(ind === -1) return;
                        console.log(result[ind])
                        rows.push({
                            No : k+1,
                            Nisn : u.nisn,
                            Nama : u.name,
                            Kelas : u.kelas,
                            KEHADIRAN : status(u.id) === "start" ? "HADIR" : status(u.id) === "finish" ? "HADIR" : "HADIR",
                            Masuk : atob(result[ind].created_at ? result[ind].created_at : ""),
                            // Selesai : atob(result[ind].updated_at)
                        })
                    })
                    const worksheet = XLSX.utils.json_to_sheet(rows);
                    var wscols = [
                        {wch:3},
                        {wch:13},
                        {wch:25},
                        {wch:3},
                        {wch:10},
                        {wch:20},
                    ];
                    
                    worksheet['!cols'] = wscols;
                    XLSX.utils.book_append_sheet(workbook, worksheet, ll[keyUser])
                })
                XLSX.writeFile(workbook, list.name + "_RekapKehadiran_"+ Date.now() +".xlsx", { compression: true });
                setLoadExportToExcelKehadiran(false)
            })
        })
        // writeXLSX
    }

    const resetResult = (id) => {
        if(!creator) return;

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
                <div className="relative overflow-x-auto">
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
                                        Nilai Sementara
                                    </th>
                                    {
                                        creator ? (
                                            <th scope="col" className="px-6 py-3">
                                                Nilai Akhir
                                            </th>
                                        ) : ""
                                    }
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
                                        {
                                            creator ? (
                                                <td className="px-6 py-1">{scoreEnd[k]}</td>
                                            ) : ""
                                        }

                                        <td>
                                            {
                                                status(e.id) === "finish" ? (
                                                    <Link className="text-blue-400 hover:text-blue-600 hover:underline" to={"/dashboard/cbt/id/"+ id + "/result/"+ e.id +"/view"}>Cek Hasil</Link>
                                                ) : "Cek Hasil"
                                            }

                                            {
                                                creator ? (
                                                    <span className="ml-3 text-red-400 hover:text-red-600 hover:underline" onClick={() => resetResult(e.id)}> Reset </span>
                                                ) : ""
                                            }
                                        </td>
                                    </tr>
                                ))
                            }
                            </tbody>
                    </table>
                </div>
            )
        }

        <div className="fixed z-[500] bottom-5 right-5">
            
        <SpeedDial>
          <SpeedDialHandler>
            <IconButton size="lg" className="rounded-full">
              <Cog8ToothIcon className="h-5 w-5 transition-transform group-hover:rotate-45" />
            </IconButton>
          </SpeedDialHandler>
          <SpeedDialContent>
            <SpeedDialAction className="border-0 bg-none">
                <Tooltip
                    content="Simpan ke Pdf"
                    animate={{
                        mount: { scale: 1, y: 0 },
                        unmount: { scale: 0, y: 25 },
                    }}
                    placement="left-end"
                    >
                    <IconButton onClick={handleSaveAsPDF} color="red" variant="gradient" className="rounded-full">
                        <PrinterIcon className="w-4 h-4"/>
                    </IconButton>
                </Tooltip>
            </SpeedDialAction>
            <SpeedDialAction className="mx-auto  border-0 bg-none">
                
            <Tooltip
                    content="Cetak kehadiran"
                    animate={{
                        mount: { scale: 1, y: 0 },
                        unmount: { scale: 0, y: 25 },
                    }}
                    placement="left-end"
                    >
                    <IconButton onClick={exportToExcelKehadiran} color="yellow" variant="gradient" className="rounded-full" disabled={loadExportToExcelKehadiran}>
                        {
                            loadExportToExcelKehadiran ? (
                                <SignalIcon className="w-4 h-4 animate-spin"></SignalIcon>
                            ) : (
                                    <div className="flex gap-2">
                                        <ExcelIcon className="w-4 h-4"/>
                                    </div>
                            )
                        }
                    </IconButton>

                </Tooltip>
            </SpeedDialAction>
            {
                creator ? (
                    <SpeedDialAction className="text-center border-0 bg-none">
                        
                    <Tooltip
                            content="Cetak Nilai Akhir"
                            animate={{
                                mount: { scale: 1, y: 0 },
                                unmount: { scale: 0, y: 25 },
                            }}
                            placement="left-end"
                            >
                        <IconButton onClick={exportToExcelEnd} color="deep-purple" variant="gradient" className="rounded-full" disabled={loadExportToExcelEnd}>
                            {
                                loadExportToExcelEnd ? (
                                    <SignalIcon className="w-4 h-4 animate-spin"></SignalIcon>
                                ) : (
                                        <ExcelIcon className="w-4 h-4"/>
                                )
                            }
                        </IconButton>
                    </Tooltip>
                    </SpeedDialAction>
                ) : ""
            }
            <SpeedDialAction className="text-center border-0 bg-none">
                
            <Tooltip
                    content="Cetak Nilai Sementara"
                    animate={{
                        mount: { scale: 1, y: 0 },
                        unmount: { scale: 0, y: 25 },
                    }}
                    placement="left-end"
                    >
                <IconButton onClick={exportToExcel} color="green" variant="gradient" className="rounded-full" disabled={loadExportToExcel}>
                    {
                        loadExportToExcel ? (
                            <SignalIcon className="w-4 h-4 animate-spin"></SignalIcon>
                        ) : (
                                <ExcelIcon className="w-4 h-4"/>
                        )
                    }
                </IconButton>
            </Tooltip>
            </SpeedDialAction>
          </SpeedDialContent>
        </SpeedDial>
            <div className="mt-3">
                
            </div>
            <div className="mt-3">
            
            </div>
            <div className="mt-3">
            
            </div>
        </div>
        </Suspense>
    )
}