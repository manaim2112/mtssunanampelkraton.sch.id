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

export const getOperator = () => {
    try {
        const a = getAuthorize();
        return a.jabatan === "operator"
    } catch (error) {
        return false
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

export const randomText = () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split("").sort((a,b) => Math.random() - .5).join("").slice(0, 3)

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

export const dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

export const uuidv4 = () => window.URL.createObjectURL(new Blob([])).split('/').pop();


export function getDataStartCBT({start}) {
    try {
        const user = getAuthorizeUser();
        const [nisn, idlist] = atob(start).split("@")


        const getSoal = JSON.parse(localStorage.getItem("refresh@"+ nisn + "@"+ idlist))
        const getData = JSON.parse(localStorage.getItem("data@"+ nisn + "@"+ idlist))
        const getTiming = new Date(localStorage.getItem("timing@"+ nisn + "@"+ idlist))
        const getList = JSON.parse(localStorage.getItem("list@"+ nisn + "@"+ idlist))
        return new Promise((resolve, reject) => {
            resolve({
                user,
                list : getList,
                soal : getSoal,
                data : getData,
                timing : getTiming
            })
        })
    } catch (error) {
        
        return false
    }


}

export function mapToRange(arr, min, max) {
    const minValue = Math.min(...arr);
    const maxValue = Math.max(...arr);
  
    const mappedArray = arr.map((value) => {
      if (value < minValue) {
        return min;
      } else if (value > maxValue) {
        return max;
      } else {
        const percentage = (value - minValue) / (maxValue - minValue);
        return Math.ceil(min + percentage * (max - min));
      }
    });
  
    return mappedArray;
}