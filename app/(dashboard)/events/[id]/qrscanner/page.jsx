"use client"

import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { createClient } from '@supabase/supabase-js';
import { Coming_Soon } from "next/font/google";

const supabaseUrl = 'https://vtvwbvuazbfoqfozrttg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0dndidnVhemJmb3Fmb3pydHRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM5MTQ5MzAsImV4cCI6MjAwOTQ5MDkzMH0.6LinY1SwOPtxjPBTBDtbkjPDEDQqdu_coEnAMVR-qd8'; // Replace with your API key
const supabase = createClient(supabaseUrl, supabaseKey);

export default function qrscanner({params}) {
    
    const [scanResult, setScanResult] = useState(null);
    const selectedEventId = params.id;

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

        async function addToDatabase() {
            try {
                // Check if user already register / attends an event
                const {data : record, error } = await supabase
                    .from('rsvp_attendance')
                    .select('id, registration, attendance')
                    .eq('user_id', result)
                    .eq('event_id', selectedEventId)
                    .single();
                if (error) {
                    console.log ("User doesn't exists in DB, adding user to DB", error)
                }

                if (record) {
                    // there is existing data in DB

                    // 1. Case : user has registered (for rsvp events), and wants to set the attendance to true.

                    // 2. Case QR has already scanned. (to avoid double scanning)
                    if (record.attendance) {
                        console.log ("User has been scanned !")
                    } else {
                        // Set attendance to true, user has now attend the event.
                        await supabase
                            .from('rsvp_attendance')
                            .update({ attendance: true })
                            .eq('id', record.id);
                        console.log("Attendance updated to true.");
                    }
                } else {
                    // No existing data in DB (user hasn't register / no rsvp / the qr hasn't been scanned for this event)
                    const { data, error } = await supabase
                        .from('rsvp_attendance')
                        .insert([
                        {
                            user_id: result, // Assuming 'result' contains the user ID
                            event_id: selectedEventId, // Selected event ID
                            attendance_timestamp: new Date().toISOString(),
                            attendance: true, // attendance -> true
                        },
                         ]);
                    if (error) {
                        console.error("Error adding to the database:", error);
                    } else {
                        console.log('Successfully added to the database:', data)
                    }
                }
            }
            catch (error) {
                console.log ("Failed to add user.", error)
            }
        }

        // // Check whether user registered for the event
        // async function checkRegistration() {
        //     try {
        //         const { data: existingRecord, error } = await supabase
        //             .from('rsvp_attendance')
        //             .select('id, registration, attendance')
        //             .eq('user_id', result)
        //             .eq('event_id', selectedEventId)
        //             .single();

        //         if (error) {
        //             console.error("Error checking registration:", error);
        //             return;
        //         }

        //         if (existingRecord) {
        //             // If user registered, attendance -> true
        //             if (!existingRecord.attendance) {
        //                 await supabase
        //                     .from('rsvp_attendance')
        //                     .update({ attendance: true })
        //                     .eq('id', existingRecord.id);
        //                 console.log("Attendance updated to true.");
        //             } else {
        //                 console.log("User is already marked as attended.");
        //             }
        //         } else {
        //             // If user not registered, ask confirmation to add
        //             const addAnyway = window.confirm("You are trying to add a user that is not registered for this event. Add anyway?");
        //             if (addAnyway) {
        //                 await addToDatabase();
        //             } else {
        //                 console.log("User not added.");
        //             }
        //         }
        //     } catch (error) {
        //         console.error("Error:", error);
        //     }
        // }

        //     // Add scanned result to DB or handle registration
        //     async function addToDatabase() {
        //         try {
        //             const { data, error } = await supabase
        //                 .from('rsvp_attendance')
        //                 .insert([
        //                     {
        //                         user_id: result, // Assuming 'result' contains the user ID
        //                         event_id: selectedEventId, // Selected event ID
        //                         attendance_timestamp: new Date().toISOString(),
        //                         attendance: true, // attendance -> true
        //                         registration: false, //no registration -> false
        //                     },
        //                 ]);

        //             if (error) {
        //                 console.error("Error adding to the database:", error);
        //             } else {
        //                 console.log('Successfully added to the database:', data)
        //             }
        //         } catch (error) {
        //             console.error("Error:", error);
        //         }
        //     }

            //checkRegistration();
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
