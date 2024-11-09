import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const input = searchParams.get('input');

    const supabase = createRouteHandlerClient({ cookies });
    //console.log(input);

    try {
        // Check if scanned QR Code contains a valid UID
        const { data: uid, error } = await supabase
            .from('user_sensus_2024')
            .select('vorname, nachname')
            .eq('uniqueID', input)
            .single();

        if (error || uid == null) {
            return NextResponse.json(error, {
                status: 404
            })
        } else {
            return NextResponse.json(`Valid User: ${uid.vorname} ${uid.nachname}`, {
                status: 200
            })
        }
    } catch (error) {
        console.error("Error occurred:", error);
        return NextResponse.json(error, {
            status: 500
        })
    }
}



export async function POST(request){
    const { searchParams } = new URL(request.url);
    const input = searchParams.get('input');
    const eventid = searchParams.get('eventid')

    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: uid, error2 } = await supabase
    .from('user_sensus_2024')
    .select('vorname, nachname')
    .eq('uniqueID', input)
    .single();

    // Check if user already register / attends an event
    const {data : record, error } = await supabase
        .from('rsvp_attendance')
        .select('id, registration, attendance')
        .eq('user_id', input)
        .eq('event_id', eventid)
    if (error) {
        console.log ("Error occured when querying the database", error)
        return NextResponse.json(error, {
            status: 500
        })
    } else {
        if (record.length === 0) {
        console.log ("User doesn't exists in DB, adding user to DB")

        // No existing data in DB (user hasn't register / no rsvp / the qr hasn't been scanned for this event)
        const { data, error } = await supabase
        .from('rsvp_attendance')
        .insert([
        {
            user_id: input, // Assuming 'result' contains the user ID
            event_id: eventid, // Selected event ID
            attendance_timestamp: new Date().toISOString(),
            attendance: true, // attendance -> true
        },
        ]);
    if (error) {
        console.error("Error adding to the database:", error);
        return NextResponse.json(error, {
            status: 500
        })
    } else {
        console.log('Successfully added to the database:', data)
        return NextResponse.json(`Welcome, ${uid.vorname} ${uid.nachname}!`, {
            status: 201
        })
    }
    } else if (record.length === 1) {
        const record_single = record[0]
        // there is existing data in DB

        // 1. Case : user has registered (for rsvp events), and wants to set the attendance to true.

        // 2. Case QR has already scanned. (to avoid double scanning)
        if (record_single.attendance) {
            //console.log ("User has been scanned !")
            //setScannedUser(`${uid.vorname} ${uid.nachname} has been scanned!`);
            return NextResponse.json(`${uid.vorname} ${uid.nachname} has been scanned!`, {
                status: 202
            })        
        } else {
            // Set attendance to true, user has now attend the event.
            await supabase
                .from('rsvp_attendance')
                .update({ attendance: true })
                .eq('id', record_single.id);
            //console.log("Attendance updated to true.");
            return NextResponse.json(`Welcome, ${uid.vorname} ${uid.nachname}!`, {
                status: 201
            })  
        }
    } else {
        //multiple records found
        //console.log("Error : Multiple data found")
        return NextResponse.json(`${uid.vorname} ${uid.nachname}: Multiple data found`, {
            status: 405
        })
    }
}


setScannedUser("Error: Invalid QR Code!")
console.log ("Failed to add user.", error)
}

    
