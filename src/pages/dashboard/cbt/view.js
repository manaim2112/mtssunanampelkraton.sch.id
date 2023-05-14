import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { getResultWithUserId } from "../../../service/cbt/result"
import { useState } from "react"
import { getUserWithId } from "../../../service/dashboard/users"
import { UpdateResultAnswerWIthId, getDataWithIdCBT, getWithIdCBT } from "../../../service/dashboard/cbt"
import { SkeletonTable } from "../../../elements/skeleton/table"
import { Button, Card, CardBody, Checkbox, Chip, IconButton, Input, Textarea, Typography } from "@material-tailwind/react"
import { JSONParse } from "../../../service/constant"
import { CheckIcon, SignalIcon, XMarkIcon } from "@heroicons/react/24/outline"
import Swal from "sweetalert2"

export function ViewResultCBT() {
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
    useEffect(() => {
        getResultWithUserId(userid).then(r => {
            setResult(r)
            getUserWithId(userid).then(u => {
                setUser(u)
                getDataWithIdCBT(id).then(s => {
                    const so = s.sort((a,b) => a.id-b.id)
                    setSoal(so)
                    getWithIdCBT(id).then(l => {
                        setList(l)
                        const answer = new Array(so.length).fill(null);
                        const poin = new Array(so.length).fill(0)
                        so.forEach((res, key) => {
                            const a = JSONParse(res.answer)
                            const ranw = JSONParse(r[0].answer)
                            const index = ranw.findIndex(Obj => Obj[0] === res.id);
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
                    })
                })
            })
        })
    }, [])

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
        const ranw = JSONParse(result[0].answer)
        const index = ranw.findIndex(Obj => Obj[0] === s);
        ranw[index][2] = false;
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
        const ranw = JSONParse(result[0].answer)
        const index = ranw.findIndex(Obj => Obj[0] === s);
        ranw[index][2] = true;
        const sd = [...score]
        sd[key] = soal[key].score;
        setScore(sd)
        setResultC(ranw)
        setAns(a)
    }

    const handleUpdate = () => {
        setLoading(true)
        const id = result[0].id;
        const answer = JSON.stringify(resultC)

        UpdateResultAnswerWIthId({id, answer}).then(t => {
            setLoading(false)
           Swal.fire({
            title : "Berhasil Update",
            icon : "success",
            showConfirmButton : false,
            timer : 1000
           })
        })
    }

    if(waiting) return (
        <>
            <SkeletonTable/>
        </>
    )
    return(
        <>
            <Typography variant="h3"> Hasil dari {user.name}</Typography> {user.nisn}
            <Typography variant="h4">{list.jenis} - {list.name}</Typography>
            <Typography variant="h5">Nilai Sementara {score.reduce((a,b) => Number(a)+Number(b))}</Typography>

            <Checkbox name="pilgan" id="isian" onChange={() => setViewPilgan(!viewPilgan)} label="Pilihan ganda/Isian Singkat" defaultChecked={viewPilgan}/>

            <Checkbox name="isian" id="isian" onChange={() => setViewIsian(!viewIsian)} label="Isian Panjang" defaultChecked={viewIsian}/>
            {
                soal.map((e,k) => (
                    <>
                        
                                {
                                    e.tipe === "pilgan" && viewPilgan ? (
                                        <>
                                        <Card key={k} className={`my-2 ${(ans[k] === true) ? "bg-green-100" : (ans[k] === null) ? "bg-white" : "bg-red-100"}`}>
                                            <CardBody>
                                                <Chip color="blue" value={"Nomer "+ (k+1) } className="mx-1"/>
                                                {
                                                    (ans[k] === true) ? "score +"+e.score : ""
                                                }
                                                <div className="mt-4" dangerouslySetInnerHTML={{ __html: e.question }}></div>
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
                                            <Card key={k} className={`my-2 ${(ans[k] === true) ? "bg-green-100" : (ans[k] === null) ? "bg-white" : "bg-red-100"}`}>
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
                                        <Card key={k} className={`my-2 ${(ans[k] === true) ? "bg-green-100" : (ans[k] === null) ? "bg-white" : "bg-red-100"}`}>
                                            <CardBody>
                                                <Chip color="blue" value={"Nomer "+ (k+1) } className="mx-1"/>
                                                {
                                                    (ans[k] === true) ? "score +"+e.score : ""
                                                }
                                                <div className="mt-4" dangerouslySetInnerHTML={{ __html: e.question }}></div>
                                            <div className="flex gap-0">
                                                <div>
                                                    
                                                    <IconButton onClick={() => handleSucc(k)} color="green" className="m-1">
                                                        <CheckIcon className="w-5 h-5"></CheckIcon>
                                                    </IconButton>
                                                    <IconButton onClick={() => handleFail(k)} color="red" className="m-1">
                                                        <XMarkIcon className="w-5 h-5"></XMarkIcon>
                                                    </IconButton>
                                                </div>
                                                <Textarea value={checkResult(e.id)} className="mb-2" disabled/>
                                            </div>
                                            <Textarea value={JSONParse(e.answer)[0]} className="disabled:bg-green-700 disabled:text-white mt-2" disabled/>
                                            </CardBody>
                                            </Card>
                                        </>
                                    ) : (
                                        ""
                                    )
                                }

                    </>
                ))
            }
            <Button size="lg" onClick={handleUpdate} color="orange" className="rounded-full">
                {
                    loading ? (
                        <SignalIcon className="w-4 h-4 animate-spin"></SignalIcon>
                    ) : (
                        <span>Update</span>
                    )
                }
            </Button>
            

        </>
    )
}