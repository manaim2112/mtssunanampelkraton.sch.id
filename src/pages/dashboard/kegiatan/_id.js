import { useParams } from "react-router-dom"

export default function EditKegiatanDashboard() {
    const {id} = useParams()
    return(
        <>
            ini berid {id}
        </>
    )
}