import { useState, useEffect } from "react"
import { fetchToken } from "../store";
import {Button, Stack} from "@mui/material";
import {Form, Field, Formik} from "formik";
import { useSelector, useDispatch } from "react-redux";

export default function EditAttendance() {

    var [sessionID, setSessionID] = useState();
    var [studentID, setStudentID] = useState();
    var [attendance, setAttendance] = useState();
    const [courseList, setCourseList] = useState([]);
    const [moduleList, setModuleList] = useState([]);
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
    fetch(`${window.location.origin}/api/courses/resource?joinModules=true`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${fetchToken().token}`
      },
    }).then((res) => res.json())
    .then((courses) => {
      if (courses.Success) {
        setCourseList(courses.Response.courses);
      }
    });
  }, []);

  useEffect(() => {
    fetch(`${window.location.origin}/api/sessions/resource?joinStudents=true`,
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
                await new Promise((r) => setTimeout(r, 500));
                sessionID = values.sessionField;
                studentID = values.studentField;
                attendance = values.attendanceField;
                var c = await editAttendance();
            }}
        >

            <Form>
                <Stack spacing={1}>
                    <label htmlFor="courseField">Course</label>
                    <Field as="select" name="courseField">
                        <option value=""></option>
                        {courseList.map((course) => <option value={course._id}>{course.name} | Year: {course.yearOfEntry}</option>)}
                    </Field>
                    <label htmlFor="moduleField">Module</label>
                    <Field as="select" name="moduleField">
                        <option value=""></option>
                        {courseList.map((course) => (course.modules.map((module) => ( <option value={module._id}>{module.name} | Semester {module.semester}</option>))))}
                    </Field>
                    <label htmlFor="sessionField">Session</label>
                    <Field as="select" name="sessionField">
                        <option value=""></option>
                        {sessionList.map((session) => <option value={session._id}>{session.type} | Date & Time: {session.startDateTime}</option>)}
                    </Field>
                    <label htmlFor="studentField">Student</label>
                    <Field as="select" name="studentField">
                        <option value=""></option>
                        {sessionList.map((session) => (session.cohort.students.map((students) => <option value={students.student._id}>{students.student.fullname.firstname} {students.student.fullname.lastname}</option>)))}
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