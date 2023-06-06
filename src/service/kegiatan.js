import { pathCountKegiatan, pathDeleteKegiatan, pathGetKegiatanNews, pathGetKegiatanWithId, pathGetKegiatanWithPage, pathInsertKegiatan, pathUpdateKegiatanWithId } from "./path"

/**
 * 
 * @param {name} name | JSON.stringify
 * @param {thumb}  
 * @returns 
 */
export function InsertKegiatan({name, thumb, content}) {
    return new Promise((resolve, reject) => {
        try {
            fetch(pathInsertKegiatan, {
                method : "POST",
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify({name, thumb, content})
            }).then(r=>r.json()).then(r => {
                resolve(r.status === 201)
            })
        } catch (error) {
            resolve(false)
        }
    })
}

export function UpdateKegiatanWithId({id, name, thumb, content}) {
    return new Promise((resolve, reject) => {
        try {
            fetch(pathUpdateKegiatanWithId, {
                method : "POST",
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify({id, name, thumb, content})
            }).then(r => r.json()).then(r => {
                resolve(r.status === 201)
            })
        } catch (error) {
            resolve(false)
        }
    })
}

export function DeleteKegiatanWithId(id) {
    return new Promise((resolve, reject) => {
        try {
            fetch(pathDeleteKegiatan(id), {
                method : "DELETE"
            }).then(r => r.json()).then(r => {
                resolve(r.status === 201)
            })
        } catch (error) {
            resolve(false)
        }
    })
}

export function getKegiatanTerbaru() {
    return new Promise((resolve, reject) => {
        try {
            fetch(pathGetKegiatanNews).then(r => r.json()).then(r => {
                if(r.status === 200) {
                    resolve(r.data)
                }
            })
        } catch (error) {
            resolve([])
        }
    })
}
export function getKegiatanWithPage(page) {
    return new Promise((resolve, reject) => {
        try {
            fetch(pathGetKegiatanWithPage(page)).then(r => r.json()).then(r => {
                if(r.status === 200) {
                    resolve(r.data)
                }
            })
        } catch (error) {
            resolve([])
        }
    })
}
export function getKegiatanWithId(id) {
    return new Promise((resolve, reject) => {
        try {
            fetch(pathGetKegiatanWithId(id)).then(r => r.json()).then(r => {
                if(r.status === 200) {
                    resolve(r.data)
                }
            })
        } catch (error) {
            resolve({})
        }
    })
}
export function countKegiatan() {
    return new Promise((resolve, reject) => {
        try {
            fetch(pathCountKegiatan).then(r => r.json()).then(r => {
                if(r.status === 200) {
                    resolve(r.count)
                }
            })
        } catch (error) {
            resolve(0)
        }
    })
}

