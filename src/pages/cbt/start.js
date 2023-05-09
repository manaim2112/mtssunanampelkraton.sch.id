import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { JSONParse, getDataStartCBT } from "../../service/constant";
import { Button, Card, CardBody, Checkbox, Chip, Dialog, DialogBody, DialogFooter, Input, Radio, Textarea, Tooltip, Typography } from "@material-tailwind/react";
import { CheckIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { checkingResult, finishingCBT } from "../../service/cbt/result";
import { Suspense } from "react";

export function StartCBT() {
    const {start} = useParams()
    const nav = useNavigate();

    const [user, setUser] = useState([])
    const [list, setList] = useState([])
    const [soal, setSoal] = useState([])
    const [timing, setTiming] = useState("")
    const [data, setData] = useState([])

    const [soalActive, setSoalActive] = useState("")
    const [soalTipe, setSoalTipe] = useState("")
    const [soalOption, setSoalOption] = useState([])
    const [soalAnswer, setSoalAnswer] = useState([])
    const [soalScore, setSoalScore] = useState(0)
    const [soalId, setSoalId] = useState(null)

    const [counter, setCounter] = useState(0)
    const [active, setActive] = useState(0)

    const [hour, setHour] = useState(0)
    const [minute, setMinute] = useState(0)
    const [second, setSecond] = useState(0)

    const [textSizing, setTextSizing] = useState(16)
    const [open, setOpen] = useState(false)

    useEffect(()=> {
        const get = getDataStartCBT({start})
        if(!get) return nav("/cbt")
        checkingResult({idlist : get.user.id, iduser : get.list.id}).then(r => {
            if(r.process === "finish") {
                nav("/cbt/finish/"+ start)
                return;
            }
            setUser(get.user)
            setList(get.list)
            setSoal(get.soal)
            setTiming(get.timing)
            setData(get.data)
    
            setSoalActive(get.soal[active].question)
            setSoalTipe(get.soal[active].tipe)
            setSoalOption(JSONParse(get.soal[active].option))
            setSoalAnswer(JSONParse(get.soal[active].answer))
            setSoalScore(get.soal[active].score)
            setSoalId(get.soal[active].id)

            const timeNow = Date.now()
            const timeStart = Date.parse(new Date(get.timing))
            const durasi = get.list.durasi;
            const timeFlush = timeStart + durasi*60*1000;
            let timeDifferent = timeFlush - timeNow;
            if(timeDifferent < 0) {
                return handleFinish()
            }
            
            const inter = setInterval(() => {
                getTimer(timeDifferent);
                timeDifferent--;
            }, 1000)

        })

    }, [])

    const setting = (h) => {
        setActive(h)
        setSoalActive(soal[h].question)
        setSoalTipe(soal[h].tipe)
        setSoalOption(JSONParse(soal[h].option))
        setSoalAnswer(JSONParse(soal[h].answer))
        setSoalScore(soal[h].score)
        setSoalId(soal[h].id)
    }

    const nextButton = () => {
        if(active < soal.length-1) {
            const h = active+1;
            setting(h)
            

        }
    }

    const backButton = () => {
        if(active > 0) {
            const h = active-1;
            setting(h)
        }
    }

    const menuButton = (h) => {
        setting(h)
    }

    const savingData = (jj) => {
        window.localStorage.setItem("data@"+ user.nisn + "@" + list.id, JSON.stringify(jj))
    }

    const handleFinish = () => {
        finishingCBT({idlist : list.id, iduser : user.id, answer : JSON.stringify(data)}).then(e => {
            nav("cbt/finish/"+ start)
        })
    }

    const getTimer = (time) => {
        setHour(Math.floor((time / (1000 * 60 * 60)) % 24));
        setMinute(Math.floor((time / 1000 / 60) % 60));
        setSecond(Math.floor((time / 1000) % 60));
    }

    // useEffect(() => {
        
    //     const interval = setInterval(() => {
    //         getTimer();
    //         const sh = counter;
    //         setCounter(sh - 1000);
    //     }, 1000)

    //     return () => clearInterval(interval)
    // }, [])

    return(
        <Suspense fallback={"Sedang memproses data"}>
            <div className="bg-white shadow-md p-4 text-center">
                {list.name}
            </div>

            <Card className="md:w-3/4 lg:w-3/4 w-full mx-auto mt-8">
                <CardBody>
                            <div className="">
                                <div className="grid grid-cols-5 gap-3 mb-5">
                                    <div className="col-span-5 md:col-span-3 lg:col-span-3">
                                        <Chip variant="gradient" className="mr-3" value={"Nomer Soal : "+ Number(active+1)}/> 
                                        <Chip variant="gradient" color="indigo" value={"Score : "+ soalScore}/>

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
                                <span style={{"fontSize" : textSizing +"px"}} dangerouslySetInnerHTML={{__html: soalActive }}></span>
                                <div className="mt-4">
                                    {
                                        soalTipe === "pilgan" ? (
                                            <>
                                                {
                                                    soalAnswer.length > 1 ? (
                                                        <>
                                                            {
                                                                soalOption.map((e,k) => (
                                                                    <div className="mt-2" key={k}>
                                                                        <Checkbox label={e} onClick={() => {
                                                                            let jj = [...data]
                                                                            if(!jj[active]) {
                                                                                jj[active] = [soalId, [k]]
                                                                                
                                                                                setData(jj)
                                                                                savingData(jj)
                                                                            } else {
                                                                                if(!jj[active][1].includes(k)) {
                                                                                    jj[active][1].push(k)
                                                                                    setData(jj)
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
                                                                soalOption.map((e,k) => (
                                                                    <div className="mt-2" key={k}>
                                                                        <Radio
                                                                            
                                                                            id={"option"+active + k}
                                                                            name={"soal-"+ active}
                                                                            label={e}
                                                                            icon={
                                                                                <CheckIcon className="h-6 w-6"></CheckIcon>
                                                                            }
                                                                            onClick={() => {
                                                                                let jj = [...data]
                                                                                jj[active] = [soalId, [k]]
                                                                                setData(jj)
                                                                                savingData(jj)
                                                                            }}
                                                                        />
                                                                    </div>
                                                                ))
                                                            }
                                                        </>
                                                    )
                                                }
                                            </>
                                        ) : soalTipe === "isian_singkat" ? (
                                            <>
                                                <Input variant="static" onKeyUp={(t) => {
                                                    let jj = [...data]
                                                    jj[active] = [soalId, [t.target.value]]
                                                    setData(jj)
                                                    savingData(jj);
                                                }} label="Jawaban Singkat" placeholder="Jawaban anda..." />
                                            </>
                                        ) : soalTipe === "isian_panjang" ? (
                                            <>
                                                <Textarea onKeyUp={(t) => {
                                                    let jj = [...data]
                                                    jj[active] = [soalId, [t.target.value]]
                                                    setData(jj)
                                                    savingData(jj);
                                                }} variant="static" label="Jawaban Panjang" placeholder="Jawaban anda..." />
                                            </>
                                        ) : soalTipe === "menjodohkan" ? (
                                            <>

                                            </>
                                        ) : "Soal Tidak terdeteksi, soal corrupt"
                                    }

                                </div>

                            </div>
                </CardBody>
            </Card>
            
            <div className="fixed bottom-0 z-50 w-full h-16 -translate-x-1/2 bg-white border-t border-gray-200 left-1/2 dark:bg-gray-700 dark:border-gray-600">
                <div className="grid h-full max-w-lg grid-cols-6 mx-auto">
                    <button type="button" onClick={() => setOpen(!open)} className="inline-flex col-span-2 flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
                        <svg className="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path>
                        </svg>
                        <span className="text-sm text-gray-500 hover:text-gray-900">List soal</span>
                    </button>

                    <div className="flex items-center justify-center col-span-2">
                        <div className="flex items-center justify-between w-full text-gray-600 dark:text-gray-400 bg-gray-100 rounded-lg dark:bg-gray-600 max-w-[128px] mx-2">
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
                    <button onClick={handleFinish} type="button" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
                        <XCircleIcon className="w-6 h-6 mb-1 text-red-400"></XCircleIcon>
                        
                        <span className="sr-only">Keluar</span>
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

            <Dialog handler={() => setOpen(!open)} open={open} size="xl">
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
            </Dialog>

        </Suspense>
    )
}

export function UserInformation(prop) {
    const {user} = prop;
    return(
        <>
            <Typography variant="h5">{user.name}</Typography>
            <div className="">{user.kelas}</div>
        </>
    )
}