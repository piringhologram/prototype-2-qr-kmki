"use client"

import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { createClient } from '@supabase/supabase-js';
import { Coming_Soon } from "next/font/google";
import { data } from "autoprefixer";

const supabaseUrl = 'https://vtvwbvuazbfoqfozrttg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0dndidnVhemJmb3Fmb3pydHRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM5MTQ5MzAsImV4cCI6MjAwOTQ5MDkzMH0.6LinY1SwOPtxjPBTBDtbkjPDEDQqdu_coEnAMVR-qd8'; // Replace with your API key
const supabase = createClient(supabaseUrl, supabaseKey);

export default function QrScanner({params}) {
    
    const [scanResult, setScanResult] = useState(null);
    const [scannedUser, setScannedUser] =  useState(null);
    const [scanning, setScanning] = useState(true);
    const selectedEventId = params.id;

    useEffect(() => {
        const scanner = new Html5QrcodeScanner('reader', {
            fps: 25,
        });
        if (scanning){
            scanner.render(onSuccess, onError);
        }

        async function onSuccess(result) {
            if (scanning) {
                setScanResult(result);
                setScanning(false)

                try {
                    // Check if scanned QR Code contains valid UID
                    const {data : uid, error_id } = await supabase
                        .from('user_sensus')
                        .select('vorname, nachname')
                        .eq('uniqueID', result)
                        .single();
                    if (error_id || uid == null) {
                        setScannedUser("Error: User not found ! Is this a valid QR Code ?")
                        console.log ("invalid user !", error_id)
                    } else {
                        console.log ("valid user", uid)
                        
                        // Check if user already register / attends an event
                        const {data : record, error } = await supabase
                            .from('rsvp_attendance')
                            .select('id, registration, attendance')
                            .eq('user_id', result)
                            .eq('event_id', selectedEventId)
                        if (error) {
                            console.log ("Error occured when querying the database", error)
                        } else {
                            if (record.length === 0) {
                                console.log ("User doesn't exists in DB, adding user to DB")

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
                                setScannedUser(`Welcome, ${uid.vorname} ${uid.nachname}!`);
                            }
                            } else if (record.length === 1) {
                                const record_single = record[0]
                                // there is existing data in DB

                                // 1. Case : user has registered (for rsvp events), and wants to set the attendance to true.

                                // 2. Case QR has already scanned. (to avoid double scanning)
                                if (record_single.attendance) {
                                    console.log ("User has been scanned !")
                                    setScannedUser(`${uid.vorname} ${uid.nachname} has been scanned!`);
                                } else {
                                    // Set attendance to true, user has now attend the event.
                                    await supabase
                                        .from('rsvp_attendance')
                                        .update({ attendance: true })
                                        .eq('id', record_single.id);
                                    console.log("Attendance updated to true.");
                                    setScannedUser(`Welcome, ${uid.vorname} ${uid.nachname}!`);
                                }
                            } else {
                                //multiple records found
                                console.log("Error : Multiple data found")
                                setScannedUser("Error: Multiple data in DB")
                            }
                        }
                    }
                }
                catch (error) {
                    setScannedUser("Error: Invalid QR Code!")
                    console.log ("Failed to add user.", error)
                }
                finally {
                    setScanning(true)
                }
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

        function onError(err) {
            //console.warn(err);
            setScanning(true)
        }

        return () => {
            // Clean up the scanner when the component unmounts
            scanner.clear();
        };
    }, [selectedEventId]); // Include selectedEventId in the dependency array

    return (
        <div className="App">
            {scannedUser ? (
                <h2 className="mt-4 mb-4 text-center">
                    <a>{scannedUser}</a>
                </h2>
            ) : (
                <h1 className="text-center mb-4">Scanning QR Code...</h1>
            )}
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
