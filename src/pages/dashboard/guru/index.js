
import { JumbrotonElement } from "../../../elements/jumbroton";
import { HrElement } from "../../../elements/hr";
import { TableGuruElement } from "./table_guru";
import useDocumentTitle from "../../../elements/useDocumentTitle";
import { Button, Card, CardBody, CardFooter, CardHeader, Checkbox, Dialog, Input, Typography } from "@material-tailwind/react";
import { useState } from "react";
import { insertGuru } from "../../../service/dashboard/guru";
import { useNavigate } from "react-router-dom";

export default function IndexGuruDashboard() {
    
    useDocumentTitle("Pegawai - Dashboard")
    
    
    return(
        <>
            <JumbrotonElement to={"/"} badge={"tutorial"} title={"Beginilah cara mengelola data peserta didik pada Yami-sis"} desc={"Pastikan data sudah sesuai dengan data yang sebenarnya ya, tinggal klik tambah dan simpan, pastikan jabatan juga sudah disetting"} />
            <AddGuru/>
            <HrElement/>
            <div className="grid grid-cols-5 gap-2">
                <div className="col-span-5 lg:col-span-3">
                    <TableGuruElement/>
                </div>
                
            </div>
        </>
    )
}

export function AddGuru() {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen((cur) => !cur);
    const [pegId, setPegId] = useState("")
    const [name, setName] = useState("")
    const [pass, setPass] = useState("")
    const [checklist, setChecklist] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [errors, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const handleAdd = () => {
        if(!checklist) return;
        setLoading(true)
        insertGuru({pegId, name, pass}).then(e => {
            
            handleOpen();
            setLoading(false)
            navigate(0)
        })
    }
    return(
        <>
            <Button onClick={handleOpen}>+ TAMBAH PEGAWAI</Button>
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
                    <Input label="PegId" onChange={e => setPegId(e.target.value)} size="lg" />
                    <Input label="Nama Lengkap" onChange={e => setName(e.target.value)} size="lg" />
                    <Input label="Sandi" onChange={e => setPass(e.target.value)} type="password" size="lg" />
                    <Input label="Ulangi sandi" error={errors} type="password" size="lg" onChange={(e) => {
                        if(e.target.value !== pass) {
                            setError(true)
                        } else {
                            setError(false)
                        }
                    }} />
                    <div className="-ml-2.5">
                    <Checkbox onChange={e => {
                        setChecklist(e.target.checked)
                        if(e.target.checked && pegId !== "" && name !== "" && pass !== "" && !errors) {
                            setDisabled(true)
                        } else {
                            setDisabled(false)
                        }
                    }} label="tercentang jika anda valid melakukan ulangsandi dan anda menyetujui untuk menambahkan pegawai baru" />
                    </div>
                </CardBody>
                <CardFooter className="pt-0">
                    <Button variant="gradient" onClick={handleAdd} fullWidth disabled={!disabled}>
                        {
                            loading ? "Sedang memprosess..." : "Tambah Pegawai"
                        }
                    </Button>
                </CardFooter>
                </Card>
            </Dialog>

        </>
    )
}
