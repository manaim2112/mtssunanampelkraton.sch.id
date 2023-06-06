import { lazy, useEffect, useState } from "react";
import { saveWithUploadWordCBT } from "../../../service/dashboard/cbt";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL, dataURLtoFile, uuidv4 } from "../../../service/constant";
// import Compressor from "compressorjs";
import useDocumentTitle from "../../../elements/useDocumentTitle";
import Swal from "sweetalert2";
// import { SkeletonTable } from "../../../elements/skeleton/table";
import renderMathInElement from "katex/contrib/auto-render"


const { SkeletonTable } = lazy(() => import("../../../elements/skeleton/table"))

export default function UploadWordCBTDashboard() {
    
    useDocumentTitle("Upload Soal dengan Ms. Word")
    const {id} = useParams()
    const nav = useNavigate()
    const [htmlContent, setHtmlContent] = useState([])

    const [load, setLoad] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
            renderMathInElement(document.body, {
                // customised options
                // • auto-render specific keys, e.g.:
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false},
                    {left: '\\(', right: '\\)', display: false},
                    {left: '\\[', right: '\\]', display: true}
                ],
                // • rendering keys, e.g.:
                throwOnError : false
            });
    }, [htmlContent])
    const handleFileUpload = async (event) => {
        setLoading(true)
        const file = event.target.files[0];
        event.target.value = "";
        const reader = new FileReader();
        reader.onloadend = function(event) {
            var arrayBuffer = reader.result;
            var options = {
                convertImage: window.mammoth.images.imgElement(function(image) {
                    return image.read("base64").then((imageBuffer) => {
                        const form = new FormData();
                        const name = uuidv4()
                        const a = dataURLtoFile("data:image/png;base64," + imageBuffer, name + ".png")
                        form.append("photo", a);
                        return fetch(BASE_URL + "/cbt/soal/upload_foto", {
                            method : "POST",
                            body : form
                        }).then(res => res.json()).then(res => {
                            if(res.status === 201) {
                                return {
                                    src : BASE_URL + "/cbt/soal/image/"+ name + ".png"
                                }
                            }
                        })
                        // const j = new Compressor(a, {
                        //     quality : 0.8,
                        //     success : async (comp)=>{
                        //     }
                        // })
                        
                        // console.log(a)
                        // return fetch("https://api.imgbb.com/1/upload?key=e2177987d26511915526be8e5c693734", {
                        //     method : "POST",
                        //     body : form
                        // }).then(res => res.json()).then(data => {
                        //     return {
                        //         src : data.data.url
                        //     }
                        // })
                    })
                }),
                styleMap: [
                    "u => em"
                ]
            };
            window.mammoth.convertToHtml({arrayBuffer: arrayBuffer}, options).then(function (resultObject) {
                try {
                    const element = document.createElement("div");
                    element.innerHTML = resultObject.value
                    const getIntable = element.querySelector("table").querySelectorAll("tr")
                    const soal = []
                    const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
                    const firstNode = getIntable[0]
                    const parentNode = firstNode.parentNode;
                    parentNode.removeChild(firstNode);
                    const tr = parentNode.querySelectorAll("tr")
                    tr.forEach(ee => {
                        const td = ee.querySelectorAll('td')
                        const tipe = td[2].innerText.toLowerCase().trim();
                        const jawaban = []
                        if(tipe === "pilgan") {
                            td[3].querySelectorAll("ol li").forEach((r,k) => jawaban.push(r.innerHTML))
                        }
                        if(tipe === "menjodohkan") {
                            td[3].querySelectorAll("ol").forEach(element => {
                                const sub = []
                                element.querySelectorAll("li").forEach(el => {
                                    sub.push(el.innerHTML)
                                })
                                jawaban.push(sub)
                            });
                        }
                        const item = {
                            id : td[0].innerText,
                            soal : td[1].innerHTML,
                            tipe,
                            jawaban,
                            kunci : tipe === "pilgan" ? td[4].innerText.split(",").map(p => alpha.indexOf(p.trim())) : tipe === "menjodohkan" ? td[4].innerText.split(",").map(p => p.trim().split("").map(i => alpha.indexOf(i))) : [td[4].innerText],
                            skor : Number(td[5].innerText)
                        }
                        soal.push(item)
                    })
                    setHtmlContent(soal)
                    setLoading(false)
                    
                } catch (error) {
                    console.error(error)
                    Swal.fire({
                        title : "Gagal Upload",
                        icon : "error",
                        text : "Pastikan tidak ada tabel pada soal"
                    })
                }
            })

        }
        reader.readAsArrayBuffer(file);

    }

    const handleSave = () => {
        setLoad(true)
        saveWithUploadWordCBT(htmlContent, id).then(e => {
            
            if(e) {
                setLoad(false)

                setTimeout(() => {
                    nav(-1)
                }, 3000)
            }
        })
    }
    return(
        <>
        
            <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">DOC OR DOCX (MAX. 20MB)</p>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" onChange={handleFileUpload} />
                </label>
            </div> 

            <div className="text-red-600 bg-red-100 px-4 py-2 mt-5 mb-5">
                Setelah anda menyetujui upload soal berikut, maka soal ini akan ditambahkan di nomer selanjutnya
            </div>
            {
                loading ? <SkeletonTable/> : (
                    <div className="overflow-auto">
                        { htmlContent.length > 0 ? (
                            <div className="text-slate-700 my-2"> Preview Sekilas, periksa dengan teliti soal dibawah ini. Klik tombol simpan di paling bawah untuk menyimpan soal </div>
                        ) : ""}

                    {
                        htmlContent.map((e,k) => (
                            <div key={k} className="bg-slate-50 border border-slate-200 p-5 rounded-md mb-3 relative">
                                <div className="mb-4">
                                    <span className="bg-lime-200 text-lime-800 text-sm px-4 py-2 rounded-full">{e.tipe}</span>
                                    <span className="bg-purple-200 text-purple-800 text-sm px-4 py-2 rounded-full ml-5"> + {e.skor}</span>
                                </div>
                                
                                {k+1}. <span dangerouslySetInnerHTML={{__html: e.soal}}></span>
                                { e.tipe.toLowerCase() === "pilgan" ? (
                                    <ol className="pl-5 mt-2 space-y-1 list-latin list-inside">
                                        {
                                            e.jawaban.map((t, ke) => (
                                                <li key={ke}>
                                                    { e.kunci.includes(ke) ? (
                                                        <span className="bg-green-100 text-green-700" dangerouslySetInnerHTML={{__html : t}}>
                                                        </span>
                                                    ) : (
                                                        <span dangerouslySetInnerHTML={{__html : t}}>
                                                        </span>
                                                    ) }
                                                </li>
                                            ))
                                        }
                                    </ol>
                                ) : e.tipe.toLowerCase() === "menjodohkan" ? (
                                    <div className="grid grid-cols-2 gap-4">
                                        {
                                            e.jawaban.map((rr, rrk) => (
                                                <ul key={rrk} className="w-64 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                                    {
                                                        rr.map((y,tu) => (
                                                            
                                                            <li key={tu} className="w-full px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                                                                <span className="bg-slate-200 px-2 py-1 rounded-full mx-2">{y}</span>
                                                            </li>
                                                        ))
                                                    }
                                                </ul>

                                            ))
                                        }
                                    </div>
                                    
                                ) : (
                                    <div className="bg-green-200 px-4 py-2 text-green-700">
                                        {e.kunci}
                                    </div>
                                )
                                }
                                
                            </div>
                        ))
                    }
                    {
                                    htmlContent.length > 0 ? (
                                        <button disabled={load} className="inline-flex justify-center items-center py-2.5 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900" onClick={handleSave}>
                                        {
                                            load ? (
                                                <div role="status">
                                                    <svg aria-hidden="true" className="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                                    </svg>
                                                    <span className="sr-only">Loading...</span>
                                                    Sedang mengupload...
                                                </div>
                                            ) : (
                                                <>
                                                    Simpan Sekarang
                                                </>
                                            )
                                        } 
                                        </button>
                                    ) : ""
                                }

                    </div>

                )
            }
        </>
    )
}