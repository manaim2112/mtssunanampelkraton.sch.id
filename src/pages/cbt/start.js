import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { JSONParse } from "../../service/constant";
import { Button, Card, CardBody, Checkbox, Chip,Input, Radio, Textarea, Tooltip, Typography } from "@material-tailwind/react";
import { CheckIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { checkingResult, finishingCBT } from "../../service/cbt/result";
import { Suspense } from "react";
import { SkeletonTable } from "../../elements/skeleton/table";
import useDocumentTitle from "../../elements/useDocumentTitle";
import Swal from "sweetalert2";
import renderMathInElement from "https://cdn.jsdelivr.net/npm/katex@0.16.7/dist/contrib/auto-render.mjs";

import "./start.css"
 
export function StartCBT() {
    const {start} = useParams()
    const nav = useNavigate();
    useDocumentTitle("Selamat Mengerjakan soal")
    
    const [waitingLoad, setWaitingLoad] = useState(null)
    
    const [user, setUser] = useState([])
    const [list, setList] = useState([])
    const [soal, setSoal] = useState([])
    const [timing, setTiming] = useState("")
    const [data, setData] = useState([])
    

    
    const [active, setActive] = useState(0)

    
    const [textSizing, setTextSizing] = useState(16)
    const [open, setOpen] = useState(false)
    const [remainingTime, setRemainingTime] = useState(60); // waktu dalam detik
    const [intervalId, setIntervalId] = useState(null);
    const [showExit, setShowExit] = useState(false);
    useEffect(()=> {
        try {
            const at = atob(start)
            const [nisn, idlist] = at.split("@")
            const local = window.sessionStorage.getItem("refresh-token")
            const decode = JSONParse(atob(local))
            const iduser = decode.id
            setUser(decode)

            checkingResult({idlist, iduser}).then(r => {
                if(r.process === "finish") {
                    nav("/cbt/finish/"+ start)
                    return;
                }
                if(r.length < 1) {
                    return nav("/cbt")
                }
                const result = r[0]
                
                const l = window.localStorage.getItem("list@"+ nisn +"@"+ idlist)
                const decode_l  = JSONParse(l)
                setList(decode_l)
                
                const s = window.localStorage.getItem("refresh@"+ nisn + "@" + idlist)
                const decode_s = JSONParse(s)
                setSoal(decode_s)
                
                const d = window.localStorage.getItem("data@"+ nisn + "@"+ idlist)
                const decode_d = JSONParse(d)
                setData(decode_d)
                
                
                const timeNow = Date.now()
                const timeStart = Date.parse(new Date(atob(result.created_at)))
                const durasi = Number(decode_l.durasi);

                const timeFlush = timeStart + durasi*60*1000;
                let timeDifferent = Math.floor((timeFlush - timeNow)/1000);
                setTiming(timeDifferent)
                setRemainingTime(timeDifferent)
    
                setWaitingLoad(true)
            })

        } catch (error) {
            
        }

    }, [])

    useEffect(() => {
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
    }, [active])

    const checkingButtonFinish = () => {
        const diff = Number(list.durasi)*60 - remainingTime
        if(diff >= Number(list.min_durasi)*60) {
            setShowExit(true);
        } else {
            setShowExit(false)
        }
    }

    useEffect(() => {
        if (remainingTime <= 0) {
            finishing()
        clearInterval(intervalId);
        return;
        }

        const id = setInterval(() => {
            checkingButtonFinish()
            setRemainingTime(prevTime => prevTime - 1);
        }, 1000);   

        setIntervalId(id);
        return () => clearInterval(id);
    }, [remainingTime]);

    const nextButton = () => {
        if(active < soal.length-1) {
            const N = active+1;
            setActive(N)
        }
    }

    const backButton = () => {
        if(active > 0) {
            const N = active-1;
            setActive(N)
        }
    }

    const menuButton = (h) => {
        setActive(h)
        setOpen(false)
    }

    const savingData = (jj) => {
        setData(jj)
        window.localStorage.setItem("data@"+ user.nisn + "@" + list.id, JSON.stringify(jj))
    }

    const handleFinish = () => {
        const msg = [];
        data.forEach((e,k) => {
            if(e[1].length < 1) {
                msg.push(k)
            }
        })
        if(msg.length > 0) {
            setActive(msg[0]);
             return Swal.fire({
                "title" : "Peringatan",
                "icon" : "warning",
                "text" : "ada beberapa soal belum di isi, segera lengkapi untuk dapat menyelesaikan soal"
            })
        }

        finishingCBT({idlist : list.id, iduser : user.id, answer : JSON.stringify(data)}).then(e => {
            nav("/cbt/finish/"+ start)
        })
    }

    if(!waitingLoad) {
        return(
            <SkeletonStart/>
        )
    }

    
    const finishing = () => {

        finishingCBT({idlist : list.id, iduser : user.id, answer : JSON.stringify(data)}).then(e => {
            nav("/cbt/finish/"+ start)
        })
    }
   
    

    const hours = Math.floor(remainingTime / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const seconds = remainingTime % 60;


    return(
        <Suspense fallback={"Sedang memproses data"}>
            <div className="bg-white shadow-md p-4 flex flex-row place-items-center text-center">
                <div className="basis-1/2">
                    {list.name}
                </div>
                <div className="basis-1/2">
                    { (active === soal.length-1) && showExit ? (
                                        <>
                                        <Button
                                                size="sm"
                                                variant="gradient"
                                                color="red"
                                                className="group relative flex items-center gap-3 overflow-hidden pr-[72px]"
                                                onClick={handleFinish}
                                            >
                                                SELESAI
                                                <span className="absolute right-0 grid h-full w-12 place-items-center bg-red-600 transition-colors group-hover:bg-red-700">
                                                <XCircleIcon className="w-6 h-6 mb-1 text-red-50"></XCircleIcon> 

                                                </span>
                                            </Button>
                                        </>
                                    ) : ""}
                </div>
            </div>
            <div className="md:px-0 lg:px-0 px-2">
            <Card className="md:w-3/4 lg:w-3/4 w-full mx-auto mt-8 mb-12">
                <CardBody>
                    {
                        open ? (
                            <>
                                <Typography variant="h3">Pilih soal nomer berapa ?</Typography>
                                <div className="grid grid-cols-8 gap-3">
                                    {
                                        data.map((r,k) => (
                                            <Button size="sm" key={k} color={r[1].length >= 0 ? "green" : k===active ? "yellow" : "gray"} variant={r[1].length > 0 ? "gradient" : k===active ? "filled" : "outlined"} ripple={true} onClick={() => menuButton(k)}>{k+1}</Button>
                                        ))
                                    }
                                </div>
                            </>
                        ) : (
                            <div className="">
                                <div className="grid grid-cols-5 gap-3 mb-5">
                                    <div className="col-span-5 md:col-span-3 lg:col-span-3">
                                        <Chip variant="gradient" className="mr-3" value={"Nomer Soal : "+ Number(active+1)}/> 
                                        <Chip variant="gradient" color="indigo" value={"Score : "+ soal[active].score}/>

                                    </div>
                                    <div className="col-span-5 md:col-span-2 lg:col-span-2">
                                        <Radio id={"font1"} name={"fontku"} label={"Text kecil"}
                                                                                icon={
                                                                                    <CheckIcon className="h-6 w-6"></CheckIcon>
                                                                                }
                                                                                onClick={() => {
                                                                                    setTextSizing(14)
                                                                                }}
                                                                            />
                                        <Radio id={"font2"} name={"fontku"} label={"Text Sedang"}
                                                                                icon={
                                                                                    <CheckIcon className="h-6 w-6"></CheckIcon>
                                                                                }
                                                                                onClick={() => {
                                                                                    setTextSizing(16)
                                                                                }}
                                                                            />
                                        <Radio id={"font3"} name={"fontku"} label={"Text Besar"}
                                                                                icon={
                                                                                    <CheckIcon className="h-6 w-6"></CheckIcon>
                                                                                }
                                                                                onClick={() => {
                                                                                    setTextSizing(20)
                                                                                }}
                                                                            />
                                    </div>
                                </div>
                                <span style={{"fontSize" : textSizing +"px"}} dangerouslySetInnerHTML={{__html: soal[active].question }}></span>
                                <div className="mt-4">
                                    {
                                        soal[active].tipe === "pilgan" ? (
                                            <>
                                                {
                                                    JSONParse(soal[active].answer).length > 1 ? (
                                                        <>
                                                            {
                                                                JSONParse(soal[active].options).map((e,k) => (
                                                                    <div className="mt-2" key={k}>
                                                                        <Checkbox label={e} onClick={() => {
                                                                            let jj = [...data]
                                                                            if(!jj[active]) {
                                                                                jj[active] = [soal[active].id, [k]]
                                                                                savingData(jj)
                                                                            } else {
                                                                                if(!jj[active][1].includes(k)) {
                                                                                    jj[active][1].push(k)
                                                                                    savingData(jj)
                                                                                }
                                                                            }


                                                                        }} />
                                                                    </div>
                                                                ))
                                                            }
                                                        </>
                                                    ) : (
                                                        <>
                                                            {
                                                                JSONParse(soal[active].options).map((e,k) => (
                                                                    
                                                                    <div className="flex items-center mb-4" key={k}>
                                                                        <input 
                                                                            id={"options_key_"+ soal[active].id + "_key_"+ k} 
                                                                            type="radio" 
                                                                            value={data[active][1]}
                                                                            name={"options_key_"+soal[active].id} 
                                                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" 
                                                                            onChange={(event) => {
                                                                                let jj = [...data];
                                                                                if(event.target.checked) {
                                                                                    jj[active] = [soal[active].id, [k]];
                                                                                }
                                                                                savingData(jj);
                                                                            }}
                                                                            checked={data[active] && data[active][0] === soal[active].id && data[active][1].includes(k)}
                                                                            /> 

                                                                        <label htmlFor={"options_key_"+ soal[active].id + "_key_"+ k} className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300" dangerouslySetInnerHTML={{__html : e}}></label>
                                                                    </div>
                                                                ))
                                                            }
                                                        </>
                                                    )
                                                }
                                            </>
                                        ) : soal[active].tipe === "isian_singkat" ? (
                                            <>
                                                <Input variant="static" onChange={(t) => {
                                                    let jj = [...data]
                                                    jj[active] = [soal[active].id, [t.target.value]]
                                                    savingData(jj);
                                                }} value={data[active][1]} label="Jawaban Singkat" placeholder="Jawaban anda..." />
                                            </>
                                        ) : soal[active].tipe === "isian_panjang" ? (
                                            <>
                                                <Textarea onChange={(t) => {
                                                    let jj = [...data]
                                                    jj[active] = [soal[active].id, [t.target.value]]
                                                    savingData(jj);
                                                }} value={data[active][1]} variant="static" label="Jawaban Panjang" placeholder="Jawaban anda..." />
                                            </>
                                        ) : soal[active].tipe === "menjodohkan" ? (
                                            <>

                                            </>
                                        ) : "Soal Tidak terdeteksi, soal corrupt"
                                    }

                                </div>
                                
                            </div>
                        )
                    }
                </CardBody>
            </Card>

            </div>
            
            <div className="fixed bottom-0 z-50 w-full h-16 -translate-x-1/2 bg-white border-t border-gray-200 left-1/2 dark:bg-gray-700 dark:border-gray-600">
                <div className="grid h-full max-w-xl grid-cols-6 mx-auto items-center">
                    <div className="col-span-2 text-center">
                        <Typography color="red" variant="h4">{hours < 10 ? "0" : ""}{hours}:{minutes < 10 ? '0' : ''}{minutes}:{seconds < 10 ? '0' : ''}{seconds}</Typography>
                    </div>
                    

                    <div className="flex items-center justify-center col-span-2">
                        <div className="flex items-center justify-between w-full hover:scale-125 transition-all ease-in-out text-gray-600 dark:text-gray-400 bg-gray-100 rounded-lg dark:bg-gray-600 max-w-[128px] mx-2">
                            <button type="button" onClick={backButton} className="inline-flex items-center justify-center h-8 px-1 bg-gray-100 rounded-l-lg dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-800">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path clipRule="evenodd" fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"></path>
                                </svg>
                                <span className="sr-only">Previous page</span>
                            </button>
                            <span className="flex-shrink-0 mx-1 text-sm font-medium">{active+1} of {soal.length}</span>
                            <button type="button" onClick={nextButton} className="inline-flex items-center justify-center h-8 px-1 bg-gray-100 rounded-r-lg dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-800">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path clipRule="evenodd" fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"></path>
                                </svg>
                                <span className="sr-only">Next page</span>
                            </button>
                        </div>
                    </div>
                    <button type="button" onClick={() => setOpen(!open)} className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
                        <svg className="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path>
                        </svg>
                        <span className="sr-only">List soal</span>
                    </button>

                    <Tooltip content={<UserInformation user={user}/>} animate={{
                        mount: { scale: 1, y: 0 },
                        unmount: { scale: 0, y: 25 },
                    }}
                    >
                    <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
                                        <svg className="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path clipRule="evenodd" fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"></path>
                                        </svg>
                                        <span className="sr-only">Profile</span>
                                    </button>
                    </Tooltip>

                </div>
            </div>

            {/* <Dialog handler={() => setOpen(!open)} open={open} size="xl">
                <DialogBody>
                    <div className="grid lg:grid-cols-12 md:grid-cols-8 sm:grid-cols-6 grid-cols-4 gap-3">
                        {
                            data.map((r,k) => (
                                <Button key={k} color={r !== null ? "blue" : "gray"} ripple={true} onClick={() => menuButton(k)}>{k+1}</Button>
                            ))
                        }
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={() => setOpen(!open)}
                        className="mr-1"
                    >
                        <span>Tutup</span>
                    </Button>
                    </DialogFooter>
            </Dialog> */}

        </Suspense>
    )
}

export function UserInformation(prop) {
    const {user} = prop;
    return(
        <>
            <Typography variant="h5">{user.name}</Typography>
            <div className="strong">{user.nisn}</div>
            <div className="">{user.kelas}</div>

        </>
    )
}


export function SkeletonStart() {
    return(
        <div className="animate-pulse">
            <div className="bg-white shadow-md p-4 text-center h-11">


            </div>
            <Card className="md:w-3/4 lg:w-3/4 w-full mx-auto mt-8">
                <CardBody>
                    <SkeletonTable/>
                </CardBody>
            </Card>

            <div className="fixed bottom-0 z-50 w-full h-16 -translate-x-1/2 bg-white border-t border-gray-200 left-1/2 dark:bg-gray-700 dark:border-gray-600">
                <div className="grid h-full max-w-lg grid-cols-6 mx-auto">
                    <button type="button" className="inline-flex col-span-2 flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
                        <svg className="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path>
                        </svg>
                        <span className="text-sm text-gray-500 hover:text-gray-900">List soal</span>
                    </button>

                    <div className="flex items-center justify-center col-span-2">
                        <div className="flex items-center justify-between w-full text-gray-600 dark:text-gray-400 bg-gray-100 rounded-lg dark:bg-gray-600 max-w-[128px] mx-2">
                            <button type="button" className="inline-flex items-center justify-center h-8 px-1 bg-gray-100 rounded-l-lg dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-800">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path clipRule="evenodd" fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"></path>
                                </svg>
                                <span className="sr-only">Previous page</span>
                            </button>
                            <span className="flex-shrink-0 mx-1 text-sm font-medium">Tunggu ...</span>
                            <button type="button" className="inline-flex items-center justify-center h-8 px-1 bg-gray-100 rounded-r-lg dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-800">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path clipRule="evenodd" fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"></path>
                                </svg>
                                <span className="sr-only">Next page</span>
                            </button>
                        </div>
                    </div>
                    <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
                        <XCircleIcon className="w-6 h-6 mb-1 text-red-400"></XCircleIcon>
                        
                        <span className="sr-only">Keluar</span>
                    </button>

                    
                    <button type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
                                        <svg className="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path clipRule="evenodd" fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"></path>
                                        </svg>
                                        <span className="sr-only">Profile</span>
                                    </button>

                </div>
            </div>
        </div>
    )
}
