import { pathAutorizeGuru, pathAutorizeUser } from "./path_rebuild"

export function LoginWithUser(nisn, pass) {
    return new Promise((resolve, reject) => {
        fetch(pathAutorizeUser, {
            method :"POST",
            headers : {"Content-type" : "application/json"},
            body : JSON.stringify({nisn, pass})
        }).then(res => res.json()).then(e => {
            if(e.status === 201) {
                resolve(e.session)
            } else {
                resolve(null)
            }
        })
    })
}

export function LoginWithAdmin(pegId, pass) {
    return new Promise((resolve, reject) => {
        fetch(pathAutorizeGuru, {
            method :"POST",
            headers : {"Content-type" : "application/json"},
            body : JSON.stringify({pegId, pass})
        }).then(res => res.json()).then(e => {
            console.log(e)
            if(e.status === 201) {
                resolve(e.session)
            } else {
                resolve(null)
            }
        })
    })
}