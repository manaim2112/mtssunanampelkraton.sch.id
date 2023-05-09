import { BASE_URL } from "../constant"

export function getSoalWithIdList(id) {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/cbt/soal?listid="+ id).then(r => r.json()).then(e => {
            if(e.status === 200) {
                resolve(e.data)
            } else {
                resolve([])
            }
        })
    })
}