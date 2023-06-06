import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { Button, Card, CardBody, CardFooter, CardHeader, Typography } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Install() {
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState("Menginstall peserta didik ... (1)")
    const [admin, setAdmin] = useState(false)
    const [checkingSekolah, setCheckingSekolah] = useState(false)
    const [cCBT, setCCBT] = useState(false)
    const [cPerpus, setCPerpus] = useState(false)
    const [cMateri, setMateri] = useState(false)
    const [cPage, setPage] = useState(false)
    const [ckegiatan, setKegiatan] = useState(false)

    useEffect(() => {
        document.title = "Instalasi yami sistem sekolah"
    }, [])

    const handleInstalation = () => {
        setLoading(true)
        import("../../service/install").then(({install, insertNewUser}) => {
            install("user").then(r => {
                if(r.status === 201) {
                    setMsg("Berhasil menambahkan peserta didik")
                    setTimeout(() => {
                        setMsg("Menginstall kelas ... (2)")
                        install("kelas").then(r => {
                            if(r.status === 201) {
                                setMsg("Berhasil menambahkan kelas")
                                setTimeout(() => {
                                    setMsg("Menginstall guru ... (3)")
                                    install("guru").then(r => {
                                        if(r.status === 201) {
                                            setMsg("Berhasil menambahkan guru")
                                            setCheckingSekolah(true)
                                            setTimeout(() => {
                                                setMsg("Menginstall Computer Based Test (CBT) ... (4)")
                                                install("cbt").then(r => {
                                                    if(r.status === 201) {
                                                        setMsg("Berhasil menambahkan Computer Based Test (CBT) ")
                                                        setCCBT(true)
                                                        setTimeout(() => {
                                                            setMsg("Menginstall Halaman ... (5)")
                                                            install("page").then(r => {
                                                                if(r.status === 201) {
                                                                    setMsg("Berhasil menambahkan Halaman")
                                                                    setPage(true)
                                                                    setTimeout(() => {
                                                                        setMsg("Menginstall e-learning ... (6)")
                                                                        install("materi").then(r => {
                                                                            if(r.status === 201) {
                                                                                setMsg("Berhasil menambahkan e-learning")
                                                                                setMateri(true)
                                                                                setTimeout(() => {
                                                                                    setMsg("Menginstall kegiatan ... (7)")
                                                                                    install("kegiatan").then(r => {
                                                                                        if(r.status === 201) {
                                                                                            setMsg("Berhasil menambahkan kegiatan")
                                                                                            setKegiatan(true)
                                                                                            setTimeout(() => {
                                                                                                setMsg("Menginstall perpus ... (8)")
                                                                                                install("perpus").then(r => {
                                                                                                    if(r.status === 201) {
                                                                                                        setMsg("Berhasil menambahkan perpustakaan digital")
                                                                                                        setCPerpus(true)
                                                                                                        setTimeout(() => {
                                                                                                            setMsg("Membuat operator ... (9)")
                                                                                                            insertNewUser().then(e => {
                                                                                                                if(e) {
                                                                                                                    setMsg("Berhasil menambahkan operator")
                                                                                                                    setLoading(false)
                                                                                                                    setAdmin(true)
                                                                                                                } else {
                                                                                                                    console.log(e)
                                                                                                                }
                                                                                                            })
                                                                                                        }, 1000)
                                                                                                    } else {
                                                                                                        console.log(r)
                                                                                                    }
                                                                                                })
                                                                                            }, 1000)
                                                                                        }else {
                                                                                            console.log(r)
                                                                                        }
                                                                                    })
                                                                                }, 1000)
                                                                            } else {
                                                                                console.log(r)
                                                                            }
                                                                        })
                                                                    }, 1000)
                                                                } else {
                                                                    console.log(r)
                                                                }
                                                            })
                                                        }, 1000)
                                                    }else {
                                                        console.log(r)
                                                    }
                                                })
                                            }, 1000)
                                        } else {
                                            console.log(r)
                                        }
                                    })
                                }, 1000)
                            } else {
                                console.log(r)
                            }
                        })
                    }, 1000)
                } else {
                    console.log(r)
                }
            })
        })
    }
    return(
        <>
        <div className="text-center mt-20">
            <Typography variant="h1" color="blue" gradient="true">YAMI SIS Instalasi</Typography>
            Yami sis adalah Sistem Informasi Sekolah yang di buat oleh tim Yami
            <Card className="mt-10 w-full md:w-2/4 lg:w-2/4 sm:w-3/4 mx-auto">
                <CardHeader color="lime" className="p-5">
                    <Typography variant="h3"> Apa saja yang di install ? </Typography>
                    <ul>
                        <li className="flex">Computer Based Test (CBT) { cCBT ? <CheckBadgeIcon className="text-green-400 w-6 h-6"></CheckBadgeIcon> : ""}</li>
                        <li className="flex">Perpustakaan Digital { cPerpus ? <CheckBadgeIcon className="text-green-400 w-6 h-6"></CheckBadgeIcon> : ""}</li>
                        <li className="flex">Media e-learning { cMateri ? <CheckBadgeIcon className="text-green-400 w-6 h-6"></CheckBadgeIcon> : ""}</li>
                        <li className="flex">Post Kegiatan Sekolah { ckegiatan ? <CheckBadgeIcon className="text-green-400 w-6 h-6"></CheckBadgeIcon> : ""}</li>
                        <li className="flex">Content Sekolah { cPage ? <CheckBadgeIcon className="text-green-400 w-6 h-6"></CheckBadgeIcon> : ""}</li>
                        <li className="flex">Management sekolah { checkingSekolah ? <CheckBadgeIcon className="text-green-400 w-6 h-6"></CheckBadgeIcon> : ""}</li>
                    </ul>
                </CardHeader>
                <CardBody>
                    Pastikan anda sudah setting database dengan benar pada file .env
                    <Button disabled={loading} onClick={handleInstalation} className="w-full">
                       {
                        loading ? (
                            <>
                                {msg}
                            </>
                        ) : (
                            <span>Memulai Instalasi</span>

                        )
                       } 
                        
                    </Button>
                </CardBody>
                <CardFooter>
                        {
                            admin ? (
                                <div>
                                    Login Admin Awal <Link to="/auth/login_admin" className="text-blue-300 hover:text-blue-500 hover:underline">Klik ini</Link> dengan <strong>pegId:12345</strong> dan <strong>sandi:1234</strong>
                                </div>
                                
                                ) : ""
                        }
                </CardFooter>
            </Card>
        </div>
        
        </>
    )
}