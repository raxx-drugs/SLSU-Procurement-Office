
import { useState, useEffect, useRef } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import {  useLocation, useNavigate} from 'react-router-dom';
// Set the workerSrc
pdfjs.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@2.10.377/build/pdf.worker.min.js';


export default function DisplayFile({showPDF}) {
    const [numPages, setNumPages] = useState();
    const [pageNumber, setPageNumber] = useState(1);
    const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
    const containerRef = useRef(null); 
    const [fallbackURL, setFallbackURL] = useState(false); // Track if fallback URL is being used

    
    function onDocumentLoadSuccess({ numPages })  {
      setNumPages(numPages);
    }
    // Handle load error to switch to next URL
    function onDocumentLoadError(error) {
        if (!fallbackURL) {
            setFallbackURL(true); // Trigger fallback if the first URL fails
        }
    }
    // Set the container dimensions dynamically based on window size
    useEffect(() => {
        function updateDimensions() {
            if (containerRef.current) {
                setContainerDimensions({
                    width: containerRef.current.offsetWidth,  // Get container width
                    height: containerRef.current.offsetHeight,  // Get container height
                });
            }
        }
        
        window.addEventListener('resize', updateDimensions);
        updateDimensions(); // Set initial dimensions
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    let nextUrl = `https://slsu-procurement.onrender.com/uploads/${showPDF}`;
    return (

        <div className={`p-5 bg-gradient-to-b from-blue-50 to-white flex flex-col justify-center items-center`} ref={containerRef} style={{ width: '100%', height: 'auto' }}> 
        {!showPDF ? (
                <p>Loading PDF...</p>
            ) : (
            <>
                <p>
                    Page {pageNumber} of {numPages}
                </p>
                <Document 

                    file={fallbackURL ? nextUrl : showPDF} // Use fallback URL if necessary
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError} // Handle load error
                    >
                    {Array.apply(null, Array(numPages))
                        .map((x, i) => i+1)
                        .map((page) => {
                            return(
                            <Page 
                                key={page}
                                pageNumber={page} 
                                width={containerDimensions.width - 50}  // Set width dynamically
                                height={containerDimensions.height - 50}  // Set height dynamically
                                renderTextLayer={false} 
                                renderAnnotationLayer={false}/>
                        )
                    })}
                </Document>
                <p>
                    Page {pageNumber} of {numPages}
                </p>
            </>
            )}
        </div>
      );
}
