import { useState } from "react"
import { fetchToken } from "../store";

export default function EditAttendance() {

    const [sessionID, setSessionID] = useState();
    const [studentID, setStudentID] = useState();
    const [attendance, setAttendance] = useState();

    const editAttendance = async () => {
        console.log(attendance)
        var newAttendanceRequest = await fetch (`${window.location.origin}/api/sessions/PatchUserAttendence/${sessionID}/${studentID}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${fetchToken().token}`,
            },
            body: JSON.stringify({
                attendance: attendance,
            })
        })
        .then(response => {console.log(response.status)
            return response.json();})
        .then(data=> console.log(data));
        var newAttendance = await newAttendanceRequest.json();
    };

    const handleSubmit = async e => {
        var c = await editAttendance();
    }

    return (
        <div className="EditAttendance">
            <h1> Manually edit attendance, form goes here</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Session ID</p>
                    <input type="text" onChange={e => setSessionID(e.target.value)}/>
                </label>
                <label>
                    <p>Student ID</p>
                    <input type="text" onChange={e => setStudentID(e.target.value)}/>
                </label>
                <label>
                    <p>Attendance</p>
                    <input type="text" onChange={e => setAttendance(e.target.value)}/>
                </label>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>

    )
}
// do the extend period thing here
// extenuating circumstances etc - easy to do with API call
// could also include change status of session too 
// with RBAC we limit his edit access
// get the roles from the token, and that governs what can be done