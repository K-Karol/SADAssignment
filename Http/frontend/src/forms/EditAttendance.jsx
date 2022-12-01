import { useState, useEffect } from "react";
import { fetchToken } from "../store";
import {
  Button,
  FormControl,
  MenuItem,
  TextField,
} from "@mui/material";
export default function EditAttendance() {
  const [form_course, setCourse] = useState(null);
  const [form_module, setModule] = useState(null);
  const [form_session, setSession] = useState(null);
  const [form_student, setStudent] = useState(null);
  const [form_attendance, setAttendance] = useState("not");

  const [courseList, setCourseList] = useState([]);
  const [moduleList, setModuleList] = useState([]);
  const [sessionList, setSessionsList] = useState([]);
  const [studentList, setStudentList] = useState([]);


  const [moduleDisabled, setModuleDisabled] = useState(true);
  const [sessionDisabled, setSessionDisabled] = useState(true);
  const [studentDisabled, setStudentDisabled] = useState(true);
  const [attendanceDisabled, setAttendanceDisabled] = useState(true);

  const [submitColourButton, setSubmitColourButton] = useState("primary")

  console.log(`Bearer ${fetchToken().token}`);

  const getAllCourses = async () => {
    var page = 1;
    var courses = [];
    var hasNextPage = true;
    while (hasNextPage) {
      var url = new URL(`${window.location.origin}/api/courses/resource`);
      url.searchParams.append("joinModules", true);
      url.searchParams.append("page", page);
      var request = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${fetchToken().token}`,
        },
      });

      var requestBody = await request.json();
      if (requestBody.Success) {
        courses = courses.concat(requestBody.Response.courses);
        hasNextPage = requestBody.Response.hasNextPage;
        page++;
      }
    }

    setCourseList(courses);
  };

  useEffect(() => {
    getAllCourses();
  }, []);

  const getSessionsForModule = async (module) => {
    var page = 1;
    var sessions = [];
    var hasNextPage = true;
    while (hasNextPage) {
      var url = new URL(`${window.location.origin}/api/sessions/resource`);
      url.searchParams.append("joinStudents", true);
      url.searchParams.append("page", page);
      url.searchParams.append(
        "filter",
        JSON.stringify({ module: `ObjectID(${module._id})` })
      );
      var request = await fetch(
        url,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${fetchToken().token}`,
          },
        }
      );

      var requestBody = await request.json();
      if (requestBody.Success) {
        sessions = sessions.concat(requestBody.Response.sessions);
        hasNextPage = requestBody.Response.hasNextPage;
      }
    }

    setSessionsList(sessions);
  };

  const submitAttendanceData = async () => {
    var url = new URL(`${window.location.origin}/api/sessions/PatchUserAttendence/${form_session._id}/${form_student.student._id}`);
    var request = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${fetchToken().token}`,
      },
      body: JSON.stringify({
        attendance: form_attendance
      })
    });

    var body = await request.json();
    if (!body.Success) {
      return false;
    }

    return true;

  }

  const handleCourseChange = (event) => {
    if (!form_course || form_course._id != event.target.value._id) {
      setCourse(event.target.value);
      setModule(null);
      setModuleList(event.target.value.modules);
      setModuleDisabled(false);
      setSessionDisabled(true);
      setStudentDisabled(true);
      setAttendanceDisabled(true);
      setSession(null);
      setSessionsList([]);
      setStudent(null);
      setStudentList([]);
      setAttendance("not");
    } else {
      setCourse(event.target.value);
    }
  };

  const handleModuleChange = async (event) => {
    if (!form_module || form_module._id != event.target.value._id) {
      setModule(event.target.value);
      setSessionDisabled(false);
      setSession(null);
      await getSessionsForModule(event.target.value);
      setStudentDisabled(true);
      setStudent(null);
      setStudentList([]);
      setAttendanceDisabled(true);
      setAttendance("not");
    } else {
      setModule(event.target.value);
    }
  };

  const handleSessionChange = async (event) => {
    if (!form_session || form_session._id != event.target.value._id) {
      setSession(event.target.value);
      setStudentDisabled(false);
      setStudent(null);
      setStudentList(event.target.value.cohort.students);
      setAttendanceDisabled(true);
      setAttendance("not");
    } else {
      setSession(event.target.value);
    }
  };

  const handleStudentChange = async (event) => {
    if (!form_student || form_student.student._id != event.target.value._id) {
      setStudent(event.target.value);
      setAttendanceDisabled(false);
      setAttendance(event.target.value.attendance);
    } else {
      setStudent(event.target.value);
    }
  };

  const handleAttendanceChange = async (event) => {
    if (!form_attendance || form_attendance != event.target.value) {
      setAttendance(event.target.value);
    } else {
      setAttendance(form_attendance);
    }
  };

  const onSubmit = async () => {
    setSubmitColourButton("primary");
    if (!form_course || !form_module || !form_session || !form_student || !form_attendance) {
      setSubmitColourButton("error");
      alert("All fields must not be empty");
    } else {
      var res = await submitAttendanceData();
      if (res) {
        setSubmitColourButton("success");
      } else {
        setSubmitColourButton("error");
      }

    }
  };

  return (
    <div className="EditAttendance">
      <FormControl
        style={{
          marginTop: 20,
          display: "flex",
          flexDirection: "column",
          rowGap: "20px",
        }}
      >
        <TextField
          label="Course"
          id="select-course"
          sx={{ width: 300 }}
          value={form_course}
          select
          onChange={handleCourseChange}
        >
          {courseList.map((course) => (
            <MenuItem value={course}>
              {course.name} | Year: {course.yearOfEntry}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="select-module"
          label="Module"
          value={form_module}
          sx={{ width: 300 }}
          onChange={handleModuleChange}
          select
          disabled={moduleDisabled}
        >
          {moduleList.map((module) => (
            <MenuItem value={module}>
              {module.name} | Semester {module.semester}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="select-session"
          label="Session"
          value={form_session}
          sx={{ width: 300 }}
          onChange={handleSessionChange}
          select
          disabled={sessionDisabled}
        >
          {sessionList.map((session) => (
            <MenuItem value={session}>
              {session.type} | Date & Time: {session.startDateTime}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="select-student"
          label="Student"
          value={form_student}
          sx={{ width: 300 }}
          onChange={handleStudentChange}
          select
          disabled={studentDisabled}
        >
          {studentList.map((studentAttendance) => (
            <MenuItem value={studentAttendance}>
              {studentAttendance.student.fullname.firstname} {studentAttendance.student.fullname.lastname}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="select-attendance"
          label="Attendance"
          value={form_attendance}
          sx={{ width: 300 }}
          onChange={handleAttendanceChange}
          select
          disabled={attendanceDisabled}
        >
          <MenuItem value="not">Not</MenuItem>
          <MenuItem value="late">Late</MenuItem>
          <MenuItem value="full">Full</MenuItem>

        </TextField>
        <Button sx={{ width: 300 }} variant="outlined" color={submitColourButton} onClick={onSubmit}>Submit</Button>
      </FormControl>
    </div>
  );
}