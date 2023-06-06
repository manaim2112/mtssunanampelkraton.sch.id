import { pathCountKelas, pathDeletekelasWithId, pathGetKelasAll, pathInsertKelas } from "../path"

export function getKelasAll() {
    return new Promise((resolve, reject) => {
        try {
            fetch(pathGetKelasAll).then(r=>r.json()).then(e => {
                if(e.status === 200) {
                    resolve(e.data)
                } else {
                    resolve([])
                }
            })
        } catch (error) {
            resolve([])
        }
    })
}

export function countKelas() {
    return new Promise((resolve, reject) => {
        try {
            fetch(pathCountKelas).then(r=>r.json()).then(e => {
                if(e.status === 200) {
                    resolve(e.count)
                } else {
                    resolve(0)
                }
            })
        } catch (error) {
            resolve(0)
        }
    })
}

export function insertKelas(kelas) {
    return new Promise((resolve, reject) => {
        try {
            fetch(pathInsertKelas, {
                method : "POST",
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify({name:kelas, kode:kelas})
            }).then(r=>r.json()).then(e => {
                resolve(e.status === 201)
            })
        } catch (error) {
            resolve(false)
        }
    })
}

export function deleteKelas(id) {
    return new Promise((resolve, reject) => {
        try {
            fetch(pathDeletekelasWithId(id), {
                method : "DELETE",
                headers : {"Content-Type" :"application/json"},
                body : JSON.stringify({})
            }).then(r => r.json()).then(e => {
                resolve(e.status === 201)
            })
        } catch (error) {
            resolve(false)
        }
    })
}