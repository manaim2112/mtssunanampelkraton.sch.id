import { useEffect, useState } from "react";
import { BeritaElement } from "../elements/berita";
import useDocumentTitle from "../elements/useDocumentTitle";
import { getHomeDataService } from "../service/home";
import { Link } from "react-router-dom";

export default function IndexHomes() {
    const [data, setData] = useState([]);
    useDocumentTitle("Selamat datang di kanal resmi kami")
    useEffect(() => {
        getHomeDataService().then(d => {
            setData(d)
        })
    }, [])
    return(
        <>
            <section className="bg-white dark:bg-gray-900 bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern.svg')] dark:bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern-dark.svg')]">
                <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 z-10 relative">
                    <Link to="https://s.id/daftar_mtssupel2023" target="_blank" className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800">
                        <span className="text-xs bg-blue-600 rounded-full text-white px-4 py-1.5 mr-3">New</span> <span className="text-sm font-medium">Pendaftaran Peserta Didik baru segera dibuka</span> 
                        <svg aria-hidden="true" className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                    </Link>
                    <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">{data.title ? data.title : "Oh No,"}</h1>
                    <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-200">{data.subtitle ? data.subtitle : "Oh No,"}</p>
                    <form className="w-full max-w-md mx-auto">   
                        <label htmlFor="default-email" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Email sign-up</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                                </svg>
                            </div>
                            <input type="email" id="default-email" className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Terima Info Menarik dari kami" required/>
                            <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Feed</button>
                        </div>
                    </form>
                </div>
                <div className="bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900 w-full h-full absolute top-0 left-0 -z-10"></div>
            </section>

            <div className="p-5 text-left bg-white dark:bg-blue-900 rounded-lg shadow-md">            
                <figure className="max-w-screen-md mx-auto text-center">
                    <svg aria-hidden="true" className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-600" viewBox="0 0 24 27" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z" fill="currentColor"/></svg>
                    <blockquote>
                        <p className="text-2xl italic font-medium text-gray-900 dark:text-white">"{data.ceo ? data.ceo.motto : "Oh No,"}"</p>
                    </blockquote>
                    <figcaption className="flex items-center justify-center mt-6 space-x-3">
                        <img className="w-16 h-16 rounded-full border" src={data.ceo ? data.ceo.image : "Oh No,"} alt={data.ceo ? data.ceo.name : "Oh No,"}/>
                        <div className="flex items-center divide-x-2 divide-gray-500 dark:divide-gray-700">
                            <cite className="pr-3 font-medium text-gray-900 dark:text-white">{data.ceo ? data.ceo.name : "Oh No,"}</cite>
                            <cite className="pl-3 text-sm text-gray-500 dark:text-gray-400">Kepala MTs Sunan Ampel Kraton</cite>
                        </div>
                    </figcaption>
                </figure>
            </div>
            <div className="">
                <BeritaElement/>
                
            </div>
        </>
    )
}