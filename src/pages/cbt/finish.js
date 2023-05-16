import { Button, Card, CardBody, Checkbox, Chip, Input, Textarea } from "@material-tailwind/react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { JSONParse } from "../../service/constant";
import { SkeletonTable } from "../../elements/skeleton/table";
import { Suspense } from "react";
import { SparklesIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export function FinishCBT() {
    const {start} = useParams()
    const nav = useNavigate();
    const [user, setUser] = useState({})
    const [list, setList] = useState({})
    const [soal, setSoal] = useState([])
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        try {
            const at = atob(start)
            const [nisn, idlist] = at.split("@")
            const local = window.sessionStorage.getItem("refresh-token")
            const decode = JSONParse(atob(local))
            setUser(decode)
            const l = window.localStorage.getItem("list@"+ nisn +"@"+ idlist)
                const decode_l  = JSONParse(l)
                setList(decode_l)
                
                const s = window.localStorage.getItem("refresh@"+ nisn + "@" + idlist)
                const decode_s = JSONParse(s)
                setSoal(decode_s)
                
                const d = window.localStorage.getItem("data@"+ nisn + "@"+ idlist)
                const decode_d = JSONParse(d)
                setData(decode_d)

            setLoading(false)
        } catch (error) {
            
        }
    }, [])
    if(loading) {
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
    return(
        <Suspense fallback={"Tunggu sebentar"}>
            <div className="bg-white shadow-md p-4 text-center h-11">


            </div>
            
            <Card className="md:w-3/4 lg:w-3/4 w-full mx-auto mt-8">
                <CardBody>
                    <SparklesIcon className="w-12 h-12 text-green-400 animate-bounce"></SparklesIcon>
                    Alhamdulillah {user.name}, Pengerjaan {list.tipe} pada mata pelajaran {list.name} selesai dengan baik, berikut rekap hasil pengerjaan anda :
                    <p>
                        <Button onClick={() => nav("/cbt")} color="blue">Kembali Ke Halaman Depan</Button>
                    </p>
                </CardBody>
            </Card>
            {
                soal.map((e,k) => (
                    <Card key={k} className="md:w-3/4 lg:w-3/4 w-full mx-auto mt-3">
                        <CardBody>
                            <Chip variant="gradient" className="mr-3" value={"Nomer Soal : "+ Number(k+1)}/> 
                            <Chip variant="gradient" className="mr-3" color="indigo" value={"Score : "+ soal[k].score}/>
                            <Chip variant="gradient" color="lime" value={soal[k].tipe}/>

                            <div className="mt-4" dangerouslySetInnerHTML={{__html: soal[k].question }}/>
                            <div className="mt-4">
                                    {
                                        soal[k].tipe === "pilgan" ? (
                                            <>
                                                {
                                                    JSONParse(soal[k].answer).length > 1 ? (
                                                        <>
                                                            {
                                                                JSONParse(soal[k].options).map((e,k) => (
                                                                    <div className="mt-2" key={k}>
                                                                        <Checkbox label={e} disabled />
                                                                    </div>
                                                                ))
                                                            }
                                                        </>
                                                    ) : (
                                                        <>
                                                            {
                                                                JSONParse(soal[k].options).map((ek,ke) => (
                                                                    
                                                                    <div className="flex items-center mb-4" key={ke}>
                                                                        <input 
                                                                            id={"options_key_"+ soal[k].id + "_key_"+ k} 
                                                                            type="radio" 
                                                                            value={data[k][1]}
                                                                            name={"options_key_"+soal[k].id} 
                                                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" 
                                                                            
                                                                            checked={data[k] && data[k][0] === soal[k].id && data[k][1].includes(ke)}

                                                                            disabled
                                                                            />

                                                                        <label htmlFor={"options_key_"+ soal[k].id + "_key_"+ k} className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{ek}</label>
                                                                    </div>
                                                                ))
                                                            }
                                                        </>
                                                    )
                                                }
                                            </>
                                        ) : soal[k].tipe === "isian_singkat" ? (
                                            <>
                                                <Input variant="static"
                                                value={data[k][1]} label="Jawaban Singkat" placeholder="Jawaban anda..." disabled/>
                                            </>
                                        ) : soal[k].tipe === "isian_panjang" ? (
                                            <>
                                                <Textarea 
                                                value={data[k][1]} variant="static" label="Jawaban Panjang" placeholder="Jawaban anda..." disabled/>
                                            </>
                                        ) : soal[k].tipe === "menjodohkan" ? (
                                            <>

                                            </>
                                        ) : "Soal Tidak terdeteksi, soal corrupt"
                                    }

                                </div>
                        </CardBody>
                    </Card>
                ))
            }
        </Suspense>
    )
}