import { pathGetSoalWithIdList } from "../path"

export function getSoalWithIdList(id) {
    return new Promise((resolve, reject) => {
        fetch(pathGetSoalWithIdList).then(r => r.json()).then(e => {
            if(e.status === 200) {
                resolve(e.data)
            } else {
                resolve([])
            }
        })
    })
}