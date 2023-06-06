import { pathCheckingResult, pathFinishCBT, pathGetCBTResultWithListId, pathGetResultWithId, pathGetResultWithUserId, pathGetResultWithUserIdAndListId, pathStartCBT } from "../path_rebuild"

export function getResultWithUserId(id) {
    return new Promise((resolve, reject) => {
        fetch(pathGetResultWithUserId).then(r => r.json()).then(r => {
            if(r.status === 200) {
                resolve(r.data)
            } else {
                resolve([])
            }
        })
    })
}
export function getResultWithUserIdAndListId(id, listid) {
    return new Promise((resolve, reject) => {
        fetch(pathGetResultWithUserIdAndListId).then(r => r.json()).then(r => {
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
        fetch(pathGetResultWithId).then(r => r.json()).then(e => {
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
        fetch(pathStartCBT, {
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
        fetch(pathFinishCBT, {
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
        
        fetch(pathCheckingResult(iduser, idlist)).then(r => r.json()).then(r => {
            if(r.status === 200) {
                resolve(r.data)
            } else {
                resolve({})
            }
        })
    })
}

export function getCBTResultWIthListId(id) {
    return new Promise((resolve, reject) => {
        fetch(pathGetCBTResultWithListId).then(r => r.json()).then(r => {
            if(r.status === 200) {
                resolve(r.data)
            } else {
                resolve([])
            }
        })
    })
}