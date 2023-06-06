import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, CardBody, CardFooter, CardHeader, Checkbox, Chip, Dialog, Input, Option, Select, Typography } from "@material-tailwind/react";
import { Suspense } from "react";
import { SkeletonTable } from "../../../elements/skeleton/table";
import Swal from "sweetalert2";
import { CubeTransparentIcon } from "@heroicons/react/24/outline"

export function TableCBTElement() {
    const nav = useNavigate()
    const [live, setLive] = useState([])
    const [priority, setPriority] = useState(false)
    const [open, setOpen] = useState(false)
    const [id, setId] = useState(null)
    const [name, setName] = useState("")
    const [jenis, setJenis] = useState("")
    const [durasi, setDurasi] = useState(0)
    const [minDurasi, setMinDurasi] = useState(0)
    const [kelas, setKelas] = useState("")
    const [loading, setLoading] = useState(false)
    const [txtDelete, setTxtDelete] = useState([])
    const [creator, setCreator] = useState(false)
    const ChangePriority = (event, id) => {
        setPriority(true)
        import("../../../service/dashboard/cbt").then(({changePriorityCBT_list}) => {
            changePriorityCBT_list(Number(id), event.target.checked).then(e => {
                setPriority(false)
            })
        })

        
        
    }

    const handlerOpen = () => setOpen(!open)
    const handlerListChange = (k) => {
        const d = live[k]
        setId(d.id)
        setName(d.name)
        setJenis(d.jenis)
        setDurasi(d.durasi)
        setMinDurasi(d.min_durasi)
        setKelas(d.tokelas)

        handlerOpen()


    }
    const handleUpdate = () => {
        setLoading(true);
        import("../../../service/dashboard/cbt").then(({updateCBT_list}) => {
            updateCBT_list({id, name, jenis, durasi, min_durasi : minDurasi, tokelas : kelas}).then(r => {
                setLoading(false)
                handlerOpen()
            })
        })
    }
    const handlerListRemove = (id) => {
        const inde = live.findIndex(Obj => Obj.id === id)

        Swal.fire({
            title : "Comfirmation delete CBT " + live[inde].name,
            icon : "warning",
            showCancelButton : true,
            confirmButtonText : "Saya yakin, hapus saja",
            cancelButtonText : "Tidak dulu"
        }).then(e => {
            if(!e.isConfirmed) return;
            let ui = [...txtDelete]
            ui[inde] = ""
            setTxtDelete(ui)
            import("../../../service/dashboard/cbt").then(({removeListWIthId}) => {
                removeListWIthId(id).then(li => {
                    if(!li) return;
                    ui[inde] = "Berhasil"
                    setTxtDelete(ui)
                    let d = live;
                    d.splice(inde, 1);
                    setLive(d)
                    setTimeout(() => {
                        ui[inde] = "Delete";
                        setTxtDelete(ui)
                    }, 1000)
                })
            })
        })
    }
    useEffect(() => {
        import("../../../service/dashboard/cbt").then(({getCBT}) => {
            getCBT().then(d => {
                const l = d.map(e => "Delete")
                setTxtDelete(l)
                setLive(d)
            })
        })

        import("../../../service/constant").then(a => {
            setCreator(a.getOperator())

        })
    }, [])
    return(
        <Suspense fallback={<SkeletonTable/>}>
            {
                creator ? (
                    <Button onClick={() => nav("/dashboard/cbt/export_nilai")} color="green" className="flex gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-filetype-xlsx" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM7.86 14.841a1.13 1.13 0 0 0 .401.823c.13.108.29.192.479.252.19.061.411.091.665.091.338 0 .624-.053.858-.158.237-.105.416-.252.54-.44a1.17 1.17 0 0 0 .187-.656c0-.224-.045-.41-.135-.56a1.002 1.002 0 0 0-.375-.357 2.028 2.028 0 0 0-.565-.21l-.621-.144a.97.97 0 0 1-.405-.176.37.37 0 0 1-.143-.299c0-.156.061-.284.184-.384.125-.101.296-.152.513-.152.143 0 .266.023.37.068a.624.624 0 0 1 .245.181.56.56 0 0 1 .12.258h.75a1.093 1.093 0 0 0-.199-.566 1.21 1.21 0 0 0-.5-.41 1.813 1.813 0 0 0-.78-.152c-.293 0-.552.05-.777.15-.224.099-.4.24-.527.421-.127.182-.19.395-.19.639 0 .201.04.376.123.524.082.149.199.27.351.367.153.095.332.167.54.213l.618.144c.207.049.36.113.462.193a.387.387 0 0 1 .153.326.512.512 0 0 1-.085.29.558.558 0 0 1-.255.193c-.111.047-.25.07-.413.07-.117 0-.224-.013-.32-.04a.837.837 0 0 1-.249-.115.578.578 0 0 1-.255-.384h-.764Zm-3.726-2.909h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415H1.5l1.24-2.016-1.228-1.983h.931l.832 1.438h.036l.823-1.438Zm1.923 3.325h1.697v.674H5.266v-3.999h.791v3.325Zm7.636-3.325h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415h-.861l1.24-2.016-1.228-1.983h.931l.832 1.438h.036l.823-1.438Z"/>
                        </svg> Export Ke Excel
                    </Button>
                ) : ""
            }
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-4">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">

                            </th>
                            <th scope="col" className="px-6 py-3">
                                Nama
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Jenis
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Durasi (menit)
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Acak
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Kode
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Kelas
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            live.map((e,k) => (
                                <tr key={k} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <th className="px-3 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {
                                            creator ? (
                                                    <Checkbox className="p-1" onChange={(event) => ChangePriority(event, e.id)} id={"chekedsoal"+ k} name={"chekedsoal"+ k} disabled={priority} defaultChecked={e.priority}/>
                                                
                                            ) : ""
                                        }
                                        {
                                            creator ? (
                                                <span onClick={() => handlerListRemove(e.id)} className="font-medium cursor-pointer text-red-600 dark:text-red-500 hover:underline mr-3">
                                                    {txtDelete[k] === "Delete" ? "" : <CubeTransparentIcon className="animate-spin w-5 h-5 mr-2"/> }
                                                    {txtDelete[k]}
                                                </span>
                                            ) : ""
                                        }
                                        {
                                            creator ? (
                                                <span onClick={() => handlerListChange(k)} className="font-medium cursor-pointer text-orange-600 dark:text-orange-500 hover:underline mr-3">Edit</span>
                                                
                                            ) : ""
                                        }
                                        <Link to={"/dashboard/cbt/id/" + e.id} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Open</Link>
                                    </th>
                                    <th scope="row" className="px-6 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                       {e.name}
                                    </th>
                                    <td className="px-6 py-1">
                                        {e.jenis}
                                    </td>
                                    <td className="px-6 py-1">
                                    {e.min_durasi} - {e.durasi} 
                                    </td>
                                    <td className="px-6 py-1">
                                        {e.acak ? <Chip variant="gradient" color="lime" value={"YA"}/> : <Chip variant="gradient" color="red" value={"TIDAK"}/>}
                                    </td>
                                    <td className="px-6 py-1">
                                        {e.code}
                                    </td>
                                    <td className="px-1 py-1 w-32 overflow-y-auto flex gap-2 scroll-m-0">
                                        {e.tokelas.split(",").map(t => t.trim()).map(t => (
                                            <Chip color="orange" variant="ghost" value={t}></Chip>
                                        ))}
                                    </td>
                                </tr>

                            ))
                        }
                    </tbody>
                </table>
            </div>

            <Dialog
            
        size="xl"
        open={open}
        handler={handlerOpen}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-4 grid h-28 place-items-center"
          >
            <Typography variant="h3" color="white">
              Update Soal
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <Input label="Nama Soal" defaultValue={name} size="lg" onChange={(e) => setName(e.target.value)}/>
            <Select label="Jenis">
                <Option onClick={() => setJenis("ULANGAN")}>ULANGAN</Option>
                <Option onClick={() => setJenis("ANBK")}>ANBK</Option>
                <Option onClick={() => setJenis("AMBK")}>AMBK</Option>
                <Option onClick={() => setJenis("OLIMPIADE")}>OLIMPIADE</Option>
                <Option onClick={() => setJenis("UN")}>UN</Option>
            </Select>
            <Input label="Waktu (menit)" defaultValue={durasi} type="number" size="lg" onChange={(e) => setDurasi(e.target.value)} />
            <Input label="Min waktu (menit)" defaultValue={minDurasi} type="number" size="lg" onChange={(e) => setMinDurasi(e.target.value)} />
            <Input label="Kelas" defaultValue={kelas} placeholder=" " type="text" size="lg" onChange={(e) => setKelas(e.target.value)}/>
            
            <span className="text-sm text-red-600">
            Gunakan tanda koma (,) untuk kelas lebih dari 1. contoh : 7A, 8B, 7H
            </span>
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="gradient" onClick={handleUpdate} fullWidth>
              {
                loading ? "Sedang Updating..." : "Update Soal"
              }
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
        </Suspense>
    )
}