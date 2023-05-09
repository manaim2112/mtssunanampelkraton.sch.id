import { BASE_URL } from "../constant"

export function getResultWithUserId(id) {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/cbt/result/user/"+ id).then(r => r.json()).then(r => {
            if(r.status === 200) {
                resolve(r.data)
            } else {
                resolve([])
            }
        })
    })
}
export function getResultWIthid(id) {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/cbt/result/id/"+ id).then(r => r.json()).then(e => {
            if(e.status === 200) {
                resolve(e.data)
            } else {
                resolve([])
            }
        })
    })
}

export function startingCBT({idlist, iduser}) {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/cbt/result/create", {
            method : "POST",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({
                idlist, iduser, process : "start", score : 0, answer : "[]"
            })
        }).then(r => r.json()).then(e => {
            resolve(e.status === 201)
        })
    })
}

export function finishingCBT({iduser, idlist, answer}) {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/cbt/result/update", {
            method : "PUT",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({idlist, iduser, answer})
        }).then(r => r.json()).then(e => {
            resolve(e.status === 201)
        })
    })
}

export function checkingResult({iduser, idlist}) {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/cbt/result/list/"+ idlist + "/user/"+ iduser).then(r => r.json()).then(r => {
            if(r.status === 200) {
                resolve(r.data)
            } else {
                resolve({})
            }
        })
    })
}