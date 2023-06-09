import { useEffect, useState, lazy } from "react"
import { Link } from "react-router-dom"


const SkeletonBerita = lazy(() => import("./skeleton/berita"))
export default function BeritaElement() {
    const [berita, setBerita] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    useEffect(()=> {
        import("../service/berita").then(({BeritaNew}) => {
            BeritaNew().then(d => {
                setTimeout(() => {
                    setIsLoading(true)
                    setBerita(d)
    
                }, 3000)
            })
        })
    }, [])
    return(
        <div className="mt-8 text-left px-8">
            <h2 className="text-4xl font-bold text-slate-700 mb-5">Berita terkini</h2>

            {
                !isLoading ? (
                    <>
                        <SkeletonBerita/>
                        <SkeletonBerita/>
                        <SkeletonBerita/>
                    </>
                ) : (
                    <>
                        {
                            berita.map((e, k) => (
                                <div className="mt-2" key={k}>
                                    <Link to={"/berita/"+ e.title.replace(" ", "-")} className="flex flex-col items-center bg-white rounded-lg md:flex-row md:max-w-xl hover:bg-gray-100  dark:bg-gray-800 dark:hover:bg-gray-700 mt-5">
                                        <img className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg" src={e.thumb} alt=""/>
                                        <div className="flex flex-col justify-between p-4 leading-normal">
                                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{e.title}</h5>
                                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{e.sekilas}</p>
                                        </div>
                                    </Link>
                                </div>
                            ))
                        }
                    </>
                )
            }

            <Link to="/berita" className="text-blue-400 hover:text-blue-500 hover:underline">Baca Berita lainnya...</Link>

        </div>
    )
}