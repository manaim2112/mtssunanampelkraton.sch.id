import { pathGetUserWithKelas } from "../path"

export const getUserWithKelas = async (kelas) => {
    const response = await Promise.all(kelas.map(e => fetch(pathGetUserWithKelas(e))))
    const convertoJson = await Promise.all(response.map(t => t.json()))
    const data = convertoJson.map(d => {
        if(d.status === 200) {
            return d.data
        } 
        return []
    })

    return data
}