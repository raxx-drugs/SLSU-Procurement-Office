import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { pdfjs } from 'react-pdf';
import DisplayFile from './DisplayFile';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString();

export default function GetFile({showPDF}) {
    const [files, setFiles] = useState(null)
   

    useEffect(() => {
        getFiles()
    }, [])
    
    const getFiles = async () => {
        const result = await axios.get('/api/ppmp')
        setFiles(result.data.data)
        console.log(result.data.data)
       
    }
  return (
    <div>
        {showPDF && <DisplayFile showPDF={showPDF} />}
    </div>
  )
}
