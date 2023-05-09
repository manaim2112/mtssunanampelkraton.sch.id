import { BASE_URL } from "./constant"

export function install(table) {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/install/table_"+ table, {
            method : "post",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({})
        }).then(r => r.json()).then(r => {
            resolve(r)
        }).catch(err => reject(err))
    })
}

export function insertNewUser() {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/install/insert_new_user", {
            method : "POST",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({})
        }).then(e => e.json()).then(r => {
            resolve(r.status === 201)
        })
    })
}