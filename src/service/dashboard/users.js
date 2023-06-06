/**
 * GET USER
 * @returns Array({
 * 
 *      id : integer,
 *      pegid : number,
 *      photo : string,
 *      name : string,
 *      jabatan : string,
 *      start : time
 * 
 * })
 */

import { pathCountUsers, pathGetUserWithId, pathGetUserWithKelas, pathInsertManyUsers, pathInsertUser } from "../path"

export function CountUser() {
    return new Promise((resolve, reject) => {
        try {
            fetch(pathCountUsers).then(r => r.json()).then(e => {
                if(e.status === 200) {
                    resolve(e.count)
                } else {resolve(0)}
            })
        } catch(err) {
            resolve(0)
        }
    })
}


export function getUserWithId(id) {
    return new Promise((resolve, reject) => {
        try {
            fetch(pathGetUserWithId(id)).then(r => r.json()).then(r => {
                if(r.status === 200) {
                    resolve(r.data)
                }
            })
        } catch (error) {
            resolve([])
        }
    })
}

export function getStudent(kelas) {
    return new Promise((resolve, reject) => {
        try {
            fetch(pathGetUserWithKelas(kelas)).then(r => r.json()).then(e => {
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

export function insertUser({nisn, name, kelas, sandi}) {
    return new Promise((resolve, reject) => {
        try {
            fetch(pathInsertUser, {
                method : "POST",
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify({nisn, name, kelas, sandi})
            }).then(r => r.json()).then(r => {
                resolve(r.status === 201)
            })
        } catch (error) {
            resolve(false)
        }
    })
}

export function insertManyUser(data) {
    return new Promise((resolve, reject) => {
        try {
            fetch(pathInsertManyUsers, {
                method : "POST",
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify(data)
            }).then(r => r.json()).then(r => {
                if(r.status === 201) {
                    resolve(r.message)
                } else {
                    resolve("Gagal Mengupload")
                }
            })
        } catch (error) {
            resolve("Gagal mengupload")
        }
    })
}