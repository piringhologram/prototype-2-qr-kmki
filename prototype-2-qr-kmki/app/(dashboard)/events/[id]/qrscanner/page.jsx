"use client"

import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { createClient } from '@supabase/supabase-js'; // Import the Supabase client

const supabaseUrl = 'https://vtvwbvuazbfoqfozrttg.supabase.co'; // Replace with your Supabase project URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0dndidnVhemJmb3Fmb3pydHRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM5MTQ5MzAsImV4cCI6MjAwOTQ5MDkzMH0.6LinY1SwOPtxjPBTBDtbkjPDEDQqdu_coEnAMVR-qd8'; // Replace with your API key
const supabase = createClient(supabaseUrl, supabaseKey); // Create the Supabase client

export default function qrscanner({params}) {
    
    const [scanResult, setScanResult] = useState(null);
    const selectedEventId = params.id; // Replace with the logic to capture the selected event

    useEffect(() => {
        const scanner = new Html5QrcodeScanner('reader', {
            qrbox: {
                width: 1000,
                height: 1000,
            },
            fps: 25,
        });

        scanner.render(onSuccess, onError);

        function onSuccess(result) {
            setScanResult(result);
            

            // Add the scanned result to the Supabase database
            async function addToDatabase() {
                try {

                    //fetch the existing attendance list
                    let { data: ls, error } = await supabase
                    .from('events')
                    .select('attendees_list')
                    .eq('id', selectedEventId)
                    .single()
                                      
                    if(error) {
                        console.error('Error fetching event data:', error);
                        return
                    } else {
                        console.log('Successfully fetched data' , ls);
                    }

                    // Append the user (attendees) to the existing attendance list
                    ls.attendees_list = ls.attendees_list || []
                    
                    //Check if user already exists in the attendance list
                    if (!ls.attendees_list.includes(result)) {
                        ls.attendees_list.push(result)

                        // Update the attendees_list for the event
                        const { data: updatedEvent, updateError} = await supabase
                            .from('events')
                            .upsert([
                            {
                                id: selectedEventId,
                                attendees_list: ls.attendees_list  
                            }
                        ]);

                        if (updateError) {
                            console.error("Error adding to the database:", updateError);
                        } else {
                            console.log("Successfully added to the database:", updatedEvent);
                        }
                    } else {
                        console.log('User already exists in the list: ', result)
                    }
                } catch (error) {
                    console.error("Error:", error);
                }
            }
            addToDatabase();
        }

        function onError(err) {
            console.warn(err);
        }

        return () => {
            // Clean up the scanner when the component unmounts
            scanner.clear();
        };
    }, [selectedEventId]); // Include selectedEventId in the dependency array

    return (
        <div className="App">
            <h1 style={{ textAlign: "center" }}>Scanning QR Code...</h1>
            {scanResult ? (
                <div style={{ textAlign: "center" }}>
                    Success: <a href={"http://" + scanResult}>{scanResult}</a>
                </div>
            ) : (
                <div id="reader" style={{ width: "500px", height: "500px", margin: "0 auto" }}></div>
            )}
        </div>
    );
}
