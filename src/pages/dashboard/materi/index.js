import { useEffect } from "react";
import { lazy } from "react";

const JumbrotonElement = lazy(() => import("../../../elements/jumbroton"))
const TableMateriElement = lazy(() => import("./table_materi"))
const HrElement = lazy(() => import("../../../elements/hr"))

export default function IndexMateriDashboard() {
    useEffect(() => {
        document.title = "Materi - Dashboard"
    }, [])


    return (
        <>
            <JumbrotonElement badge={"Tutorial"} title={"Bagaimana cara membuat materi dan isi materinya"} desc={"Petunjuk elearning akan diterangkan di youtube channel resmi kami, anda bisa melihat petunjuknya dengan sangat jelas"} to={"/dashboard"}/>


            <div className="grid grid-cols-5 gap-4">
                <div className="bg-slate-100 border border-slate-200 text-2xl h-32 rounded-md hover:bg-slate-200 hover:border-slate-300 flex place-items-center pl-7 w-full text-slate-700">
                    + Tambah Materi
                </div>
                <div className="bg-blue-100 border border-blue-200 text-2xl h-32 rounded-md hover:bg-blue-200 hover:border-blue-300 flex place-items-center pl-7 w-full text-blue-700">
                    Template Video
                </div>
                <div className="bg-lime-100 border border-lime-200 text-2xl h-32 rounded-md hover:bg-lime-200 hover:border-lime-300 flex place-items-center pl-7 w-full text-lime-700">
                    Template Learning
                </div>
                <div className="bg-red-100 border border-red-200 text-2xl h-32 rounded-md hover:bg-red-200 hover:border-red-300 flex place-items-center pl-7 w-full text-red-700">
                    Template Classroom
                </div>
                <div className="bg-gray-100 border border-gray-200 text-2xl h-32 rounded-md hover:bg-gray-200 hover:border-gray-300 flex place-items-center pl-7 w-full text-gray-700">
                    Template Costum
                </div>
            </div>

           <HrElement/>

            
            <TableMateriElement/>

        </>
    )
}