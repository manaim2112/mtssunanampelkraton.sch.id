export function getHomeDataService() {
    return new Promise((resolve, reject) => {
        resolve({
            title : "Sekolah Berbasis Pondok Pesantren",
            subtitle : "Fokus, integritas, level up Anak anda dengan karakter berakhlakul karimah, IPTEK maupun IMTAK",
            ceo : {
                name : "RIF'AN NADHIFI, S.Si",
                image : "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/michael-gouch.png",
                motto : "Kami Terus memberikan pelayanan terbaik untuk semua level keanggotaan pada sekolah, loyalitas dan integritas beserta level up peserta didik dengan berkarakter yang baik adalah motto kita",
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