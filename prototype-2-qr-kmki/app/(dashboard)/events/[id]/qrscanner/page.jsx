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
                    const { data, error } = await supabase
                        .from('attendance')
                        .insert([
                            {
                                user_id_tmp: result, // Assuming 'result' contains the user ID
                                event_id: selectedEventId, // Use the selected event ID
                                attendance_timestamp: new Date().toISOString(),
                            },
                        ]);

                    if (error) {
                        console.error("Error adding to the database:", error);
                    } else {
                        console.log("Successfully added to the database:", data);
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
