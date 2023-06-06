import { Button, Card, Checkbox, Option, Select, Typography} from "@material-tailwind/react"
import { useEffect, useState } from "react"
import { PlayIcon, SignalIcon} from "@heroicons/react/24/outline"
import { JSONParse } from "../../../service/constant";
import { ExcelIcon } from "../../../icons/excelIcon";

export const render = async (kelas, c) => {
    const resource = c
    const expande = resource.filter(Obj => Obj[4] === kelas)
    const expande_again = [];
    expande.forEach(r => {
        if(expande_again.length < 1) {
            expande_again.push([r[0], r[2], r[3], r[4], r[6]])

        } else {
            const index = expande_again.findIndex(Ob => Ob[1] === r[2]);
            if(index === -1) {
                expande_again.push([r[0], r[2], r[3], r[4], r[6]])
            } else {
                expande_again[index].push(r[6])
            }
        }
    })
    
    return expande_again
}

export async function exportMe(listAll) {
    try {
      if (listAll.length < 1) return [];
  
      const { mapToRange } = await import("../../../service/constant");
      const { getDataWithIdCBT } = await import("../../../service/dashboard/cbt");
      const { getCBTResultWIthListId } = await import("../../../service/cbt/result");
      const { getUserWithKelas } = await import("../../../service/cbt/user");
  
      const resultNew = [];
      for (const e of listAll) {
        const result = await getCBTResultWIthListId(e.id);
        const soal = await getDataWithIdCBT(e.id);
        const ll = e.tokelas.split(",").map(e => e.trim());
        const nilai = [];
        const users = await getUserWithKelas(ll);
        const ni = [];
  
        for (const user of users) {
          const myscore = [];
          for (const element of user) {
            const index = result.findIndex(Obj => Obj.iduser === element.id);
            if (index === -1) {
              myscore.push(0);
              continue;
            }
            const ans = JSON.parse(result[index].answer);
            if (ans.length === 0) {
              myscore.push(0);
            } else {
              const scoreItem = [];
              for (const sss of soal) {
                const indexAns = ans.findIndex(OO => OO[0] === sss.id);
                if (indexAns === -1) {
                  scoreItem.push(0);
                  continue;
                }
                if (!ans[indexAns][1] || ans[indexAns][1].length === 0) {
                  scoreItem.push(0);
                  continue;
                }
                switch (sss.tipe) {
                  case "pilgan":
                    if (
                      JSON.stringify(ans[indexAns][1].sort((a, b) => a - b)) ===
                      JSON.stringify(JSON.parse(sss.answer).sort((a, b) => a - b))
                    ) {
                      scoreItem.push(sss.score);
                    } else {
                      scoreItem.push(0);
                    }
                    break;
                  case "isian_singkat":
                    if (ans[indexAns][1] === JSONParse(sss.answer)[0]) {
                      scoreItem.push(sss.score);
                    } else {
                      scoreItem.push(0);
                    }
                    break;
                  case "isian_panjang":
                    if (ans[indexAns][2]) {
                      scoreItem.push(sss.score);
                    } else {
                      scoreItem.push(0);
                    }
                    break;
                  default:
                    scoreItem.push(0);
                }
              }
              myscore.push(scoreItem.reduce((a, b) => Number(a) + Number(b)));
            }
          }
  
          const endScore = mapToRange(myscore, Number(e.mulai), Number(e.berakhir));
  
          const rows = user.map((u, k) => [
            k + 1,
            e.id,
            u.nisn,
            u.name,
            u.kelas,
            myscore[k],
            endScore[k]
          ]);
          ni.push(rows);
        }
  
        nilai.push(ni);
        resultNew.push(nilai);
      }
      const flatResultNew = resultNew.flat().flat().flat()
      return flatResultNew;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  

export default function ExportNilaiCBTDashboard() {
    const [cbt, setCbt] = useState([])
    const [jenis, setJenis] = useState([])
    const [selected, setSelected] = useState([])
    const [checked, setChecked] = useState([])
    const [listChecked, setListChecked] = useState([])
    const [value, setValue] = useState([])
    const [kelas, setKelas] = useState([])
    const [kelasActive, setKelasActive] = useState("")
    const [loadValue, setLoadValue] = useState(false)
    const [wait, setWait] = useState(false)
    const [resultAll, setResultAll] = useState([])
    const [creator, setCreator] = useState(false)
    useEffect(() => {
        import("../../../service/dashboard/cbt").then(({getCBT}) => {
            getCBT().then(d => {
                setCbt(d)
                const h = [];
                d.forEach(element => {
                    if(h.length < 1) return h.push(element.jenis)
                    if(!h.includes(element.jenis)) return h.push(element.jenis)
                });
                setJenis(h)
            })
        })

        import("../../../service/constant").then(a => {
            setCreator(a.getOperator())

        })
    }, [])
    const handleJenisChange = (e) => {
        const y = cbt.filter(Obj => Obj.jenis === e)
        setSelected(y)
        const u = y.map(i => false)
        setChecked(u)
    }
    const handleChecked = (e, k) => {
        const y = [...checked];
        y[k] = e.target.checked;
        setChecked(y)
        const p = [...listChecked]
        if(e.target.checked) {
            p.push(selected[k])
            
        } else {
            const i = p.findIndex(Obj => Obj.id === selected[k].id)
            p.splice(i, 1)
        }
        setListChecked(p)

    }
    const handleProcessValue = () => {
        setLoadValue(true);
        setWait(false)
        if(listChecked.length > 0) {
            const k = listChecked[0].tokelas.split(",").map(e => e.trim())
            if(k.length > 0) {
                setKelas(k)
                exportMe(listChecked).then(c => {
                    setResultAll(c)
                    render(k[0], c).then(r => {
                        setValue(r)
                        setLoadValue(false)
                        setWait(true)
                    })
                })
                setKelasActive(k[0])
            }
        }
    }
    const handleChangeKelas = (v) => {
        setLoadValue(true)
        setWait(false)
        render(v, resultAll).then(r => {
            setValue(r)
            setLoadValue(false)
            setWait(true)
        })
    }
    const handleExportToXLS = async () => {
        import("xlsx").then(async XLSX => {
            const workbook =  XLSX.utils.book_new()
    
            for (const k of kelas) {
                const a = await render(k, resultAll)
                const header = ["No.Absen", "NISN", "NAMA LENGKAP", "KELAS", ...listChecked.map(e => e.name)]
                const h = [header, ...a]
                const worksheet = XLSX.utils.aoa_to_sheet(h);
                XLSX.utils.book_append_sheet(workbook, worksheet, k)            
            }
            XLSX.writeFile(workbook, "_RekapNilaiAkhir_"+ Date.now() +".xlsx", { compression: true });
        })
    }

    if(!creator) return ("Tidak punya akses")

    return(
        <>
        <Typography variant="h3">Export Nilai Akhir</Typography>
        <div className="">Pilih Jenis soal terlebih dahulu, lalu klik soal mana saja yang mau di ambil nilainya</div>
            <div className="w-16 mt-5">
                <Select label="Pilih Jenis Soal" className="inline-block p-3" variant="static" onChange={handleJenisChange}>
                    {
                        jenis.map((r,k) => (
                            <Option value={r} key={k}>{r}</Option>
                        ))
                    }
                </Select>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
            {
                selected.map((e,k) => (
                    <Card key={k} className={`${checked[k] ? "bg-blue-300" : "" }`}>
                        <label htmlFor={"selecter-"+ (k+1)} className="text-sm px-3 py-2 flex items-center w-full cursor-pointer">
                            <Checkbox 
                                id={"selecter-"+ (k+1)} 
                                ripple={true} 
                                className="hover:before:opacity-0"
                                containerProps={{
                                className: "p-2"
                                }}
                                onChange={r => handleChecked(r, k)}
                            />
                            <Typography color="blue-gray" className={`font-bold text-xs ${checked[k] ? "text-white" : ""}`}>{e.name}</Typography>
                        </label>
                    </Card>
                ))
            }
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-8">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-3 py-3 w-1">
                                No
                            </th>
                            <th scope="col" className="px-6 py-3 w-8">
                                NISN
                            </th>
                            <th scope="col" className="px-6 py-3">
                                NAMA
                            </th>
                            <th scope="col" className="px-6 py-3 w-3">
                                {kelas.length > 0 ? (
                                    <Select label="Kelas" defaultValue={kelasActive} onChange={handleChangeKelas}>
                                        {
                                            kelas.map((e,k) => (
                                                <Option key={k} value={e}>
                                                    {e}
                                                </Option>
                                            ))

                                        }
                                    </Select>
                                ) : "Kelas"}
                            </th>
                            {
                                listChecked.map((e,k) => (
                                    <th key={k} scope="col" className="px-6 py-3">
                                        {e.name}
                                    </th>
                                ))
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            value.map((e,k) => (
                                <tr key={k} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    { typeof e === "object" ? e.map((sube, subk) => (
                                            <td key={subk} className="px-6 py-1">
                                                {sube}
                                            </td>
                                    )) : ""}
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            {
                listChecked.length > 0 ? (
                    <div className="fixed bottom-5 right-5">
                        <div className="flex gap-2">
                            {
                                wait ? (
                                    <Button onClick={handleExportToXLS} className="rounded-full" color="green" variant="gradient">
                                        <ExcelIcon className="w-4 h-4"/>
                                    </Button>
                                ) : ""
                            }
                            <Button onClick={handleProcessValue} className="rounded-full" color="blue" variant="gradient" disabled={loadValue}>
                                {
                                    loadValue ? <SignalIcon className="w-4 h-4 animate-spin"/> : <PlayIcon className="w-4 h-4"></PlayIcon>
                                }
                                
                            </Button>
                        </div>
                    </div>
                ) : ""
            }
        </>
    )
}