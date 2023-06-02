import { BASE_URL } from "../constant"

export function getGuru() {
    return new Promise((resolve, reject) => {
        try {
            fetch(BASE_URL + "/guru/all").then(r => r.json()).then(e => {
                if(e.status === 200) {
                    resolve(e.data)
                } else {
                    resolve([])
                }
            })
        } catch(err) {
            resolve([])
        }
    })
}

export function getGuruWithId(id) {
    return new Promise((resolve, reject) => {
        try {
            fetch(BASE_URL + "/guru/id/"+ id).then(r => r.json()).then(e => {
                if(e.status === 200) {
                    resolve(e.data)
                } else {resolve({})}
            })

        } catch (error) {
            resolve({})            
        }
    })
}

export function insertGuru({pegId, name, pass}) {
    return new Promise((resolve, reject) => {
        try {
            fetch(BASE_URL + "/guru/create", {
                method :"POST",
                headers : {"Content-type" : "application/json"},
                body : JSON.stringify({pegId, name, pass})
            }).then(re => re.json()).then(e => {
                console.log(e)
                resolve(e.status === 201)
            })
        } catch (error) {
            resolve(false)
        }
    })
}

export function updateGuru({id, pegId, name, pass, walikelas, jabatan}) {
    return new Promise((resolve, reject) => {
        try {
            fetch(BASE_URL + "/guru/update", {
                method : "PUT",
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify({id, pegId, name, pass, walikelas, jabatan})
            }).then(r=>r.json()).then(e => {
                resolve(e.status === 201)
            })
        } catch (error) {
            resolve(false)
        }
    })
}

export function deleteGuru(id) {
    return new Promise((resolve, reject)=> {
        try {
            fetch(BASE_URL + "/guru/id/" + id, {
                method : "DELETE",
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify({id})
            }).then(r=> r.json()).then(e => {
                resolve(e.status === 201)
            })
        } catch (error) {
            resolve(false)
        }
    })
}

export function countGuru() {
    return new Promise((resolve, reject) => {
        try {
            fetch(BASE_URL + "/guru/count").then(r => r.json()).then(e => {
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

