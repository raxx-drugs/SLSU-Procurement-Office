import { MapPinned,CircleArrowLeft, Search, Upload, MessageSquare, Edit, Clock, ThumbsUp, AlertTriangle, ChevronDown, MoreVertical, Filter, Trash2, Eye, Calendar, User, Download } from 'lucide-react';
import { Fragment, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useFetchPrById } from '../../hooks/pr/FetchPrMonitorById';
import { useState } from 'react';
import { useDecryptUserData } from '../../hooks/user/DecryptUserData';
import { useFetchTimeline } from '../../hooks/FetchTimeline';
import { useNavigate } from 'react-router-dom';

export default function Mapping({currentPrNoToMap, handleMapVIewClose}) {
    const contentRef = useRef();
    const { decryptedData, decryptedCurrentuser, decryptedIsUserAdmin } = useDecryptUserData();
    const [initialEvent, setInitialEvent] = useState();

    const prNo = currentPrNoToMap;
    const {prByPrNo , refetchTimeline} = useFetchTimeline(prNo);
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();
    console.log(prNo)

    // Fetch PR data when currentDetails changes
     useEffect(() => {
        if (prNo) {
            console.log(prNo)
            refetchTimeline({prNo});
        }
    }, [prNo, refetchTimeline, decryptedData]);

        // Transform prByPrNo data into events format
    useEffect(() => {
        if (prByPrNo && Array.isArray(prByPrNo)) {
        // Map the array of timeline data to the events array
        const transformedEvents = prByPrNo.map((item) => ({
            header: item.currentStep || "No Step", // Set currentStep as header
            subHeader: item.prNo || "N/A", // Set prNo as subHeader
            timeStamp: new Date(item.createdAt).toLocaleString(), // Format createdAt as a readable timestamp
            description: item.remarks || "No remarks available", // Set remarks as description
            status: item.status || "Unknown", // Set status
            direction: item.isAdmin === "true" ? "left" : "right", // Check if isAdmin is true for direction
        }));

        setEvents(transformedEvents); // Set the dynamically generated events array
        console.log(transformedEvents); // Check the transformed events array
        }
    }, [prByPrNo, decryptedIsUserAdmin]);
    
    const Circle = () => {
        return(
            <div className={`rounded-full size-5 bg-[#42a5f5] mx-auto `}>
    
            </div>
        )
    
    }
    const Pillar = () => {
        return(
            <div className={`rounded-t-full rounded-b-full w-5 h-full min-h-20 bg-[#42a5f5] mx-auto `}>
    
            </div>
        )
    }
    const EventCard = ({header, subHeader, timeStamp, description, status}) => {
        return(
            <div className={`bg-[#fff] flex flex-col gap-y-2 border shadow-md rounded-2xl p-4`}>
                <div className={` text-[#1565C0] font-bold text-lg border-b`}>{header} - {status}</div>
                <div className={` text-[#525f7f] font-semibold text-sm `}>Pr # : {subHeader} </div>
                <div className={` text-[#525f7f] font-semibold text-sm `}>Timestamp : {timeStamp}</div>
                <div className={` text-[#525f7f] font-semibold text-sm `}>Remarks : {description}</div>
            </div>
            
        )
    
    }
    
    const TimeLine = ({events}) => {
        return(
            <div className={`flex flex-col gap-y-4 w-full my-4`}>
                <Circle/>
                {events.map((event, key) => {
                    
                    return <Fragment key={key}>
                        <div className={`grid grid-cols-[1fr_auto_1fr] gap-x-2 items-center mx-auto `}>
                            {event.direction === 'left' ? (
                                <EventCard
                                    header={event.header}
                                    subHeader={event.subHeader}
                                    timeStamp={event.timeStamp}
                                    description={event.description}
                                    status={event.status}

                                    />
                            ): (<div className={` `}></div>)}
                            <Pillar/>
                            {event.direction === 'right' ? (
                                <EventCard
                                    header={event.header}
                                    subHeader={event.subHeader}
                                    timeStamp={event.timeStamp}
                                    description={event.description}
                                    status={event.status}

                                    />
                            ): (<div className={` `}></div>)}
    
                        </div>
                        {key <(events.length - 1) && <Circle/>}
                        
                    </Fragment>
                })}
                <Circle/>
            </div>
    
        )
    }
    const handleExportImage = () => {
        const content = contentRef.current;

        html2canvas(content).then((canvas) => {
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'timeline.png';
        link.click();
        });
    };
    // Function to export content as a PDF
    const handleExportPDF = () => {
        const content = contentRef.current;

        html2canvas(content).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4'); // 'p' for portrait, 'mm' for units, 'a4' size
            const imgWidth = 210; // A4 size in mm (width)
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // Adjust to fit A4 size
            if (imgHeight > 297) {
                const scaleFactor = 297 / imgHeight;
                const scaledImgHeight = imgHeight * scaleFactor;
                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, scaledImgHeight);
            } else {
                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            }
            pdf.save('timeline.pdf'); // The downloaded PDF will be saved as 'output.pdf'
        });
    };


  return (
    <div className={`w-full h-full p-2 bg-gradient-to-b from-blue-50 to-white flex justify-center`}>
        <div className="w-full shadow-2xl p-2">
            <div className="w-full h-full grid bg-white rounded-xl overflow-hidden shadow-sm">
                <div className={`w-full h-full flex flex-col`}>
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-wrap gap-4">
                        <div className={`flex items-center `}>
                            <div className={`flex items-center justify-center `}>
                                <i onClick={handleMapVIewClose} className="text-gray-600 hover:text-gray-700 cursor-pointer mr-5">
                                    <CircleArrowLeft />
                                </i>
                            </div>
                            <h3 className="text-lg font-semibold  flex items-center gap-2">
                                <MapPinned className="w-5 h-5 text-blue-600" />
                                File Mapping
                            </h3>
                        </div>
                        <div className={`flex items-center gap-5`}>
                            <button
                                onClick={handleExportImage}
                                className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Export as Image
                            </button>
                            <button
                                onClick={handleExportPDF}
                                className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Export as PDF
                            </button>

                        </div>
                        
                       
                    </div>

                    {/* Body */}
                    <div  ref={contentRef} className={`h-full w-full p-2  overflow-y-auto`}>
                        <TimeLine events={events}/>
                    </div>
                </div>
                    
            </div>
        </div>
    </div>
  )
}
