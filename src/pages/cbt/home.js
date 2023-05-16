import { CheckBadgeIcon, PowerIcon } from "@heroicons/react/24/outline";
import { Button, Card, CardBody, CardFooter, CardHeader, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Input, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { JSONParse } from "../../service/constant";
import { HrElement } from "../../elements/hr";
import { checkingCodeWithIdList, listSoalWithKelas } from "../../service/cbt/list";
import { getResultWithUserId, startingCBT } from "../../service/cbt/result";
import { useNavigate } from "react-router-dom";
import { getSoalWithIdList } from "../../service/cbt/soal";

export function HomeCBT() {
    const [user, setUser] = useState({})
    const [list, setList] = useState([])
    const [result, setResult] = useState([])
    const [open, setOpen] = useState(false)
    const [code, setCode] = useState("")
    const [active, setActive] = useState("")
    const [loading, setLoading]= useState(false)
    const nav = useNavigate()
    const handleOpen = () => setOpen(!open)
    useEffect(() => {
        
        const h = window.sessionStorage.getItem("refresh-token")

        const j = JSONParse(atob(h))
        listSoalWithKelas(j.kelas).then(e => {
            setList(e)
        })

        getResultWithUserId(j.id).then(r => {
            setResult(r)
        })

        setUser(j)
    }, [])

    const handleStart = (id) => {
        handleOpen();
        setActive(id)
    }

    const logOut = () => {
        window.sessionStorage.removeItem("refresh-token");
        nav(0)
    }
    const setNewStart = (act) => {
        getSoalWithIdList(Number(active)).then(e => {
            let sort = e;
            if(act.acak) {
                sort = e.sort((a,b) => Math.random() - .5);
            }
            window.localStorage.setItem("refresh@"+ user.nisn +"@"+ active, JSON.stringify(sort))
            window.localStorage.setItem("timing@"+ user.nisn + "@" + active, new Date())
            window.localStorage.setItem("list@"+ user.nisn + "@" + active, JSON.stringify(act))
            if(!window.localStorage.getItem("data@"+ user.nisn + "@" + active)) {
                window.localStorage.setItem("data@"+ user.nisn + "@" + active, JSON.stringify(sort.map(y => [y.id, []])))
            }
            
            setLoading(false)
            nav("/cbt/start/"+ btoa(user.nisn+"@"+active))
        })
    }

    const newStart = (act) => {
        startingCBT({idlist : Number(active), iduser : Number(user.id)}).then(e => {
            if(!e) return setLoading(false)
            return setNewStart(act)
        })
    }
    const handleNext = () => {
        setLoading(true)
        checkingCodeWithIdList(active).then(e => {
            const l = list.findIndex(O => O.id === active);
            if(l === -1) return setLoading(false);
            const act = list[l];
            if(e.code !== code) return setLoading(false)
            const use = result.findIndex(O => O.idlist === active);
            if(use === -1) {
                return newStart(act)
            } 

            return setNewStart(act) 
        })
    }
    
    return (
        <>
            <div className="md:flex lg:flex h-screen overflow-y-auto">
                <div className="p-8 bg-gray-100/40 md:h-screen lg:h-screen md:sticky lg:sticky top-0 md:inline-block">

                    <IconButton color="white" ripple={true} onClick={logOut}>
                        <PowerIcon className="w-6 h-6 text-red-500"></PowerIcon>
                    </IconButton>
                </div>

                <div className="h-screen p-8 flex-auto">
                    <Typography variant="h2" className="text-slate-800">Selamat datang kembali, {user.name} </Typography>

                    <HrElement/>    
                    <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                        {
                            list.map((e,k) => (
                                <Card key={k} className="m-1">
                                    <CardHeader variant="gradient"
                                color="yellow"
                                className="mb-2 mt-0 grid h-8 place-items-center">{e.jenis}</CardHeader>
                                    <CardBody>
                                        <Typography variant="h5">{e.name}</Typography>
                                        <span className="text-sm">Pelaksanaan
                                        <br></br> {e.mulai} - {e.berakhir}</span>
                                        <div className="">Waktu : {e.durasi} menit</div>
                                    </CardBody>
                                    <CardFooter>
                                        { 
                                            result.map(e => e.idlist).includes(e.id) ? (
                                                <>
                                                
                                                    {
                                                        result[result.findIndex(O => O.idlist === e.id)].process === "start" ? (         
                                                            <div onClick={()=> handleStart(e.id)} className="text-green-300 text-center cursor-pointer px-2 hover:text-green-500 inline-block bg-green-100 rounded-lg">Lanjutkan mengerjakan 
                                                            </div>
                                                        ) : (
                                                                <div className="text-green-500 flex place-items-center">
                                                                    <CheckBadgeIcon className="w-6 h-6 mr-3"></CheckBadgeIcon> Telah Selesai mengerjakan

                                                                </div>

                                                        )
                                                    }
                                                </>
                                            ) : (
                                                <>
                                                    {
                                                        e.priority ? (
                                                            <div onClick={()=> handleStart(e.id)} className="text-blue-300 text-center cursor-pointer px-2 hover:text-blue-500 inline-block hover:bg-blue-100 hover:rounded-lg">Open 
                                                            </div>
                                                        ) : (
                                                            "Belum Waktunya"
                                                        )
                                                    }
                                                </>
                                            )
                                        }
                                    </CardFooter>
                                </Card>

                            ))
                        }
                    </div>
                </div>
                        
                <Dialog open={open} handler={handleOpen} size="xl">
                    <DialogHeader>Konfirmasi Kode</DialogHeader>
                    <DialogBody divider>
                        Pastikan anda sudah membaca petunjuk dari pengawas, persiapkan dengan baik agar mendapatkan hasil yang terbaik.
                        Segala sesuatu akan direkam setelah anda lanjut proses ini. terjadi kecurangan dapat berakibat fatal yang menyebabkan anda dikeluarkan dari CBT ini. Jika anda memang sudah yakin, ketikkan kode yang diberikan oleh pengawas ujian
                        <div className="mt-6">
                        <Input type="text" label="Code Confirmation" onChange={(e) => setCode(e.target.value)}/>  

                        </div>
                    </DialogBody>
                    <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={handleOpen}
                        className="mr-1"
                    >
                        <span>Cancel</span>
                    </Button>
                    <Button variant="gradient" color="green" onClick={handleNext} disabled={loading}>
                        {
                            loading ? "Tunggu sebentar..." : "Confirm"
                        }
                    </Button>
                    </DialogFooter>
                </Dialog>
                
            </div>
        </>
    )
}