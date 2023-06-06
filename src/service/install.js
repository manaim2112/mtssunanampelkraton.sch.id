import { pathInsertNewUser, pathInstallTable } from "./path"
export function install(table) {
    return new Promise( (resolve, reject) => {
        try {
            fetch(pathInstallTable(table), {
                method : "post",
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify({})
            }).then(r => r.json()).then(r => {
                resolve(r)
            }).catch(err => reject(err))
        } catch (error) {
            resolve(false)
        }
    })
}

export function insertNewUser() {
    return new Promise((resolve, reject) => {
        try {
            fetch(pathInsertNewUser, {
                method : "POST",
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify({})
            }).then(e => e.json()).then(r => {
                resolve(r.status === 201)
            })
        } catch (error) {
            resolve(false)
        }
    })
}