import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Grid,
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

import {useState} from "react"

import {TablePagination} from "@mui/material"

export default function ViewAttendance () {
  let data = useLocation();
  const sessions = useSelector((state) => state.sessions);
  const dispatch = useDispatch();
  const currentUser = data.state.row.fullname;
   
  const [currentPage, setCurrentPage] = useState(0);
  // const pagesAvailable = useSelector((state) => state.pagesAvailable);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    var url = new URL(`${window.location.origin}/api/sessions/GetSessionsForStudent/${data.state.row._id}`);
    url.searchParams.append("page", currentPage + 1);
    url.searchParams.append("limit", rowsPerPage);
    url.searchParams.append("joinModule", true);
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
        })
        ;
        setTotalRecords(data.Response.totalResults);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [currentPage, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setCurrentPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

    return (
        <tbody style={{height: 800}}>
          <Grid>
          <h1> View Attendance for Individual User </h1>
            <h2> User {currentUser.firstname} {currentUser.lastname} has attended {totalRecords} sessions</h2>       
            <TableContainer component="div">
            <TablePagination
                component="div"
                count={totalRecords}
                page={currentPage}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
              <Table sx={{ minWidth: 650 }} aria-label="simple table" component='div'>
                <TableHead component='div'>
                <TableRow component='div'>
                  <TableCell component='div'>Session Type</TableCell>
                    {" "}
                  <TableCell component='div' align="right">Module</TableCell>
                  <TableCell component='div' align="right">Attendance</TableCell>
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
                <TableCell component='div' align="right">{row.module.name} | Semester {row.module.semester}</TableCell>
                <TableCell component='div' align="right">{row.attendance}</TableCell>
                <TableCell component='div' align="right">{row.cohortIdentifier}</TableCell>
                <TableCell component='div' align="right">{dayjs(row.startDateTime).format('MMMM D, YYYY h:mm A')}</TableCell>
                <TableCell component='div' align="right">{dayjs(row.endDateTime).format('MMMM D, YYYY h:mm A')}</TableCell>
                <TableCell component='div' align="right">{row._id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
    </tbody>
    )
}

