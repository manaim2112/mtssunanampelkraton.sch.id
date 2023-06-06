import { Card, CardBody, CardHeader, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function HomeDashboard() {
    const [name, setName] = useState("")
    const [countUser, setCountUser] = useState("")
    const [countCBT, setCountCBT] = useState("")
    const [countPegawai, setCountPegawai] = useState("")
    const [countKegiata, setCountkegiatan] = useState("")
    useEffect(() => {
            import("../../service/constant").then(({getAuthorize}) => {
                setName(getAuthorize().name)
            })
            import("../../service/dashboard/users").then(({CountUser}) => {
                CountUser().then(e => {
                    setCountUser(e)
                })
            })
            import("../../service/dashboard/cbt").then(({CountCBT_list}) => {
                CountCBT_list().then(e => {
                    setCountCBT(e)
                })
            })
            import("../../service/dashboard/guru").then(({countGuru}) => {

                countGuru().then(e => {
                    setCountPegawai(e)
                })
            })

            import("../../service/kegiatan").then(({countKegiatan}) => {
                countKegiatan().then(e => {
                    setCountkegiatan(e)
                })
            })

    }, [])
    return(
        <>
            <Typography variant="h2"> Selamat datang, {name} </Typography>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-3">
                <Card>
                    <CardHeader
                        variant="gradient"
                        color="blue"
                        className="mb-4 mt-10 grid h-28 place-items-center"
                    >
                        <Typography variant="h1" color="white">
                        {countKegiata}
                        </Typography>
                    </CardHeader>
                    <CardBody className="text-center">
                        <Link to="/dashboard/kegiatan">Kegiatan Sekolah</Link>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader
                        variant="gradient"
                        color="lime"
                        className="mb-4 mt-10 grid h-28 place-items-center"
                    >
                        <Typography variant="h1" color="white">
                        {countCBT}
                        </Typography>
                    </CardHeader>
                    <CardBody className="text-center">
                        <Link to="/dashboard/cbt">Computer Based Test</Link>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader
                        variant="gradient"
                        color="red"
                        className="mb-4 mt-10 grid h-28 place-items-center"
                    >
                        <Typography variant="h1" color="white">
                        {countUser}
                        </Typography>
                    </CardHeader>
                    <CardBody className="text-center">
                        <Link to="/dashboard/users">Peserta didik</Link>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader
                        variant="gradient"
                        color="yellow"
                        className="mb-4 mt-10 grid h-28 place-items-center"
                    >
                        <Typography variant="h1" color="white">
                        {countPegawai}
                        </Typography>
                    </CardHeader>
                    <CardBody className="text-center">
                        <Link to="/dashboard/guru">Pegawai</Link>
                    </CardBody>
                </Card>
            </div>
        </>
    )
}