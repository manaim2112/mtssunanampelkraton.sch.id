import { BASE_URL } from "./constant"

export function LoginWithUser(nisn, pass) {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/authorize/login_user", {
            method :"POST",
            // credentials: "include",
            headers : {"Content-type" : "application/json"},
            body : JSON.stringify({nisn, pass})
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

export function LoginWithAdmin(pegId, pass) {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/authorize/login_guru", {
            method :"POST",
            // credentials: "include",
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