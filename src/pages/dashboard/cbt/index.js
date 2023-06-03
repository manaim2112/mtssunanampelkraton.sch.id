import React, { useEffect } from "react";
import { HrElement } from "../../../elements/hr";
import { JumbrotonElement } from "../../../elements/jumbroton";
import useDocumentTitle from "../../../elements/useDocumentTitle";
import { TableCBTElement } from "./table_cbt";
import { Button, Card, CardBody, CardFooter, CardHeader, Dialog, Drawer, IconButton, Input, Option, Select, Typography } from "@material-tailwind/react";
import { useState } from "react";
import { randomText } from "../../../service/constant";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function IndexCBTDashboard() {
    useDocumentTitle("CBT - Dashboard")
    
    return (
        <>
            <JumbrotonElement badge={"Tutorial"} title={"Bagaimana cara membuat soal pada cbt"} desc={"Pastikan di isi seuai dengan petunjuk yang sudah disediakan, ketidak sesuaian dengan petunjuk mengakibatkan perbedaan hasil"} to={"https://youtube.com"}/>

                <AddNewCBTList/>
                <HrElement/>
                <TableCBTElement />
        </>
    )
}


export function AddNewCBTList() {
    const [open, setOpen] = React.useState(false);
    const [openXLS, setOpenXLS] = useState(false)
    const [name, setName] = useState("")
    const [jenis, setJenis] = useState("")
    const [durasi, setDurasi] = useState("")
    const [minDurasi, setMinDurasi] = useState("")
    const [kelas, setKelas] = useState("")
    const [akelas, setAkelas] = useState([])
    const [load, setLoad] = useState(false)

    useEffect(() => {
        handleKelasAll()
    }, [])

    const handleKelasAll = () => {
      import("../../../service/dashboard/kelas").then(({getKelasAll}) => {
        getKelasAll().then(e => {
            setAkelas(e)
        })
      })
    }
    const handleOpen = () => setOpen(!open)
    const handleOpenXLS = () => setOpenXLS(!openXLS)
    const handleSave = () => {
        setLoad(true)
        import("../../../service/dashboard/cbt").then(({insertCBT_list}) => {
          insertCBT_list({
              name, jenis, durasi, min_durasi : minDurasi, code : randomText(), tokelas : kelas
          }).then(e => {
              if(e) {
                  setOpen(false)
                  handleKelasAll();
              }
              setLoad(false)
          })
        })
    }
  return (
    <React.Fragment>
      
      <div className="flex gap-3">
        <Button onClick={handleOpen}>+ Tambah Soal</Button>
      </div>

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
              Soal Baru
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <Input label="Nama Soal" size="lg" onChange={(e) => setName(e.target.value)}/>
            <Select label="Jenis">
                <Option onClick={() => setJenis("ULANGAN")}>ULANGAN</Option>
                <Option onClick={() => setJenis("ANBK")}>ANBK</Option>
                <Option onClick={() => setJenis("AMBK")}>AMBK</Option>
                <Option onClick={() => setJenis("OLIMPIADE")}>OLIMPIADE</Option>
                <Option onClick={() => setJenis("UN")}>UN</Option>
            </Select>
            <Input label="Waktu (menit)" type="number" size="lg" onChange={(e) => setDurasi(e.target.value)} />
            <Input label="Min waktu (menit)" type="number" size="lg" onChange={(e) => setMinDurasi(e.target.value)} />
            <Input label="Kelas" list="datalistKelas" placeholder=" " type="text" size="lg" onChange={(e) => setKelas(e.target.value)}/>
            <datalist id="datalistKelas">
                {
                    akelas.map((e,k) => (
                        <option value={e.name} key={k}></option>
                    ))
                }
            </datalist>
            <span className="text-sm text-red-600">
            Gunakan tanda koma (,) untuk kelas lebih dari 1. contoh : 7A, 8B, 7H
            </span>
          </CardBody>
          <CardFooter className="pt-0">
            <Button variant="gradient" onClick={handleSave} fullWidth>
              {
                load ? "Prossessing ..." : "Buat soal"
              }
            </Button>
          </CardFooter>
        </Card>
      </Dialog>

      <Drawer open={openXLS} onClose={handleOpenXLS} className="p-4">
        <div className="mb-6 flex items-center justify-between">
          <Typography variant="h5" color="blue-gray">
            Material Tailwind
          </Typography>
          <IconButton variant="text" color="blue-gray" onClick={handleOpenXLS}>
            <XMarkIcon strokeWidth={2} className="h-5 w-5" />
          </IconButton>
        </div>
        <Typography color="gray" className="mb-8 pr-4 font-normal">
          Material Tailwind features multiple React and HTML components, all
          written with Tailwind CSS classes and Material Design guidelines.
        </Typography>
        <div className="flex gap-2">
          <Button size="sm">Get Started</Button>
          <Button size="sm" variant="outlined">
            Documentation
          </Button>
        </div>
      </Drawer>
      
    </React.Fragment>
  );
}