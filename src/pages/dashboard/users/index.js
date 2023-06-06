
import { useEffect, Suspense, lazy, useRef, useState  } from "react";
import { Button, Chip, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Option, Select, Typography } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const SkeletonTable = lazy(() => import("../../../elements/skeleton/table"))
const HrElement = lazy(() => import("../../../elements/hr"))
const JumbrotonElement = lazy(() => import("../../../elements/jumbroton"))

export default function IndexUsersDashboard() {
    const [ckelas, setCkelas] = useState(0)
    const [kelas, setkelas] = useState([])
    const [user, setUser] = useState([])
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)

    const [nisn, setNisn] = useState("")
    const [name, setName] = useState("")
    const [kel, setKel] = useState("")
    const [sandi, setSandi] = useState("")
    const fileInputRef = useRef(null)
    const nav = useNavigate()
    const handleOpen = () => setOpen(!open)
    const handleInputFile = () => {
        fileInputRef.current.click();

    }
    const getUser = (kelas) => {
        setLoading(true)
        import("../../../service/dashboard/users").then(({getStudent}) => {
            getStudent(kelas).then(d => {
                setUser(d)
                setLoading(false)
            })
        })
    }

    useEffect(() => {
        document.title = "Daftar siswa";
        import("../../../service/dashboard/kelas").then(({countKelas}) => {
            countKelas().then(e => {
                setCkelas(e)
            })
        })
    }, [])

    useEffect(() => {
        import("../../../service/dashboard/kelas").then(({getKelasAll}) => {
            getKelasAll().then(e => {
                setkelas(e)
                getUser(e[0].name)
            })

        })
    }, [])

    

    const eventDelete = (id) => {
        import("../../../service/dashboard/kelas").then(({deleteKelas, getKelasAll, countKelas}) => {
            deleteKelas(id).then(e => {
                if(e) {
                    getKelasAll().then(e => {
                        setkelas(e)
                    })
                    countKelas().then(e => {
                        setCkelas(e)
                    })
                }
            })
        })
    }
    const eventAdd = (name) => {
        import("../../../service/dashboard/kelas").then(({insertKelas, getKelasAll, countKelas}) => {
            insertKelas(name).then(() => {
                getKelasAll().then(e => {
                    setkelas(e)
                })
                countKelas().then(e => {
                    setCkelas(e)
                })
            })
        })
    }

    const confirmSave = () => {
        import("../../../service/dashboard/users").then(({insertUser}) => {
            insertUser({nisn, name, kelas : kel, sandi}).then(r => {
                if(r) {
                    nav(0)
                }
            })
        })
    }
    const handleNewUser = () => {
        handleOpen()
    }

    const insertMany = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        
        reader.onload = (e) => {
            import("xlsx").then(XLSX => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                excelData.shift();
                const extract = excelData.map(r => {
                  return {
                      nisn :  r[1].toString(),
                      name : r[2],
                      kelas : r[3],
                      pass : r[4]
                  }
                })
                import("../../../service/dashboard/users").then(({insertManyUser})=> {
                    insertManyUser(extract).then(e => {
                      Swal.fire("Notif", e, "success")
                    })
                })
            })
        };
    
        reader.readAsArrayBuffer(file);
      };
    return(
        <Suspense fallback={<SkeletonTable/>}>
            <JumbrotonElement to={"/"} badge={"tutorial"} title={"Beginilah cara mengelola data peserta didik pada Yami-sis"} desc={"Pastikan data sudah sesuai dengan data yang sebenarnya ya, tinggal klik tambah dan simpan, pastikan jabatan juga sudah disetting"} />
            <HrElement/>
            <Button value="Upload Via Excel" className="m-1" onClick={handleInputFile}>Upload Via Excel</Button>
            <Button value="Add new User" className="m-1" onClick={handleNewUser}>Tambah Peserta didik baru</Button>

                    <input type="file" style={{ "display" : "none"}} ref={fileInputRef}  onChange={insertMany}/>
            <div className="grid grid-cols-5 gap-4 mt-8">
                <div className="lg:col-span-4 col-span-5 order-2 lg:order-1">
                    <div className="w-72 flex mt-2 mb-2">
                        <Select label="Kelas">
                            {
                                kelas.map((e,k) => (
                                    <Option key={k} onClick={() => getUser(e.name)}>{e.name}</Option>
                                ))
                            }
                        </Select>
                        
                    </div>
                {
                    loading ? (
                        <SkeletonTable className="mt-2"/>
                    ) : (
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-2">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Urutan
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            numId
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Nama
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Kelas
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Sandi
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
                                                {u.nisn}
                                            </td>
                                            <td className="px-6 py-4">
                                                {u.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                {u.kelas}
                                            </td>
                                            <td className="px-6 py-4">
                                                {u.pass}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link to="/" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</Link>
                                            </td>
                                        </tr>
                                    ))
                                }
                                </tbody>
                            </table>
                        </div>
                    )
                }
                </div>
                <div className="lg:col-span-1 col-span-5 order-1 lg:order-2">
                    Total ada {ckelas}
                    <hr></hr>
                    {
                        kelas.map((e,k) => (
                            <Chip
                                animate={{
                                mount: { y: 0 },
                                unmount: { y: 50 },
                                }}
                                className="m-1"
                                value={e.name}
                                key={k}
                                icon = {
                                    kelas.length > 1 ? (
                                        <svg onClick={() => eventDelete(e.id)} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    ) : ""
                                }
                                />
                        ))
                    }
                    <div className="mt-8">
                    <Input label="Type Name kelas and spasi" className="w-8" onKeyUp={e => {
                        if(e.code === "Space") {
                            eventAdd(e.target.value)
                            e.target.value = "";
                        }
                    }}  ></Input>

                    </div>
                </div>
                
            </div>

            <Dialog open={open} handler={handleOpen} size="xl">
                    <DialogHeader>
                        <Typography variant="h3">Tambah baru</Typography>
                    </DialogHeader>
                    <DialogBody>
                        <div className="mt-3" onChange={(e) => setNisn(e.target.value)}>
                        <Input label="NISN"/>
                        </div>
                        <div className="mt-3">
                        <Input label="Nama" onChange={(e) => setName(e.target.value)}/>
                        </div>
                        <div className="mt-3">
                        <Input label="Kelas" onChange={(e) => setKel(e.target.value)}/>
                        </div>
                        <div className="mt-3">
                        <Input label="Sandi" onChange={(e) => setSandi(e.target.value)}/>
                        </div>

                    </DialogBody>
                    <DialogFooter>
                        <Button color="orange" onClick={handleOpen} className="m-2"> Tutup </Button>
                        <Button color="blue" onClick={confirmSave} className="m-2">Simpan</Button>
                    </DialogFooter>

            </Dialog>
        </Suspense>
    )
}