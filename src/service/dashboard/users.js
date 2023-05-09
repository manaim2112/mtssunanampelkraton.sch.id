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

import { BASE_URL } from "../constant"

export function CountUser() {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/user/count").then(r => r.json()).then(e => {
            if(e.status === 200) {
                resolve(e.count)
            } else {resolve(0)}
        })
    })
}

export function getUser() {
    return new Promise((resolve, reject) => {
        try {
            setTimeout(() => {
                resolve([
                    {
                        id : 1,
                        pegid : 212244,
                        photo : null,
                        name : "Naim Muhammad",
                        jabatan : "Guru | Wali kelas 8",
                        start : "this is time first",
                    },
                    {
                        id : 1,
                        pegid : 212244,
                        photo : null,
                        name : "Naim Muhammad",
                        jabatan : "Guru | Wali kelas 8",
                        start : "this is time first",
                    },
                    {
                        id : 1,
                        pegid : 212244,
                        photo : null,
                        name : "Naim Muhammad",
                        jabatan : "Guru | Wali kelas 8",
                        start : "this is time first",
                    },
                    {
                        id : 1,
                        pegid : 212244,
                        photo : null,
                        name : "Naim Muhammad",
                        jabatan : "Guru | Wali kelas 8",
                        start : "this is time first",
                    },
                ])
            }, 3000)
        } catch (error) {
            
        }
    })
}

export function getStudent(kelas) {
    console.log(kelas)
    return new Promise((resolve, reject) => {
        try {
            fetch(BASE_URL + "/user/kelas/"+ kelas).then(r => r.json()).then(e => {
                console.log(e)
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

export function insertManyUser(data) {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/user/createmany", {
            method : "POST",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify(data)
        }).then(r => r.json()).then(r => {
            console.log(r)
            if(r.status === 201) {
                resolve(r.message)
            } else {
                resolve("Gagal Mengupload")
            }
        })
    })
}