import { BASE_URL } from "../../constant"

export default function uploadPhotoSoal(form, name) {
    return new Promise((resolve, reject) => {
        fetch(BASE_URL + "/cbt/soal/upload_foto", {
            method : "POST",
            body : form
        }).then(res => res.json()).then(res => {
            if(res.status === 201) {
                return {
                    src : BASE_URL + "/cbt/soal/image/"+ name + ".png"
                }
            }
        })
    })
}