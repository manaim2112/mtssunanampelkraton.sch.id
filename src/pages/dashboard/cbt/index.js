import React, { useEffect } from "react";
import { HrElement } from "../../../elements/hr";
import { JumbrotonElement } from "../../../elements/jumbroton";
import useDocumentTitle from "../../../elements/useDocumentTitle";
import { TableCBTElement } from "./table_cbt";
import { Button, Card, CardBody, CardFooter, CardHeader, Dialog, Input, Option, Select, Typography } from "@material-tailwind/react";
import { useState } from "react";
import { insertCBT_list } from "../../../service/dashboard/cbt";
import { randomText } from "../../../service/constant";
import { getKelasAll } from "../../../service/dashboard/kelas";

export function IndexCBTDashboard() {
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
    const [name, setName] = useState("")
    const [jenis, setJenis] = useState("")
    const [durasi, setDurasi] = useState("")
    const [minDurasi, setMinDurasi] = useState("")
    const [kelas, setKelas] = useState("")
    const [akelas, setAkelas] = useState([])
    const [load, setLoad] = useState(false)
    useEffect(() => {
        getKelasAll().then(e => {
            setAkelas(e)
        })
    }, [])
    const handleOpen = () => setOpen(!open)
    const handleSave = () => {
        setLoad(true)
        insertCBT_list({
            name, jenis, durasi, min_durasi : minDurasi, code : randomText(), tokelas : kelas
        }).then(e => {
            if(e) {
                setOpen(false)
                getKelasAll().then(u => {
                  setAkelas(u)
                })
            }
            setLoad(false)
        })
    }
  return (
    <React.Fragment>
        
      <Button onClick={handleOpen}>+ Tambah Soal</Button>
      <Dialog
        size="xs"
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
            <Input label="Waktu pengerjaan (menit)" type="number" size="lg" onChange={(e) => setDurasi(e.target.value)} />
            <Input label="Minimal waktu Pengerjakan (menit)" type="number" size="lg" onChange={(e) => setMinDurasi(e.target.value)} />
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
    </React.Fragment>
  );
}