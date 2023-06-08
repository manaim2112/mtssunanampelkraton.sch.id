import { pathCBTListAll, pathChangeCodeCBTList, pathChangePriorityCBTList, pathCountCBTList, pathCreateManySoal, pathGetCBTListWithId, pathGetSoalWithIdList, pathInsertCBTList, pathRemoveListId, pathRemoveResultWithId, pathRemoveResultWithListID, pathRemoveSoalWithId, pathRemoveSoalWithListId, pathSwitchAcakCBTList, pathUpdateCBTList, pathUpdateResultAnswerWithId, pathUpdateStartAndEndCBTList } from "../path"

export function getCBT() {
    return new Promise((resolve, reject) => {
        try {
            fetch(pathCBTListAll).then(res => res.json()).then(e => {
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

export function CountCBT_list() {
    return new Promise((resolve, reject) => {
        try {
            fetch(pathCountCBTList).then(res => res.json()).then(e => {
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

export function changePriorityCBT_list(id, priority) {
    return new Promise((resolve, reject) => {
        try {
            fetch(pathChangePriorityCBTList, {
                method :"PUT",
                headers : {"Content-type" : "application/json"},
                body : JSON.stringify({id, priority})
            }).then(data => data.json()).then(d => {
                resolve(d.status === 201)
            })
        } catch (error) {
            resolve(false)
        }
    })
}



export function insertCBT_list(data) {
    return new Promise((resolve, reject) => {
        try {
            fetch(pathInsertCBTList, {
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
        } catch (error) {
            resolve(false)
        }
    })
}

export function getWithIdCBT(id) {
    return new Promise((resolve, reject) => {
        
        try {
            fetch(pathGetCBTListWithId(id)).then(r=>r.json()).then(e => {
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
        try {
            fetch(pathUpdateCBTList, {
                method : "PUT",
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify({id, name, jenis, durasi, min_durasi, tokelas})
            }).then(r => r.json()).then(r => {
                resolve(r.status === 201)
            })
        } catch (error) {
            resolve(false)
        }
    })
}

export function getDataWithIdCBT(id) {
    return new Promise((resolve, reject) => {
        try {
            fetch(pathGetSoalWithIdList(id)).then(r=>r.json()).then(e => {
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

export function swithAcakCBT_list({id, acak}) {
    return new Promise((resolve, reject) => {
        try {
            fetch(pathSwitchAcakCBTList, {
                method : "PUT",
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify({id, acak})
            }).then(r => r.json()).then(e => {
                resolve(e.status === 201)
            })
        } catch (error) {
            resolve(false)
        }
    })
}
export function changeCodeCBT_list({id, code}) {
    return new Promise((resolve, reject) => {
        try {
            fetch(pathChangeCodeCBTList, {
                method : "PUT",
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify({id, code})
            }).then(e => {
                resolve(e.status === 201)
            })
        } catch (error) {
            resolve(false)
        }
    })
}

export function updateStartEndCBT({id, mulai, berakhir}) {
    return new Promise((resolve, reject) => {
        try {
            fetch(pathUpdateStartAndEndCBTList, {
                method : "PUT",
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify({id, mulai : `${mulai}`, berakhir : `${berakhir}`})
            }).then(r=>r.json()).then(e => {
                resolve(e.status === 201)
            })
        } catch (error) {
            resolve(false)
        }
    })
}

export function RemoveSoalWithListId(id) {
    return new Promise((resolve, reject) => {
        try {
            fetch(pathRemoveSoalWithListId(id), {
                method : "DELETE",
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify({})
            }).then(r => r.json()).then(r => {
                resolve(r.status === 201)
            })
        } catch (error) {
            resolve(false)
        }
    })
}

export function removeListWIthId(id) {
    return new Promise((resolve, reject) => {
        try {
            fetch(pathRemoveListId(id), {
                method : "DELETE",
            }).then(r => r.json()).then(r => {
                resolve(r.status === 201)
            })
        } catch (error) {
            resolve(false)
        }
    })
}
export function RemoveResultWIthListId(id) {
    return new Promise((resolve, reject) => {
        try {
            fetch(pathRemoveResultWithListID(id), {
                method : "DELETE",
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify({})
            }).then(r => r.json()).then(r => {
                resolve(r.status === 201)
            })
        } catch (error) {
            resolve(false)
        }
    })
}

export function RemoveSoalWithId(id) {
    return new Promise((resolve, reject) => {
        try {
            fetch(pathRemoveSoalWithId(id), {
                method : "DELETE",
                headers : {"Content-Type": "application/json"},
                body : JSON.stringify({id})
            }).then(r => r.json()).then(r => {
                resolve(r.status === 201)
            })
        } catch (error) {
            resolve(false)
        }
    })
}

export function RemoveResultWithId(id) {
    return new Promise((resolve, reject) => {
        try {
            fetch(pathRemoveResultWithId(id), {
                method : "DELETE"
            }).then(r => r.json()).then(r => {
                resolve(r.status === 201)
            })
        } catch (error) {
            resolve(false)
        }
    })
}

export function UpdateResultAnswerWIthId({id, answer}) {
    return new Promise((resolve, reject) => {
        try {
            fetch(pathUpdateResultAnswerWithId, {
                method : "PUT",
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify({id, answer})
            }).then(r =>r.json()).then(r => {
                resolve(r.status === 201)
            })
            
        } catch (error) {
            resolve(false)
        }
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
            fetch(pathCreateManySoal, {
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