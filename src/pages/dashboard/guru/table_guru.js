import { Suspense, useEffect, useState, lazy } from "react"
import { Button, Card, CardBody, CardFooter, CardHeader, Checkbox, Dialog, Input, Option, Select, Typography } from "@material-tailwind/react"
import { useNavigate } from "react-router-dom"

const SkeletonTable = lazy(() => import("../../../elements/skeleton/table"))
export default function TableGuruElement() {
    const [user, setUser] = useState([])
    const [data, setData] = useState({})
    const [open, setOpen] = useState(false)
    useEffect(() => {
        import("../../../service/dashboard/guru").then(({getGuru}) => {
            getGuru().then(d => {
                setUser(d)
            })
        })
    }, [])
    const [actionRemove, setActionRemove] = useState([])
    const Handleremove = (k, id) => {
        let h = [...actionRemove]
        if(!h[k]) {
            h[k] = true
            setActionRemove(h)
        } else {
            import("../../../service/dashboard/guru").then(({deleteGuru, getGuru}) => {
                deleteGuru(id).then(e => {
                    if(!e) return;
                    setActionRemove([])
                    getGuru().then(d => {
                        setUser(d)
                    })
                })
            })
        }
    }
    return(
        <Suspense fallback={<SkeletonTable/>}>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Urutan
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    PegId
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Nama Guru
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Jabatan
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Wali Kelas 
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            user.map((u, uk) => (
                                <tr key={uk} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {uk+1}
                                    </th>
                                    <td className="px-6 py-4">
                                        {u.pegId}
                                    </td>
                                    <td className="px-6 py-4">
                                        {u.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {u.jabatan}
                                    </td>
                                    <td className="px-6 py-4">
                                        {u.walikelas ? u.walikelas : "TIDAK"}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        { u.jabatan === "operator" ? "" : (
                                            <>
                                                <span onClick={() => {
                                                    setData(u)
                                                    setOpen(true)
                                                }} className="curson-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</span>
                                                <span onClick={e => Handleremove(uk, u.id)} className="font-medium ml-4 text-red-600 dark:text-red-500 hover:underline cursor-pointer">{
                                                    actionRemove[uk] ? "Yakin ingin hapus ? klik lagi" : "Hapus"
                                                }</span>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        }

                        </tbody>
                    </table>

                    <EditGuru data={data} opened={open} setOpened={setOpen}/>
                </div>

        </Suspense>
    )
}

export function EditGuru({data, opened, setOpened}) {
    const [open, setOpen] = useState(false)
    const [pegId, setPegId] = useState("")
    const [name, setName] = useState("")
    const [pass, setPass] = useState("")
    const [jabatan, setJabatan] = useState("")
    const [walikelas,setWalikelas] = useState("")
    const [checklist, setChecklist] = useState(false)
    const [loading, setLoading] = useState(false)
    const [kelas, setKelas] = useState([])
    const navigate = useNavigate()
    const handleUpdate = (id) => {
        setLoading(true)
        import("../../../service/dashboard/guru").then(({updateGuru}) => {
            updateGuru({id, pegId, name, pass, walikelas, jabatan}).then(e => {
                setLoading(false)
                if(!e) return;
                navigate(0)
            })
        })
    }

    useEffect(() => {
        import("../../../service/dashboard/kelas").then(({getKelasAll}) => {
            getKelasAll().then(e => {
                setKelas(e)
            })
        })
    }, [])
    useEffect(() => {
        setOpen(opened)
        setPegId(data.pegId)
        setName(data.name)
        setPass(data.pass)
        setJabatan(data.jabatan)
        setWalikelas(data.walikelas)
        if(data.walikelas !== null) {
            setChecklist(true)
        }
        
    }, [opened, data.pegId, data.name, data.pass, data.jabatan, data.walikelas])

    const handleOpen = () => {
        setOpen(!open)
        setOpened(!open)
    }
    return(
        <Dialog
                size="xl"
                open={open}
                handler={handleOpen}
                className="bg-transparent shadow-none"
            >
                <Card className="mx-auto w-full max-w-[24rem]">
                <CardHeader
                    variant="gradient"
                    color="blue"
                    className="mb-4 grid h-28 place-items-center"
                >
                    <Typography variant="h3" color="white">
                    Create Pegawai
                    </Typography>
                </CardHeader>
                <CardBody className="flex flex-col gap-4">
                    <Input label="PegId" value={pegId} onChange={e => setPegId(e.target.value)} size="lg" />
                    <Input label="Nama Lengkap" value={name} onChange={e => setName(e.target.value)} size="lg" />
                    <Input label="Sandi" value={pass} onChange={e => setPass(e.target.value)} type="password" size="lg" />
                    
                    <div className="-ml-2.5">
                    <Checkbox onChange={e => {
                        setChecklist(e.target.checked)
                        if(e.target.checked) {
                            setWalikelas(null)
                        }
                    }} label="Jadikan walikelas ?" checked={walikelas} />
                    <div className="my-4">
                    <Select label="walikelas" hidden={!checklist} value={walikelas} size="lg">
                        {
                            kelas.map((e, k) => (
                                <Option key={k} onClick={() => setWalikelas(e.name)}>{e.name}</Option>
                            ))
                        }
                    </Select>

                    </div>
                    <div className="mt-4">
                        <Select label="Jabatan" size="lg" value={jabatan} className="">
                            <Option onClick={() => setJabatan("guru")}>guru</Option>
                            <Option onClick={() => setJabatan("bendahara")}>bendahara</Option>
                            <Option onClick={() => setJabatan("perpustakaan")}>perpustakaan</Option>
                            <Option onClick={() => setJabatan("tu")}>Tenaga Umum</Option>
                            <Option onClick={() => setJabatan("kepala sekolah")}>kepala sekolah</Option>
                            <Option onClick={() => setJabatan("wakil kurikulum")}>wakil kurikulum</Option>
                            <Option onClick={() => setJabatan(null)}>Tidak menjabat</Option>
                        </Select>

                    </div>
                    </div>
                </CardBody>
                <CardFooter className="pt-0">
                    <Button variant="gradient" onClick={() => handleUpdate(data.id)} fullWidth>
                        {
                            loading ? "Sedang memprosess..." : "Update Data"
                        }
                    </Button>
                </CardFooter>
                </Card>
            </Dialog>
    )
}