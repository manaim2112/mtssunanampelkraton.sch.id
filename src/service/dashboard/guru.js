import { BASE_URL } from "../constant"

export function getGuru() {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/guru/all").then(r => r.json()).then(e => {
            if(e.status === 200) {
                resolve(e.data)
            } else {
                resolve([])
            }
        })
    })
}

export function getGuruWithId(id) {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/guru/id/"+ id).then(r => r.json()).then(e => {
            if(e.status === 200) {
                resolve(e.data)
            } else {resolve({})}
        })
    })
}

export function insertGuru({pegId, name, pass}) {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/guru/create", {
            method :"POST",
            headers : {"Content-type" : "application/json"},
            body : JSON.stringify({pegId, name, pass})
        }).then(re => re.json()).then(e => {
            resolve(e.status === 201)
        })
    })
}

export function updateGuru({id, pegId, name, pass, walikelas, jabatan}) {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/guru/update", {
            method : "PUT",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({id, pegId, name, pass, walikelas, jabatan})
        }).then(r=>r.json()).then(e => {
            resolve(e.status === 201)
        })
    })
}

export function deleteGuru(id) {
    return new Promise((resolve, reject)=> {
        fetch(BASE_URL + "/guru/id/" + id, {
            method : "DELETE",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({id})
        }).then(r=> r.json()).then(e => {
            resolve(e.status === 201)
        })
    })
}

export function countGuru() {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/guru/count").then(r => r.json()).then(e => {
            if(e.status === 200) {
                resolve(e.count)
            } else {
                resolve(0)
            }
        })
    })
}

