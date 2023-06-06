import { pathCheckingKode, pathListSoalWithKelas } from "../path"

export function listSoalWithKelas(kelas) {
    return new Promise((resolve, reject) => {
        fetch(pathListSoalWithKelas(kelas)).then(r=>r.json()).then(r => {
            if(r.status === 200) {
                resolve(r.data)
            } else {
                resolve([])
            }
        })
    })
}

export function checkingCodeWithIdList(id) {
    return new Promise((resolve, reject) => {
        fetch(pathCheckingKode).then(r => r.json()).then(r => {
            if(r.status === 200) {
                resolve(r.data)
            } else {
                resolve([])
            }
        })
    })
}