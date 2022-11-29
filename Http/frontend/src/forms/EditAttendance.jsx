import { useState, useEffect } from "react"
import { fetchToken } from "../store";
import {Button, Stack} from "@mui/material";
import {Form, Field, Formik} from "formik";

export default function EditAttendance() {

    const [sessionID, setSessionID] = useState();
    const [studentID, setStudentID] = useState();
    const [attendance, setAttendance] = useState();
    const [sessionList, setSessionList] = useState([]);
    const [studentsList, setStudentsList] = useState([]);
    const [session, setSession] = useState("");
    const [student, setStudent] = useState("");


    const editAttendance = async () => {
        var newAttendanceRequest = await fetch (`${window.location.origin}/api/sessions/PatchUserAttendence/${sessionID}/${studentID}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${fetchToken().token}`,
            },
            body: JSON.stringify({
                attendance: attendance
            })
        })
        .then(response => {console.log(response.status)
            return response.json();})
        .then(data=> console.log(data));
    };

    console.log(`Bearer ${fetchToken().token}`);
  
  useEffect(() => {
    fetch(`${window.location.origin}/api/sessions/resource`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${fetchToken().token}`
      },
    }).then((res) => res.json())
    .then((sessions) => {
      if (sessions.Success) {
        setSessionList(sessions.Response.sessions);
      }
    });
  }, []);

    return (

    <div className="EditAttendance">
        <Formik
            initialValues={{
                sessionField: '',
                studentField: '',
                attendanceField: ''
            }}
            onSubmit={async (values) => {
                console.log("test");
                await new Promise((r) => setTimeout(r, 500));
                sessionID = values.sessionField;
                studentID = values.studentField;
                attendance = values.attendanceField;
                var c = await editAttendance();
            }}
        >

            <Form>
                <Stack spacing={1}>
                    <label htmlFor="sessionField">Session</label>
                    <Field as="select" name="sessionField">
                        <option value=""></option>
                        {sessionList.map((session) => <option value={session._id}>{session._id}</option>)}
                    </Field>
                    <label htmlFor="studentField">Student</label>
                    <Field as="select" name="studentField">
                        <option value=""></option>
                        {studentsList.map((student) => <option value={student._id}>{student._id}</option>)}
                    </Field>
                    <label htmlFor="attendanceField">Attendance</label>
                    <Field as="select" name="attendanceField">
                        <option value="late">Late</option>
                        <option value="not">Not</option>
                        <option value="full">Full</option>
                    </Field>
                    <button type="submit"> Edit Attendance </button>
                </Stack>
            </Form>
        </Formik>
    </div>
    );
}
// do the extend period thing here
// extenuating circumstances etc - easy to do with API call
// could also include change status of session too 
// with RBAC we limit his edit access
// get the roles from the token, and that governs what can be done