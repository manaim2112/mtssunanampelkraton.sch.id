import { lazy, useEffect, useRef } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useState } from "react"
import { Card, CardBody, Checkbox, Chip, IconButton, Input, Tooltip, Typography } from "@material-tailwind/react"
import { JSONParse } from "../../../service/constant"
import { BookmarkSquareIcon, CheckIcon, PrinterIcon, SignalIcon, UserGroupIcon, XMarkIcon } from "@heroicons/react/24/outline"
import Swal from "sweetalert2"
import html2pdf from "html2pdf.js"

const SkeletonTable = lazy(() => import("../../../elements/skeleton/table"))

export default function ViewResultCBT() {
    const HtmlRef = useRef(null)
    const nav = useNavigate()
    const {id, userid} = useParams()
    const [result, setResult] = useState([])
    const [resultC, setResultC] = useState([])
    const [user, setUser] = useState([])
    const [list, setList] = useState({})
    const [soal, setSoal] = useState([])
    const [waiting, setWaiting] = useState(true)
    const [score, setScore] = useState([])
    const [ans, setAns] = useState([])
    const [loading, setLoading] = useState(false)
    const [viewPilgan, setViewPilgan] = useState(false)
    const [viewIsian, setViewIsian] = useState(true)
    const [on, setOn] = useState(false)
    const [listUser, setListUser] = useState([])
    const [loadView, setLoadView] = useState(false)

    useEffect(() => {
        setLoadView(true)
        import("../../../service/dashboard/cbt").then((
            {
                getDataWithIdCBT,
                getWithIdCBT
            }) => {
                import("../../../service/cbt/result").then(({getResultWithUserIdAndListId}) => {
                    getResultWithUserIdAndListId(userid, id).then(r => {
                        r = r.sort((a,b) => a[0]-b[0])
                        const ranw = JSONParse(r[0].answer)
                        setResult(r)
                        setResultC(ranw)

                        import("../../../service/dashboard/users").then(({getUserWithId, getStudent}) => {
                            getUserWithId(userid).then(u => {
                                setUser(u)
                                getDataWithIdCBT(id).then(s => {
                                    const so = s.sort((a,b) => a.id-b.id)
                                    setSoal(so)
                                    getWithIdCBT(id).then(l => {
                                        setList(l)
                                        document.title = "Hasil " +  l.name + " dari "+ u.name;
                                        const answer = new Array(so.length).fill(null);
                                        const poin = new Array(so.length).fill(0)
                                        so.forEach((res, key) => {
                                            const a = JSONParse(res.answer)
                                            const index = ranw.findIndex(Obj => Obj[0] === res.id);
                                            if(index === -1) return;
                                            const yans = ranw[index][1].sort()
                                            if(res.tipe === "pilgan") {
                                                const act = a.sort()
                                                if(JSON.stringify(act) === JSON.stringify(yans)) {
                                                    answer[key] = true;
                                                    poin[key] = res.score;
                                                    
                                                } else {
                                                    answer[key] = false;
                
                                                }
                                            } else if(res.tipe === "isian_singkat") {
                                                if(a[0].toLowerCase() === yans[0].toLowerCase()) {
                                                    answer[key] = true;
                                                    poin[key] = res.score;
                                                } else {
                                                    answer[key] = false;
                                                }
                                            } else if(res.tipe === "isian_panjang") {
                                                answer[key] = ranw[index][2]
                                                if(ranw[index][2] === true) {
                                                    poin[key] = res.score;
                                                }
                                            }
                                        })
                
                                        setAns(answer)
                                        setScore(poin)
                
                
                                        setWaiting(false)
                                        import("../../../service/katex/auto-render").then(renderMathInElement => {
                                            renderMathInElement(HtmlRef?.current, {
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
                                        })
                                        
                                        
                
                                        getStudent(u.kelas).then(us => {
                                            setListUser(us)
                                            setLoadView(false)
                                        })
                                    })
                                })
                            })
                        })

                    })
                })

            })
    }, [userid, id])




    const checkResult = (id) => {
        const res = JSONParse(result[0].answer)
        const y = [];
        res.forEach(r => {
            if(r) {
                y.push(r)
            }
        })
        try {
            return res[res.findIndex(Ar => Ar[0] === id)][1]
        } catch (error) {
            return []
        }
    }

    const handleFail = (key) => {
        const a = [...ans]
        a[key] = false;
        const s = soal[key].id
        const ranw = resultC
        const index = ranw.findIndex(Obj => Obj[0] === s);
        if(ranw[index] && ranw[index].length === 3) {
            ranw[index][2] = false;
        } else if(ranw[index] && ranw[index].length === 2) {
            ranw[index].push(false)
        } else {
            ranw[index] = [s, [], false]
        }
        const sd = [...score]
        sd[key] = 0;
        setScore(sd)
        setResultC(ranw)
        setAns(a)

    }

    const  handleSucc = (key) => {
        const a = [...ans]
        a[key] = true;
        const s = soal[key].id
        const ranw = resultC
        const index = ranw.findIndex(Obj => Obj[0] === s);
        if(ranw[index] && ranw[index].length === 3) {
            ranw[index][2] = true;
        } else if(ranw[index] && ranw[index].length === 2) {
            ranw[index].push(true)
        } else {
            ranw.push([s, [], true])
        }
        const sd = [...score]
        sd[key] = soal[key].score;
        setScore(sd)
        console.log(ranw)
        setResultC(ranw)
        setAns(a)
    }

    const handleUpdate = () => {
        setLoading(true)
        const id = result[0].id;
        const answer = JSON.stringify(resultC)

        import("../../../service/dashboard/cbt").then(({UpdateResultAnswerWIthId}) => {
            UpdateResultAnswerWIthId({id, answer}).then(t => {
    
                setLoading(false)
               Swal.fire({
                title : "Berhasil Update",
                icon : "success",
                showConfirmButton : false,
                timer : 1000
               })
            })
        })
    }

    const handleSaveAsPDF = () => {
        const element = HtmlRef.current;
        var opt = {
            filename:    user.kelas + "_"+ list.name + '-'+ Date.now() +'.pdf',
            margin : 0.3,
            jsPDF:        { unit: 'in', format: 'legal', orientation: 'portrait' },
            pagebreak: { mode: 'avoid-all' }
          };
        html2pdf().set(opt).from(element).save();
    };



    if(waiting) return (
        <>
            <SkeletonTable/>
        </>
    )
    return(
        <>
            <Link to={"/dashboard/cbt/id/"+ id + "/result"} className="text-blue-400 hover:text-blue-600 hover:underline">
                Kembali Ke halaman sebelumnya ...
            </Link>
            <div ref={HtmlRef}>
            <Typography variant="h4"> Hasil dari {user.name} [{user.nisn}] ({user.kelas})</Typography> 
            <Typography variant="h6">{list.jenis} - {list.name} | Nilai Sementara {score.reduce((a,b) => Number(a)+Number(b))}</Typography>

            <Checkbox name="pilgan" id="isian" onChange={() => setViewPilgan(!viewPilgan)} label="Pilihan ganda/Isian Singkat" defaultChecked={viewPilgan}/>

            <Checkbox name="isian" id="isian" onChange={() => setViewIsian(!viewIsian)} label="Isian Panjang" defaultChecked={viewIsian}/>
            {
                soal.map((e,k) => (
                    <div key={k} className="text-sm">
                        
                                {
                                    e.tipe === "pilgan" && viewPilgan ? (
                                        <>
                                        <Card className={`relative my-1 border border-gray-800 text-black ${(ans[k] === true) ? "bg-green-50" : (ans[k] === null) ? "bg-white" : "bg-red-50"}`}>
                                            <div className="absolute top-[-10px]">
                                                <div className="bg-yellow-400 text-black px-3">
                                                    {k+1} 
                                                    {
                                                    (ans[k] === true) ? "score +"+e.score : ""
                                                    }
                                                </div>
                                            </div>
                                            <CardBody className="p-3">
                                                
                                                <div className="text-black" dangerouslySetInnerHTML={{ __html: e.question }}></div>
                                            {
                                                JSONParse(e.options).map((opt, keyopt) => (
                                                    <>
                                                        {
                                                            JSON.stringify(JSON.parse(e.answer).sort()) === JSON.stringify(checkResult(e.id)) ? (
                                                                <Checkbox name={"checkbox-"+ e.id} id={"checkbox-id-"+ e.id + "-" + keyopt} label={opt} disabled checked={
                                                                    checkResult(e.id).includes(keyopt)
                                                                } color="green"></Checkbox>
                                                            ) : (
                                                                <Checkbox name={"checkbox-"+ e.id} id={"checkbox-id-"+ e.id + "-" + keyopt} label={opt} disabled checked={
                                                                    JSON.parse(e.answer).includes(keyopt) || checkResult(e.id).includes(keyopt)
                                                                } color={JSON.parse(e.answer).includes(keyopt) ? "green" : "red"}></Checkbox>

                                                            )
                                                        }
                                                    </>

                                                ))
                                            }
                                            </CardBody>
                                            </Card>
                                        </>
                                    ) : e.tipe === "isian_singkat" && viewPilgan ? (
                                        <div>
                                            <Card className={`my-1 text-black border border-gray-800 ${(ans[k] === true) ? "bg-green-100" : (ans[k] === null) ? "bg-white" : "bg-red-100"}`}>
                                            <CardBody>
                                                <Chip color="blue" value={"Nomer "+ (k+1) } className="mx-1"/>
                                                {
                                                    (ans[k] === true) ? "score +"+e.score : ""
                                                }
                                                <div className="mt-4" dangerouslySetInnerHTML={{ __html: e.question }}></div>
                                            <Input value={checkResult(e.id)} icon={<XMarkIcon className="w-4 h-4"/>} className={
                                                checkResult(e.id)[0] === JSONParse(e.answer)[0] ? "disabled:bg-green-700 text-white" : "disabled:bg-red-700 text-white"
                                            } disabled/>
                                            <Input value={JSONParse(e.answer)[0]} color="green" className={"disabled:bg-green-700 disabled:text-white mt-2"} disabled/>
                                            </CardBody>
                                            </Card>
                                        </div>
                                    ) : e.tipe === "isian_panjang" && viewIsian ? (
                                        <>
                                        <Card className={`my-1 relative text-black border border-gray-800 ${(ans[k] === true) ? "bg-green-50" : (ans[k] === false) ? "bg-red-50" : "bg-white"}`}>
                                            <div className="absolute top-[-10px]">
                                                <div className="bg-yellow-400 text-black px-3">
                                                    {k+1} 
                                                    {
                                                    (ans[k] === true) ? "score +"+e.score : ""
                                                    }
                                                </div>
                                            </div>
                                            <CardBody className="p-3">
                                                <div className="mt-0" dangerouslySetInnerHTML={{ __html: e.question }}></div>
                                            <div className="flex gap-0 mt-2">
                                                <div className="w-64">
                                                    <IconButton onClick={() => handleSucc(k)} color="green" variant={ans[k] === true ? "gradient" : (ans[k] === false) ? "outlined" : "outlined"} className="m-0" size="sm">
                                                        <CheckIcon className="w-4 h-4"/>
                                                    </IconButton>
                                                    <IconButton onClick={() => handleFail(k)} color="red" variant={ans[k] === false ? "gradient" : (ans[k] === true) ? "outlined" : "outlined"} className="mx-1" size="sm">
                                                        <XMarkIcon className="w-4 h-4"/>
                                                    </IconButton>
                                                </div>
                                                <div className="bg-white border border-deep-orange-300 rounded-lg p-1"> {"Jawaban : "+ checkResult(e.id)} </div>
                                            </div>
                                            <div>
                                            {"Kunci Jawaban : "+ JSONParse(e.answer)[0]}
                                            </div>
                                            </CardBody>
                                            </Card>
                                        </>
                                    ) : (
                                        ""
                                    )
                                }

                    </div>
                ))
            }
            </div>

            <div className="fixed bottom-5 right-5">
                <div  className="mb-2">
                <Tooltip
                    content="Update Jawaban"
                    animate={{
                        mount: { scale: 1, y: 0 },
                        unmount: { scale: 0, y: 25 },
                    }}
                    placement="left-end"
                    >
                   <IconButton color="blue" variant="gradient" disabled={loading} onClick={handleUpdate}>
                        {
                                loading ? (
                                    <SignalIcon className="w-4 h-4 animate-spin"></SignalIcon>
                                ) : (
                                    <BookmarkSquareIcon className="h-4 w-4"/>
                                )
                            }
                    </IconButton>
                </Tooltip>
                </div>
                <div  className="mb-4">
                <Tooltip
                    content="Print Hasil Ujian"
                    animate={{
                        mount: { scale: 1, y: 0 },
                        unmount: { scale: 0, y: 25 },
                    }}
                    placement="left-end"
                    >
                   <IconButton color="red" variant="gradient" onClick={handleSaveAsPDF}>
                        <PrinterIcon className="h-4 w-4"/>
                    </IconButton>
                </Tooltip>
                </div>
                <div  className="mb-4">
                <Tooltip
                    content="List Nama"
                    animate={{
                        mount: { scale: 1, y: 0 },
                        unmount: { scale: 0, y: 25 },
                    }}
                    placement="left-end"
                    >
                   <IconButton color="green" variant="gradient" onClick={() => setOn(true)}>
                        <UserGroupIcon className="h-4 w-4"/>
                    </IconButton>
                </Tooltip>
                </div>
            </div>

            <div onClick={() => setOn(false)} className={`fixed top-0 z-[500] w-full h-screen bg-red-300/10 ${on ? "" : "hidden"}`} >
            </div>
            <div className={`fixed z-[502] top-0 h-screen overflow-y-auto overflow-x-auto bg-white rounded-l-lg shadow-lg p-4 transition-all ${on ? "w-64 right-0" : "w-0 -right-10"}`}> 
                <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
                    <ul className="flex flex-nowrap -mb-px overflow-y-auto">
                        {
                            list.tokelas.split(",").map(e => e.trim()).map((l, keyL) => (
                                <li className="mr-2" key={keyL}>
                                    <span onClick={() => {
                                        import("../../../service/dashboard/users").then(({getStudent}) => {
                                            getStudent(l).then(e => {
                                                nav("/dashboard/cbt/id/"+ id + "/result/"+ e[0].id + "/view/")
                                            })
                                        })
                                    }} className={`inline-block p-4 cursor-pointer border-b-2 border-transparent rounded-t-lg hover:text-blue-600 hover:border-blue-300 ${ l === user.kelas ? "border-b-blue-500 text-blue-500" : ""} dark:hover:text-blue-300`}>{l}</span>
                                </li>
                            ))
                        }
                    </ul>
                </div>

                {
                    loadView ? (<SkeletonTable/>) : (
                        <div className="mt-4">
                            <Typography variant="h5">List Kelas {user.kelas}</Typography>
                            {
                                listUser.map((value, key) => (
                                    <div key={key} className={`hover:underline hover:text-blue-400 cursor-pointer ${user.id === value.id ? "text-blue-400" : ""}`} onClick={() => nav("/dashboard/cbt/id/"+ id + "/result/"+ value.id + "/view/")}>
                                       {key+1}.  {value.name}
                                    </div>
                                ))
                            }
                        </div>
                    )
                }
            </div>
        </>
    )
}

export function ToggleUserResult({data}) {
    return(
        <div>
        

        </div>
    )
}
