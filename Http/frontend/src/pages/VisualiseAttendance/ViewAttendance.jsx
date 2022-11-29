import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Table,
  TableRow,
  TableContainer,
  TableBody,
  TableCell,
  TableHead,
} from "@mui/material";
import { fetchToken } from "../../store";
import { useLocation } from "react-router-dom";
import dayjs from 'dayjs';

// style this page nicely
// and use Karol's new endpoint.

// and use conditional rendering as some users will have zero sessions.
// Pretty this up - we need module names (Endpoint required) and responsiveness in full.

export default function ViewAttendance () {
  let data = useLocation();
  console.log(data.state.row._id);
  const sessions = useSelector((state) => state.sessions);
  const dispatch = useDispatch();
  const currentUser = data.state.row.fullname;
  console.log(currentUser);
   
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
            <h2> User {currentUser.firstname} {currentUser.lastname} has attended {sessions.length} sessions</h2>
{/*             and the sessions are as follows (table, etc, with length)
            
 */}        

      <TableContainer component="div">
        <Table sx={{ minWidth: 650 }} aria-label="simple table" component='div'>
          <TableHead component='div'>
            <TableRow component='div'>
              <TableCell component='div'>Session Type</TableCell>
              {" "}
              <TableCell component='div' align="right">Module</TableCell>
              <TableCell component='div' align="right">Cohort</TableCell>
              <TableCell component='div' align="right">Start Date+Time</TableCell>
              <TableCell component='div' align="right">End Date+Time</TableCell>
              <TableCell component='div' align="right">Session ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody component='div'>
            {sessions.map((row) => (
              <TableRow
                key={row.username}
                // The above line takes a row to serve the individual view attendance page for the student clicked on by the user.
                // Then the rows take session objects via the map function.
                // These are then displayed through TableCells.
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="div" scope="row">
                  {row.type}
                </TableCell>
                <TableCell component='div' align="right">{row.module}</TableCell>
                <TableCell component='div' align="right">{row.cohort.identifier}</TableCell>
                <TableCell component='div' align="right">{dayjs(row.startDateTime).format('MMMM D, YYYY h:mm A')}</TableCell>
                <TableCell component='div' align="right">{dayjs(row.endDateTime).format('MMMM D, YYYY h:mm A')}</TableCell>
                <TableCell component='div' align="right">{row._id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
    )
}

