import { BASE_URL } from "../constant"

export function getKelasAll() {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/kelas/all").then(r=>r.json()).then(e => {
            if(e.status === 200) {
                resolve(e.data)
            } else {
                resolve([])
            }
        })
    })
}

export function countKelas() {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/kelas/count").then(r=>r.json()).then(e => {
            if(e.status === 200) {
                resolve(e.count)
            } else {
                resolve(0)
            }
        })
    })
}

export function insertKelas(kelas) {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/kelas/create", {
            method : "POST",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({name:kelas, kode:kelas})
        }).then(r=>r.json()).then(e => {
            resolve(e.status === 201)
        })
    })
}

export function deleteKelas(id) {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL +"/kelas/id/"+id, {
            method : "DELETE",
            headers : {"Content-Type" :"application/json"},
            body : JSON.stringify({})
        }).then(r => r.json()).then(e => {
            resolve(e.status === 201)
        })
    })
}