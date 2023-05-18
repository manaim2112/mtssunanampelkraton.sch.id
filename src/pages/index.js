import { Typography } from "@material-tailwind/react";
import { NavbarElement } from "../elements/navbar";

import { Outlet } from "react-router-dom";


// export function IndexHome() {
//     return(
//         <>
        
//             <Link to="/berita" className="text-blue-400">Berita</Link>
//             <Link to="/berita/ksjfh-224" className="text-blue-400">Berita</Link>
//         </>
//     )
// }

export default function IndexHome() {

    return(
        <>
            <NavbarElement></NavbarElement>
            
            <Outlet/>

            <footer className="w-full bg-white p-8">
      <div className="flex flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 bg-white text-center md:justify-between">
        <img src="https://idn-static-assets.s3-ap-southeast-1.amazonaws.com/school/199585.png" alt="logo-ct" className="w-10" />
        <ul className="flex flex-wrap items-center gap-y-2 gap-x-8">
          <li>
            <Typography
              as="a"
              href="#"
              color="blue-gray"
              className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
            >
              Tentang Kita
            </Typography>
          </li>
          <li>
            <Typography
              as="a"
              href="#"
              color="blue-gray"
              className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
            >
              Keaslian Madrasah
            </Typography>
          </li>
          <li>
            <Typography
              as="a"
              href="#"
              color="blue-gray"
              className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
            >
              Contribute
            </Typography>
          </li>
          <li>
            <Typography
              as="a"
              href="#"
              color="blue-gray"
              className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
            >
              Hubungi Kami
            </Typography>
          </li>
        </ul>
      </div>
      <hr className="my-8 border-blue-gray-50" />
      <Typography color="blue-gray" className="text-center font-normal">
        &copy; 2023 YAMI Product
      </Typography>
    </footer>
            
        </>
    )
}