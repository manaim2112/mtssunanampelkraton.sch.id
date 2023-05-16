import { useParams } from "react-router-dom"

export function EditKegiatanDashboard() {
    const {id} = useParams()
    return(
        <>
            ini berid {id}
        </>
    )
}