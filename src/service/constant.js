
export const BASE_URL = "https://cloud.mtssunanampelkraton.sch.id/api"

export const SetCookie = (name, value, minutes) => {
    let d = new Date()
    d.setTime(d.getTime() + (minutes*60*1000))
    const expires = "expires="+ d.toUTCString();
    document.cookie = name + "=" + value + "; " + expires;
}

export const getAuthorize = () => {
    try {
        const Auth = window.sessionStorage.getItem("refresh-admin")
        const parseJSON = JSON.parse(atob(Auth))
        return parseJSON
    } catch (error) {
        return {}
    }
}
export const getAuthorizeUser = () => {
    try {
        const Auth = window.sessionStorage.getItem("refresh-token")
        const parseJSON = JSON.parse(atob(Auth))
        return parseJSON
    } catch (error) {
        return false
    }
}

export const randomText = () => {
    try {
        const h = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz';
        const d = h.split("").sort((a,b) => Math.random() - .5).join("").slice(0, 3)
        return d

    } catch (error) {
        return "LSjs"
    }
}

export const JSONParse = (json) => {
    try {
        return JSON.parse(json)
    } catch (error) {
        return []
    }
}

export const dateParse = (t) => {
    if(t) {
        return Date.parse(new Date(t))
    }

    return Date.now()
}

export function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

export function uuidv4() {
    return window.URL.createObjectURL(new Blob([])).split('/').pop()
  }


export function getDataStartCBT({start}) {
    try {
        const user = getAuthorizeUser();
        const list = JSON.parse(atob(start).split("@")[0])

        const getSoal = JSON.parse(localStorage.getItem("refresh@"+ user.nisn + "@"+ list.id))
        const getData = JSON.parse(localStorage.getItem("data@"+ user.nisn + "@"+ list.id))
        const getTiming = atob(localStorage.getItem("timing@"+ user.nisn + "@"+ list.id))

        return {
            user,
            list,
            soal : getSoal,
            data : getData,
            timing : getTiming
        }
    } catch (error) {
        
        return false
    }


}