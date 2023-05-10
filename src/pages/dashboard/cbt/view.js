import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { getResultWithUserId } from "../../../service/cbt/result"
import { useState } from "react"
import { getUserWithId } from "../../../service/dashboard/users"
import { getDataWithIdCBT, getWithIdCBT } from "../../../service/dashboard/cbt"
import { SkeletonTable } from "../../../elements/skeleton/table"
import { Card, CardBody, Checkbox, Chip, Input, Textarea, Typography } from "@material-tailwind/react"
import { JSONParse } from "../../../service/constant"
import { XMarkIcon } from "@heroicons/react/24/outline"

export function ViewResultCBT() {
    const {id, userid} = useParams()
    const [result, setResult] = useState([])
    const [user, setUser] = useState([])
    const [list, setList] = useState({})
    const [soal, setSoal] = useState([])
    const [waiting, setWaiting] = useState(true)
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

    if(waiting) return (
        <>
            <SkeletonTable/>
        </>
    )
    return(
        <>
            <Typography variant="h3"> Hasil dari {user.name}</Typography> {user.nisn}
            <Typography variant="h4">{list.jenis} - {list.name}</Typography>

            {
                soal.map((e,k) => (
                    <Card key={k} className="my-1">
                        <CardBody>
                            <Chip color="blue" value={"Nomer "+ (k+1) } className="mx-1"/>
                            {e.id} {typeof checkResult(e.id)[0]}
                            <div className="mt-4" dangerouslySetInnerHTML={{ __html: e.question }}></div>
                            {
                                e.tipe === "pilgan" ? (
                                    <>
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
                                    </>
                                ) : e.tipe === "isian_singkat" ? (
                                    <div>
                                        <Input value={checkResult(e.id)} icon={<XMarkIcon className="w-4 h-4"/>} className={
                                            checkResult(e.id)[0] === JSONParse(e.answer)[0] ? "disabled:bg-green-100" : "disabled:bg-red-100"
                                        } disabled/>
                                        <Input value={JSONParse(e.answer)[0]} color="green" className={"disabled:bg-green-100 mt-2"} disabled/>

                                    </div>
                                ) : e.tipe === "isian_panjang" ? (
                                    <Textarea value={checkResult(e.id)} disabled/>
                                ) : (
                                    ""
                                )
                            }

                        </CardBody>
                    </Card>
                ))
            }

        </>
    )
}