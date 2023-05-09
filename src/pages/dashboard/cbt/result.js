import { useState } from "react"
import { useEffect } from "react"
import { getCBTResultWIthListId } from "../../../service/cbt/result"
import { useParams } from "react-router-dom"
import { getKelasAll } from "../../../service/dashboard/kelas"
import { getStudent } from "../../../service/dashboard/users"

export function ResultCBT() {
    const {id} = useParams()
    const [result, setResult] = useState([])
    const [kelas, setKelas] = useState([])
    const [user, setUser] = useState([])
    useEffect(() => {
        getResult()
    }, [kelas])

    const getResult = () => {
        getCBTResultWIthListId(id).then(e => {
            setResult(e)
            getKelasAll().then(rkelas => {
                setKelas(rkelas)
                getStudent(rkelas[0].name).then(ruser => {
                    setUser(ruser)
                })
            })
            
        })

    }
    return(
        <>
            INI
        </>
    )
}