"use client"

import { useDeferredValue, useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { createClient } from '@supabase/supabase-js';
import { Asap_Condensed } from "next/font/google";

const supabaseUrl = 'https://vtvwbvuazbfoqfozrttg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0dndidnVhemJmb3Fmb3pydHRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM5MTQ5MzAsImV4cCI6MjAwOTQ5MDkzMH0.6LinY1SwOPtxjPBTBDtbkjPDEDQqdu_coEnAMVR-qd8'; // Replace with your API key
const supabase = createClient(supabaseUrl, supabaseKey);

export default function QrScanner({params}) {
    
    const [scanResult, setScanResult] = useState(null);
    const [scannedUser, setScannedUser] =  useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [newQuery, setNewQuery] = useState(false)
    const selectedEventId = params.id;

    // Setting up the scanner, happens only once so that no repeated camera access request required
    useEffect(() => {
        const scanner = new Html5QrcodeScanner('reader', {
            fps: 25,
        });

        scanner.render(onSuccess, onError)

        return () => {
            // Clean up the scanner when the component unmounts
            scanner.clear();
        };
    }, [selectedEventId]);

    // Handle the UID submission process, behaviour changes whenever isLoading changes.
    // isLoading true : don't process the data
    // isLoading false : process the data
    useEffect(() => {     
        if (!isLoading && newQuery) {           
            async function handleData(data) {
                setIsLoading(true)
                //console.log(`isloading : ${isLoading}`)
                // Assuming data is a string you want to pass as a query parameter
                const apiUrl = `/api/events/${selectedEventId}/qrscanner?input=${encodeURIComponent(data)}`;
                
                try {
                    const res = await fetch(apiUrl, {
                        method: "GET",
                    });
        
                    if(res.status === 200){
                        const response = await res.json();
                        //setScannedUser(response)
                        console.log(response)

                        const apiUrl = `/api/events/${selectedEventId}/qrscanner?input=${encodeURIComponent(data)}&eventid=${selectedEventId}`;
                        const res2 = await fetch(apiUrl, {
                            method: "POST",
                        });
                        const response2 = await res2.json();

                        if(res2.status === 201 || res2.status === 202){
                            // erfolgreich
                            setScannedUser(response2)
                            console.log(response2)
                        } else{
                            // Error handling.
                            setScannedUser(response2)
                            console.log('Error:', response2)
                        }
                    } else {
                        // Error handling
                        setScannedUser(`Error: Data not found. Is this a valid QR Code?`)
                        //console.log('Error:', res.statusText)
                    }
                } catch (error) {
                    console.log('Error:', error);
                } finally {
                    //console.log(`di sblm finally: ${isLoading}`)
                    setIsLoading(false)
                    //scanner.resume
                }
                    
                
                //console.log(`isLoading setelah processing : ${isLoading}`)
                //setIsLoading(false);
            }
            handleData(scanResult)
        } else {
            console.log("Data is not processed.")
        }

        setNewQuery(false)

    }, [isLoading, selectedEventId, newQuery]); // Include selectedEventId in the dependency array

    function onSuccess(data) {
        // if isLoading = true, don't process data. just leave it.
        if (isLoading){
            console.log("data not processed, still loading.")
            return;
        }
        
        setScanResult(data)       
        setNewQuery(true)        
    }

    function onError(error){
        if (isLoading) {
            return;
        }
    }
    return (
        <div className="App">
            {scannedUser ? (
                <h2 className="mt-4 mb-4 text-center">
                    <a>{scannedUser}</a>
                </h2>
            ) : (
                <h1 className="text-center mb-4">Scanning QR Code...</h1>
            )}
            {/* {isLoading && <span>Loading...</span>}*/}
            {scanResult ? (
                <div id="reader" className="grow-0 card object-center text-center">
                    Data: <a>{scanResult}</a>
                </div>
            ) : (
                <div id="reader" className="grow-0 card object-center" ></div>
                //style={{ width: "600px", height: "500px", margin: "0 auto" }}
            )}
            
        </div>
    );
}
