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
        <Button onClick={handleOpenXLS} color="green" className="flex gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-filetype-xlsx" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM7.86 14.841a1.13 1.13 0 0 0 .401.823c.13.108.29.192.479.252.19.061.411.091.665.091.338 0 .624-.053.858-.158.237-.105.416-.252.54-.44a1.17 1.17 0 0 0 .187-.656c0-.224-.045-.41-.135-.56a1.002 1.002 0 0 0-.375-.357 2.028 2.028 0 0 0-.565-.21l-.621-.144a.97.97 0 0 1-.405-.176.37.37 0 0 1-.143-.299c0-.156.061-.284.184-.384.125-.101.296-.152.513-.152.143 0 .266.023.37.068a.624.624 0 0 1 .245.181.56.56 0 0 1 .12.258h.75a1.093 1.093 0 0 0-.199-.566 1.21 1.21 0 0 0-.5-.41 1.813 1.813 0 0 0-.78-.152c-.293 0-.552.05-.777.15-.224.099-.4.24-.527.421-.127.182-.19.395-.19.639 0 .201.04.376.123.524.082.149.199.27.351.367.153.095.332.167.54.213l.618.144c.207.049.36.113.462.193a.387.387 0 0 1 .153.326.512.512 0 0 1-.085.29.558.558 0 0 1-.255.193c-.111.047-.25.07-.413.07-.117 0-.224-.013-.32-.04a.837.837 0 0 1-.249-.115.578.578 0 0 1-.255-.384h-.764Zm-3.726-2.909h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415H1.5l1.24-2.016-1.228-1.983h.931l.832 1.438h.036l.823-1.438Zm1.923 3.325h1.697v.674H5.266v-3.999h.791v3.325Zm7.636-3.325h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415h-.861l1.24-2.016-1.228-1.983h.931l.832 1.438h.036l.823-1.438Z"/>
            </svg>
            <div className="">Ambil Nilai</div>
        </Button>
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