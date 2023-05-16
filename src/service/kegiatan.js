import { BASE_URL } from "./constant"

/**
 * 
 * @param {name} name | JSON.stringify
 * @param {thumb}  
 * @returns 
 */
export function InsertKegiatan({name, thumb, content}) {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/kegiatan/create", {
            method : "POST",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({name, thumb, content})
        }).then(r=>r.json()).then(r => {
            resolve(r.status === 201)
        })
    })
}

export function UpdateKegiatanWithId({id, name, thumb, content}) {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/kegiatan/update", {
            method : "POST",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({id, name, thumb, content})
        }).then(r => r.json()).then(r => {
            resolve(r.status === 201)
        })
    })
}

export function DeleteKegiatanWithId(id) {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/kegiatan/id/"+ id, {
            method : "DELETE"
        }).then(r => r.json()).then(r => {
            resolve(r.status === 201)
        })
    })
}

export function getKegiatanTerbaru() {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/kegiatan/terbaru").then(r => r.json()).then(r => {
            if(r.status === 200) {
                resolve(r.data)
            }
        })
    })
}
export function getKegiatanWithPage(page) {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/kegiatan/page/"+ page).then(r => r.json()).then(r => {
            if(r.status === 200) {
                resolve(r.data)
            }
        })
    })
}
export function getKegiatanWithId(id) {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/kegiatan/id/"+ id).then(r => r.json()).then(r => {
            if(r.status === 200) {
                resolve(r.data)
            }
        })
    })
}
export function countKegiatan() {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/kegiatan/count").then(r => r.json()).then(r => {
            if(r.status === 200) {
                resolve(r.count)
            }
        })
    })
}

