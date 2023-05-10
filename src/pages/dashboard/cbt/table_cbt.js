import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { changePriorityCBT_list, getCBT, updateCBT_list, RemoveResultWIthListId, RemoveSoalWithListId, removeListWIthId } from "../../../service/dashboard/cbt";
import { Button, Card, CardBody, CardFooter, CardHeader, Checkbox, Chip, Dialog, Input, Option, Select, Typography } from "@material-tailwind/react";
import { Suspense } from "react";
import { SkeletonTable } from "../../../elements/skeleton/table";
import Swal from "sweetalert2";
import { CubeTransparentIcon } from "@heroicons/react/24/outline"

export function TableCBTElement({Live}) {
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
    const [txtDelete, setTxtDelete] = useState("Delete")
    const ChangePriority = (event, id) => {
        setPriority(true)
        changePriorityCBT_list(Number(id), event.target.checked).then(e => {
            setPriority(false)
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
        updateCBT_list({id, name, jenis, durasi, min_durasi : minDurasi, tokelas : kelas}).then(r => {
            setLoading(false)
            handlerOpen()
        })
    }
    const handlerListRemove = (id) => {
        Swal.fire({
            title : "Comfirmation delete",
            icon : "warning",
            showCancelButton : true,
            confirmButtonText : "Saya yakin, hapus saja",
            cancelButtonText : "Tidak dulu"
        }).then(e => {
            if(!e.isConfirmed) return;
            setTxtDelete("Sedang menghapus Ujian...")
            removeListWIthId(id).then(li => {
                if(!li) return;
                setTxtDelete("Berhasil Menghapus...")
                nav(0)
            })
        })
    }
    useEffect(() => {
        getCBT().then(d => {
            setLive(d)
        })
    }, [live])
    return(
        <Suspense fallback={<SkeletonTable/>}>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
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
                                Minim selesai (menit)
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Dimulai
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Selesai
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
                            <th scope="col" className="px-6 py-3">
                                <span className="sr-only">Edit</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            live.map((e,k) => (
                                <tr key={k} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        <Checkbox onChange={(event) => ChangePriority(event, e.id)} id={"chekedsoal"+ k} name={"chekedsoal"+ k} disabled={priority} checked={e.priority}/>
                                    </th>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                       {e.name}
                                    </th>
                                    <td className="px-6 py-4">
                                        {e.jenis}
                                    </td>
                                    <td className="px-6 py-4">
                                        {e.durasi}
                                    </td>
                                    <td className="px-6 py-4">
                                        {e.min_durasi}
                                    </td>
                                    <td className="px-6 py-4">
                                        {e.mulai}
                                    </td>
                                    <td className="px-6 py-4">
                                        {e.berakhir}
                                    </td>
                                    <td className="px-6 py-4">
                                        {e.acak ? <Chip variant="gradient" color="lime" value={"YA"}/> : <Chip variant="gradient" color="red" value={"TIDAK"}/>}
                                    </td>
                                    <td className="px-6 py-4">
                                        {e.code}
                                    </td>
                                    <td className="px-6 py-4">
                                        {e.tokelas}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span onClick={() => handlerListRemove(k)} className="font-medium cursor-pointer text-red-600 dark:text-red-500 hover:underline mr-3">
                                            {txtDelete === "Delete" ? "" : <CubeTransparentIcon className="animate-spin w-5 h-5 mr-2"/> }
                                            {txtDelete}
                                        </span>
                                        <span onClick={() => handlerListChange(k)} className="font-medium cursor-pointer text-orange-600 dark:text-orange-500 hover:underline mr-3">Edit</span>
                                        <Link to={"/dashboard/cbt/id/" + e.id} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Open</Link>
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
            <Input label="Nama Soal" value={name} size="lg" onChange={(e) => setName(e.target.value)}/>
            <Select label="Jenis">
                <Option onClick={() => setJenis("ULANGAN")}>ULANGAN</Option>
                <Option onClick={() => setJenis("ANBK")}>ANBK</Option>
                <Option onClick={() => setJenis("AMBK")}>AMBK</Option>
                <Option onClick={() => setJenis("OLIMPIADE")}>OLIMPIADE</Option>
                <Option onClick={() => setJenis("UN")}>UN</Option>
            </Select>
            <Input label="Waktu (menit)" value={durasi} type="number" size="lg" onChange={(e) => setDurasi(e.target.value)} />
            <Input label="Min waktu (menit)" value={minDurasi} type="number" size="lg" onChange={(e) => setMinDurasi(e.target.value)} />
            <Input label="Kelas" value={kelas} placeholder=" " type="text" size="lg" onChange={(e) => setKelas(e.target.value)}/>
            
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