import { lazy } from "react";

const JumbrotonElement = lazy(() => import("../../../elements/jumbroton"))

export default function IdMateriDashboard() {
    return(
        <>
            <JumbrotonElement badge={"Tutorial"} title={"Bagaimana cara membuat materi dan isi materinya"} desc={"Petunjuk elearning akan diterangkan di youtube channel resmi kami, anda bisa melihat petunjuknya dengan sangat jelas"} to={"/dashboard"}/>
        </>
    )
}