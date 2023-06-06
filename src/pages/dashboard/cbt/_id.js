import { useEffect, useState } from "react";
import {  useNavigate, useParams } from "react-router-dom";
import { Button, Chip, IconButton, Input, Switch, Typography } from "@material-tailwind/react";
import { ArrowPathIcon, CheckIcon, PencilSquareIcon, XMarkIcon } from "@heroicons/react/24/outline";
import useDocumentTitle from "../../../elements/useDocumentTitle";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { JSONParse, randomText } from "../../../service/constant";
import renderMathInElement from "katex/contrib/auto-render";
export default function IdCBTDashboard() {
    const [xid, setXid] = useState("")
    const {id} = useParams()
    useDocumentTitle("EDIT")
    const nav = useNavigate()
    const Myswal = withReactContent(Swal)
    const [codeChange, setCodeChange] = useState(false)
    const [min, setMin] = useState(0)
    const [max, setMax] = useState(0)
    useEffect(() => {
        import("../../../service/dashboard/cbt").then(({getWithIdCBT}) => {
            getWithIdCBT(id).then(d => {
                    setXid(d)
            })
        })
        
            renderMathInElement(document.body, {
                // customised options
                // • auto-render specific keys, e.g.:
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false},
                    {left: '\\(', right: '\\)', display: false},
                    {left: '\\[', right: '\\]', display: true}
                ],
                // • rendering keys, e.g.:
                throwOnError : false
            });
    }, [])

    const ChangeCode = (id) => {
        setCodeChange(true)
        import("../../../service/dashboard/cbt").then(({changeCodeCBT_list}) => {
            changeCodeCBT_list({id, code : randomText()}).then(r => {
                setXid(xid)
                setCodeChange(false)
            })
        })
    }

    const swichAcak = (e, id) => {
        import("../../../service/dashboard/cbt").then(({swithAcakCBT_list}) => {
            swithAcakCBT_list({id, acak :e.target.checked}).then(t => {
                if(t) {
                    console.log(t)
                    setXid(xid)
                    Myswal.fire({
                        "title" : "Berhasil",
                        "icon" : "success",
                        "showConfirmButton" : false,
                        "timer" : 1500,
                        "position" : "top-end",
                    })
                    
                }
            })
        })
    }

    const handleChangeStart = (id) => {
        const minimum = min.toString()
        const maximum = max.toString()
        import("../../../service/dashboard/cbt").then(({updateStartEndCBT}) => {
            updateStartEndCBT({id, mulai : minimum, berakhir : maximum}).then(e => {
                if(e) {
                    setXid(xid)
                    Myswal.fire({
                        "title" : "Berhasil",
                        "icon" : "success",
                        "showConfirmButton" : false,
                        "timer" : 1500,
                        "position" : "top-end",
                    })
                }
            })
        })
    }
    return(
        <>           
            <div className="grid grid-cols-5 gap-3">
                <div className="lg:col-span-3 xl:col-span-3 col-span-5 order-2 lg:order-1">
                    <Button color="blue" className="flex" onClick={()=> nav("/dashboard/cbt/id/"+ id + "/upload")}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-earmark-word-fill" viewBox="0 0 16 16"> 
                            <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM5.485 6.879l1.036 4.144.997-3.655a.5.5 0 0 1 .964 0l.997 3.655 1.036-4.144a.5.5 0 0 1 .97.242l-1.5 6a.5.5 0 0 1-.967.01L8 9.402l-1.018 3.73a.5.5 0 0 1-.967-.01l-1.5-6a.5.5 0 1 1 .97-.242z"/>
                        </svg> Upload via Ms. Word
                    </Button>
                    
                    <AddSoal/>
                    <div className="mt-8">
                        <DataIdCBTDashboardElement xid={id}/>
                    </div>
                </div>
                <div className="lg:col-span-2 xl:col-span-2 col-span-5 border-l-2 border-slate-300 p-4 order-1 lg:order-2">
                    <ul className="sticky top-28 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-md">
                        <li className="w-full px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                            <span className="bg-slate-200 px-2 py-1 rounded-full mx-2">Nama</span> { xid.name ? xid.name : ""}
                        </li>
                        <li className="w-full px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                        <span className="bg-slate-200 px-2 py-1 rounded-full mx-2">Jenis</span> <Chip color="blue" value={xid.jenis ? xid.jenis : ""}></Chip>

                        </li>
                        <li className="w-full px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                        <span className="bg-slate-200 px-2 py-1 rounded-full mx-2">Waktu pengerjaan</span> {xid.durasi ? xid.durasi : ""} menit

                        </li>
                        <li className="w-full px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                        <span className="bg-slate-200 px-2 py-1 rounded-full mx-2">Minimal Waktu pengerjaan</span> {xid.min_durasi ? xid.min_durasi : ""} menit

                        </li>
                        <li className="w-full px-4 py-2 border-b border-gray-200 dark:border-gray-600 flex place-items-center gap-3">
                        <div className="bg-slate-200 px-2 py-1 rounded-full mx-2 w-32">Nilai Minimum</div>
                        <div>
                            <Input type="number" defaultValue={xid.mulai} onKeyUp={e => setMin(e.target.value)} label="Angka"/>
                        </div>

                        </li>
                        <li className="w-full px-4 py-2 border-b border-gray-200 dark:border-gray-600 flex">
                        <div className="bg-slate-200 px-2 py-1 rounded-full mx-2 w-32">Nilai Maksimum</div> 
                        <div className="">
                            <Input type="number" className="w-8" defaultValue={xid.berakhir} onKeyUp={e => setMax(e.target.value)} label="Angka"/>
                        </div>
                        <div className="ml-4">
                            <IconButton onClick={e => handleChangeStart(xid.id)} color="green" variant="gradient">
                                <PencilSquareIcon className="w-4 h-4"/>
                            </IconButton>
                        </div>

                       

                        </li>
                        <li className="w-full px-4 py-2 border-b border-gray-200 dark:border-gray-600 flex">
                        <span className="bg-slate-200 px-2 py-1 rounded-full mx-2">Acak</span> <Switch onChange={e => swichAcak(e, xid.id)} checked={xid.acak}/>

                        </li>
                        <li className="w-full px-4 py-2 border-b border-gray-200 dark:border-gray-600 flex place-items-center" onClick={() => ChangeCode(xid.id)}>
                        <span className="bg-slate-200 px-2 py-1 rounded-full mx-2">Kode</span> {xid.code ? xid.code : ""}
                        <ArrowPathIcon className={`w-6 h-6 ml-3 hover:text-cyan-300 ${codeChange ? 'animate-spin' : ''}`}></ArrowPathIcon>

                        </li>
                        <li className="w-full px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                        <span className="bg-slate-200 px-2 py-1 rounded-full mx-2">Kelas yang disetujui</span> {xid.tokelas ? xid.tokelas : ""}

                        </li>
                        <li onClick={() => nav("/dashboard/cbt/id/"+ id + "/result")} className="w-full px-4 py-2 rounded-b-lg font-semibold text-blue-400 hover:text-blue-500 hover:underline cursor-pointer">Lihat hasil Peserta didik</li>
                    </ul>
                </div>
            </div>

        </>
    )
}

export function AddSoal() {

    return(
        <>
            <Typography variant="h2" className="my-4">Buat Soal Baru</Typography>
            {/* <CKEditor
                    editor={ ClassicEditor }
                    data={"<p>Hello from CKEditor 5!</p>"}
                    onReady={ editor => {
                        // You can store the "editor" and use when it is needed.
                        console.log( 'Editor is ready to use!', editor );
                    } }
                /> */}
        </>
    )
}


export function DataIdCBTDashboardElement({xid}) {
    const [list, setList] = useState([])
    const [sureDelete, setSureDelete] = useState([])
    const Myswal = withReactContent(Swal)

    useEffect(() => {
        import("../../../service/dashboard/cbt").then(({getDataWithIdCBT}) => {
            getDataWithIdCBT(xid).then(d => {
                setList(d)
            })
        })
    }, [xid])
    const removeSoal = (id, k) => {
        if(!sureDelete[k]) {
            const hh = [...sureDelete]
            hh[k] = true
            setSureDelete(hh)
        } else {
            import("../../../service/dashboard/cbt").then(({RemoveSoalWithId}) => {
                RemoveSoalWithId(id).then(e => {
                    if(e) {
                        const hh = [...sureDelete]
                        hh[k] = false;
                        setSureDelete(hh)
                        const index = list.findIndex(Obj => Obj.id === id)
                        const l = list;
                        l.splice(index, 1)
                        setList(l)
    
                        Myswal.fire({
                            "title" : "Berhasil",
                            "icon" : "success",
                            "showConfirmButton" : false,
                            "timer" : 1500,
                            "position" : "top-end",
                        })
                    }
                })
            })
        }

    }
    return(
        <>
        
            {
                list.map((e,k) => (
                    <div key={k} className="bg-slate-50 border border-slate-200 p-5 rounded-md mb-3 relative">
                        <div className="absolute inline-flex items-center justify-center top-0 right-0">
                            <div className="bg-yellow-600 px-4 py-2 text-sm text-yellow-200" title="Edit">
                                T
                            </div>
                            <div onClick={() => removeSoal(e.id, k)} onBlur={() => {
                                const jj = [...sureDelete]
                                jj[k] = undefined;
                                setSureDelete(jj)
                            }} className="bg-red-600 px-4 py-2 text-sm text-red-200" title="hapus">
                                { sureDelete[k] ? (<CheckIcon className="w-5 h-5"></CheckIcon>) : (<XMarkIcon className="w-5 h-5"></XMarkIcon>) }
                            </div>
                        </div>
                        <div className="mb-4">
                            <span className="bg-lime-200 text-lime-800 text-sm px-4 py-2 rounded-full">{e.tipe}</span>
                            <span className="bg-purple-200 text-purple-800 text-sm px-4 py-2 rounded-full ml-5"> + {e.score}</span>
                        </div>
                        <span>{k+1}. <span dangerouslySetInnerHTML={{ __html: e.question }}></span></span>
                        { e.tipe === "pilgan" ? (
                            <ol className="pl-5 mt-2 space-y-1 list-latin list-inside">
                                {
                                    JSONParse(e.options).map((t, ke) => (
                                        <li key={ke}>
                                            { JSONParse(e.answer).includes(ke) ? (
                                                <span className="bg-green-100 text-green-700" dangerouslySetInnerHTML={{ __html: t }}></span>
                                            ) : (
                                                <span dangerouslySetInnerHTML={{ __html: t }}></span>
                                            )}
                                        </li>
                                    ))
                                }
                            </ol>
                        ) : e.tipe === "menjodohkan" ? (
                            <>
                                Masih di fiktikan
                            </>
                        ) : (
                            <div className="bg-green-200 px-4 py-2 text-green-700">
                                {JSONParse(e.answer)[0]}
                            </div>
                        )
                        }
                        
                    </div>
                ))
            }
        </>
    )
}