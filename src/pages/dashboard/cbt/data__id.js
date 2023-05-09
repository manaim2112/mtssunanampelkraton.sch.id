import { useEffect, useState } from "react"
import { getDataWithIdCBT } from "../../../service/dashboard/cbt"
import { JSONParse } from "../../../service/constant"

export function DataIdCBTDashboardElement({xid}) {
    const [list, setList] = useState([])
    useEffect(() => {
        getDataWithIdCBT(xid).then(d => {
            console.log(d)
            setList(d)
        })
    }, [xid])
    return(
        <>
        
            {
                list.map((e,k) => (
                    <div key={k} className="bg-slate-50 border border-slate-200 p-5 rounded-md mb-3 relative">
                        <div className="absolute inline-flex items-center justify-center top-0 right-0">
                            <div className="bg-yellow-600 px-4 py-2 text-sm text-yellow-200" title="Edit">
                                T
                            </div>
                            <div className="bg-red-600 px-4 py-2 text-sm text-red-200" title="hapus">
                                X
                            </div>
                        </div>
                        <div className="mb-4">
                            <span className="bg-lime-200 text-lime-800 text-sm px-4 py-2 rounded-full">{e.tipe}</span>
                            <span className="bg-purple-200 text-purple-800 text-sm px-4 py-2 rounded-full ml-5"> + {e.score}</span>
                        </div>
                        <span>{k+1}. <span dangerouslySetInnerHTML={{ __html: e.question }}></span></span>
                        { e.tipe === "pilgan" ? (
                            <ol className="pl-5 mt-2 space-y-1 list-latin list-inside">
                                {
                                    JSONParse(e.option).map((t, ke) => (
                                        <li key={ke}>
                                            { e.kunci.includes(ke) ? (
                                                <span className="bg-green-100 text-green-700">
                                                    {t}
                                                </span>
                                            ) : t }
                                        </li>
                                    ))
                                }
                            </ol>
                        ) : e.tipe === "menjodohkan" ? (
                            <>
                                Masih di fiktikan
                            </>
                        ) : (
                            <div className="bg-green-200 px-4 py-2 text-green-700">
                                {e.answer}
                            </div>
                        )
                        }
                        
                    </div>
                ))
            }
        </>
    )
}