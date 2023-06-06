import { pathCheckingKode, pathListSoalWithKelas } from "../path"

export function listSoalWithKelas(kelas) {
    return new Promise((resolve, reject) => {
        try {
            fetch(pathListSoalWithKelas(kelas)).then(r=>r.json()).then(r => {
                if(r.status === 200) {
                    resolve(r.data)
                } else {
                    resolve([])
                }
            })
        } catch (error) {
            resolve([])
        }
    })
}

export function checkingCodeWithIdList(id) {
    return new Promise((resolve, reject) => {
        try {
            fetch(pathCheckingKode(id)).then(r => r.json()).then(r => {
                if(r.status === 200) {
                    resolve(r.data)
                } else {
                    resolve([])
                }
            })
        } catch (error) {
            resolve([])
        }
    })
}