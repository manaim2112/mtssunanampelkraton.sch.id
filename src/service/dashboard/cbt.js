import { BASE_URL } from "../constant"

export function getCBT() {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/cbt/list/all").then(res => res.json()).then(e => {
            if(e.status === 200) {
                resolve(e.data)
            } else {
                resolve([])
            }
        })
    })
}

export function CountCBT_list() {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/cbt/list/count").then(res => res.json()).then(e => {
            if(e.status === 200) {
                resolve(e.count)
            } else {
                resolve(0)
            }
        })
    })
}

export function changePriorityCBT_list(id, priority) {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/cbt/list/update_priority", {
            method :"PUT",
            headers : {"Content-type" : "application/json"},
            body : JSON.stringify({id, priority})
        }).then(data => data.json()).then(d => {
            resolve(d.status === 201)
        })
    })
}



export function insertCBT_list(data) {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/cbt/list/create", {
            method : "POST",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify(data)
        }).then(r=>r.json()).then(r => {
            if(r.status === 201) {
                resolve(true)
            } else {
                resolve(false)
            }
        })
    })
}

export function getWithIdCBT(id) {
    return new Promise((resolve, reject) => {
        
        try {
            fetch(BASE_URL + "/cbt/list/id/"+ id).then(r=>r.json()).then(e => {
                if(e.status === 200) {
                    resolve(e.data)
                } else {
                    resolve(false)
                }
            })

        } catch (error) {
            resolve(false)
        }
    })
}

export function updateCBT_list({id, name, jenis, durasi, min_durasi, tokelas}) {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/cbt/list/update", {
            method : "PUT",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({id, name, jenis, durasi, min_durasi, tokelas})
        }).then(r => r.json()).then(r => {
            resolve(r.status === 201)
        })
    })
}

export function getDataWithIdCBT(id) {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/cbt/soal?listid="+ id).then(r=>r.json()).then(e => {
            if(e.status === 200) {
                resolve(e.data)
            } else {
                resolve([])
            }
        })
    })
}

export function swithAcakCBT_list({id, acak}) {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/cbt/list/update_acak", {
            method : "PUT",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({id, acak})
        }).then(r => r.json()).then(e => {
            resolve(e.status === 201)
        })
    })
}
export function changeCodeCBT_list({id, code}) {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/cbt/list/update_code", {
            method : "PUT",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({id, code})
        }).then(e => {
            resolve(e.status === 201)
        })
    })
}

export function updateStartEndCBT({id, mulai, berakhir}) {
    console.log(id, mulai, berakhir)
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/cbt/list/update_start_end", {
            method : "PUT",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({id, mulai : `${mulai}`, berakhir : `${berakhir}`})
        }).then(r=>r.json()).then(e => {
            console.log("response", e)
            resolve(e.status === 201)
        })
    })
}

export function RemoveSoalWithListId(id) {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/cbt/soal/withlist/id/"+ id, {
            method : "DELETE",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({})
        }).then(r => r.json()).then(r => {
            resolve(r.status === 201)
        })
    })
}

export function removeListWIthId(id) {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/cbt/list/id/"+ id, {
            method : "DELETE",
        }).then(r => r.json()).then(r => {
            resolve(r.status === 201)
        })
    })
}
export function RemoveResultWIthListId(id) {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/cbt/result/withlist/id/"+ id, {
            method : "DELETE",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({})
        }).then(r => r.json()).then(r => {
            resolve(r.status === 201)
        })
    })
}

export function RemoveSoalWithId(id) {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/cbt/soal/id/"+ id, {
            method : "DELETE",
            headers : {"Content-Type": "application/json"},
            body : JSON.stringify({id})
        }).then(r => r.json()).then(r => {
            resolve(r.status === 201)
        })
    })
}

export function RemoveResultWithId(id) {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/cbt/result/id/"+ id, {
            method : "DELETE"
        }).then(r => r.json()).then(r => {
            resolve(r.status === 201)
        })
    })
}

export function UpdateResultAnswerWIthId({id, answer}) {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/cbt/result/update/withId", {
            method : "PUT",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({id, answer})
        }).then(r =>r.json()).then(r => {
            console.log(answer, r)
            resolve(r.status === 201)
        })
    })
}

export function htmlspecialchars(str) {
    let map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
  
    return str.replace(/[&<>"']/g, function(m) { return map[m]; });
}
export const removeScriptag = q => q.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  

export function saveWithUploadWordCBT(data, id) {
    
    const oi = [];
    data.forEach(e => {
        if(["pilgan", "isian_singkat", "isian_panjang", "menjodohkan"].includes(e.tipe) || Number(e.skor)) {
            oi.push({
                CBT_list_id : Number(id),
                question : removeScriptag(e.soal),
                tipe : e.tipe,
                options : JSON.stringify(e.jawaban),
                answer : JSON.stringify(e.kunci),
                score : String(e.skor)
            })
        }
    });
    return new Promise((resolve, reject) => {
        try {
            fetch(BASE_URL + "/cbt/soal/create_many", {
                method : "POST",
                headers : {"Content-Type": "application/json"},
                body : JSON.stringify(oi)
            }).then(r=>r.json()).then(r => {
                resolve(r.status === 201)
            }).catch(err => {
                resolve(false)
            })
        } catch (error) {
            resolve(false)
        }
    })
}