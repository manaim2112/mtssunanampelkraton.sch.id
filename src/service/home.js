export function getHomeDataService() {
    return new Promise((resolve, reject) => {
        resolve({
            title : "Sekolah Berbasis Pondok Pesantren",
            subtitle : "Fokus, integritas, level up Anak anda dengan karakter berakhlakul karimah, IPTEK maupun IMTAK",
            ceo : {
                name : "RIF'AN NADHIFI, S.Si",
                image : "https://i.ibb.co/MMnXQqT/Whats-App-Image-2023-05-09-at-11-38-41.jpg",
                motto : "Dengan memiliki ilmu kita dapat menggenggam dunia, dan mengejar mimpi besar yang kita punya. Sehingga akan menjadi orang yang berguna bagi masyarakat dan bangsa",
            }
        })
    })
}


export function getHeaderDataService() {
    return new Promise((resolve, reject) => {
        resolve({
            logo : "https://idn-static-assets.s3-ap-southeast-1.amazonaws.com/school/199585.png",
            logoname : "MadrasahSupel",
            phone : "+6285748365034"
        })
    })
}