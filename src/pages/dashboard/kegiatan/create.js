import { Input, Typography } from "@material-tailwind/react";
import Compressor from "compressorjs";
import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"

export function CreateNewKegiatanDashboard() {
    const [html, setHtml] = useState("")
    const quillRef = useRef(null)
    const modules = {
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline','strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
          ['link', 'image', 'formula'],
          ['clean']
        ],
      }
    
    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
      ]

      useEffect(() => {
        // @ts-ignore
        quillRef.current
          .getEditor()
          .getModule('toolbar')
          .addHandler('image', () => {
            const input = document.createElement('input')
            input.setAttribute('type', 'file')
            input.setAttribute('accept', 'image/*')
            input.click()
            input.onchange = async () => {
              if (!input.files || !input?.files?.length || !input?.files?.[0])
                return
              // @ts-ignore
              const editor = quillRef?.current?.getEditor()
              const file = input.files[0]
    
               // Do what you want with the file 
                new Compressor(file, {
                    quality : 0.8,
                    success : (result) => {
                        const form = new FormData()
                        form.append("image", result)
                        fetch("https://api.imgbb.com/1/upload?key=e2177987d26511915526be8e5c693734", {
                            method : "POST",
                            body : form
                        }).then(r => r.json()).then(r => {
                            if(!r.success) return;

                            const range = editor.getSelection(true)
                            editor.insertEmbed(
                              range.index,
                              'image',
                              r.data.url
                            )

                        })
                    }
                })
    
            }
        })
    }, [quillRef])

    return(
        <>
            <Typography variant="h3">Buat Kegiatan Anda</Typography>
            <div className="grid grid-cols-3 gap-2">
                <div className="mt-8 col-span-2">
                    <Input variant="static" label="Judul" placeholder="Judul Kegiatan anda" />
                    
                    <div className="mt-8">
                        <ReactQuill ref={quillRef} theme="snow" value={html} onChange={setHtml} modules={modules} formats={formats} placeholder="Ketikkan Sesuatu..." className="min-h-[500px]"/>
                    </div>
                </div>

                <div>
                    <div class="flex items-center justify-center w-full">
                        <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                            <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg aria-hidden="true" class="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                            </div>
                            <input id="dropzone-file" type="file" class="hidden" />
                        </label>
                    </div> 
                </div>
            </div>
        </>
    )
}