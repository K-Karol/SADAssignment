import { Button, Stack } from '@mui/material'

// These placeholder buttons will be changed to reflect functionality once we have a clear idea of it.
// Some will be altered in SAD-005: gives you an idea of what can be done.
export default function Main() {
    return (
        <div>
            <h1> This is our SAD assignment system. Please select an option.</h1>
                <Stack direction="column" spacing={2}>
                    <h1> Welcome User. What would you like to do today?
                    </h1>
                    <h1> Current Attendance Percentage 'X'</h1>
                    <h1> Current Classes: X, Y, Z</h1>
                    {/* <h1>Running "/api" gets you: '{message}'</h1> */}
                    <h1>Running "/api" gets you: </h1>

                </Stack> 
            <h2> Slightly less work-in-progress UI (side bar coming back in next commit)</h2>
        </div>
   
    )
}
