import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchToken } from "../../store";
import {useLocation} from "react-router-dom";



// import Dropdown from 'react-dropdown';
// import styles from './ViewAttendanceLine.css'
//         data={data} and import for when needed. Placeholder for now?
// get the individual student select working

// This will take JSON data from the server
// not sure which route yet
// may need to containerise to avoid repeated API requests
// we'll need to get USERS, their ATTENDANCE, and possibly their COURSE
// May be too late to use Redux

// style this page nicely
// and use Karol's new endpoint.

export default function ViewAttendance () {
  let data = useLocation();
  console.log(data.state.row._id);
  const sessions = useSelector((state) => state.sessions);
  const dispatch = useDispatch();
  const currentUser = data.state.row.fullname;
  console.log(currentUser);
   
  // obviously cannot hardcode ID 
  useEffect(() => {
    var url = new URL(`${window.location.origin}/api/sessions/GetSessionsForStudent/${data.state.row._id}`);
    //url.searchParams.append("page", currentPage + 1);
    // url.searchParams.append("limit", rowsPerPage);
    fetch(url, {
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${fetchToken().token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "fetchSessions",
          payload: {
            sessions: data.Response.sessions,
          }
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);
    return (
        <div style={{height: 800}}>
            <h1> View Attendance for Individual User </h1>
            {/* <h1> {sessions[0].cohort.student} </h1> */}
            <h1> User {currentUser.firstname} {currentUser.lastname} has attended {sessions.length} sessions</h1>
        </div>

    )
    // use sorts and filters here
    // Graph component will be created - grafana etc
    // Comparison component probably also needed
    // By cohort and by inddividual - might need to split
    // i.e. view student attendance, view class attendance
    // split into different views, hold in ViewAttendance
    // hold in container for API calls.
}

