import { BASE_URL } from "../constant"

export function listSoalWithKelas(kelas) {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/cbt/list/kelas/"+ kelas).then(r=>r.json()).then(r => {
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
        fetch(BASE_URL + "/cbt/list/code/id/"+ id).then(r => r.json()).then(r => {
            if(r.status === 200) {
                resolve(r.data)
            } else {
                resolve([])
            }
        })
    })
}