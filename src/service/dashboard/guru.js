import { pathCountGuru, pathDeleteGuru, pathGetGuruAll, pathGetGuruWithId, pathInsertGuru, pathUpdateGuru } from "../path"

export function getGuru() {
    return new Promise((resolve, reject) => {
        try {
            fetch(pathGetGuruAll).then(r => r.json()).then(e => {
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
            fetch(pathGetGuruWithId(id)).then(r => r.json()).then(e => {
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
            fetch(pathInsertGuru, {
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
            fetch(pathUpdateGuru, {
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
            fetch(pathDeleteGuru(id), {
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
            fetch(pathCountGuru).then(r => r.json()).then(e => {
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

