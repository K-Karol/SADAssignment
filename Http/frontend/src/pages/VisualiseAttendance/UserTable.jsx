import { useEffect } from "react";
import {
  Table,
  TableRow,
  TableContainer,
  TableBody,
  TableCell,
  TableHead,
  Paper,
  Pagination,
  TablePagination,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { fetchToken } from "../../store";

export default function UserTable() {
  const userArray = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const currentPage = useSelector((state) => state.currentPage);
  const pagesAvailable = useSelector((state) => state.pagesAvailable);
  const rowsPerPage = useSelector((state) => state.rowsPerPage);
  const totalRecords = useSelector((state) => state.totalRecords);

  useEffect(() => {
    var url = new URL(`${window.location.origin}/api/users/resource`);
    url.searchParams.append("page", currentPage + 1);
    url.searchParams.append("limit", rowsPerPage);
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
          type: "fetchUsers",
          payload: {
            users: data.Response.users,
            pagesAvailable: data.Response.totalPages,
            totalRecords: data.Response.totalResults,
          }
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [currentPage, rowsPerPage]); // in brackets put it something like page so it refreshes on a different page

  const handleChangePage = (event, newPage) => {
    dispatch({ type: "updatePage", payload: { newPage: newPage } });
  };

  const handleChangeRowsPerPage = (event) => {
    dispatch({
      type: "updatePage",
      payload: { newPage: 0, rowsPerPage: parseInt(event.target.value, 10) },
    });
  };

  return (
    <div>
      {/* <h1> {userArray[0].username} </h1> */}
      <h1> Attendance </h1>
      {/* <h1> {userArray[0].username} </h1>
            <h1> {userArray[0].fullname.firstname} </h1> */}

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
            {/* to be reinstated with the foreach loop
          {headCells.map((headCell)=> (
            <TableRow
                 key={headCell.id}
                 sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
            <TableCell component="th" scope="row">
                {headCell.label}
              </TableCell>
              <TableCell align="right">{headCell.label}</TableCell>
              <TableCell align="right">{headCell.label}</TableCell>
              <TableCell align="right">{headCell.label}</TableCell>
              <TableCell align="right">{headCell.label}</TableCell>
            </TableRow>

          ))} */}
            <TableRow component='div'>
              <TableCell component='div'>Username</TableCell>
              {/*             We'll pass in clickability by using component={Link} on TableRow for each user
               */}{" "}
              <TableCell component='div' align="right">First Name</TableCell>
              <TableCell component='div' align="right">Middle Names</TableCell>
              <TableCell component='div' align="right">Last Name</TableCell>
              <TableCell component='div' align="right">Student ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody component='div'>
            {userArray.map((row) => (
              <TableRow
                key={row.username}
                /* ${n}  - this is how we'd specify individual viewAttendance pages should it be necessary (pass in relevant props)*/ 
                component={Link} to={`/viewAttendance`}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="div" scope="row">
                  {row.username}
                </TableCell>
                <TableCell component='div' align="right">{row.fullname.firstname}</TableCell>
                <TableCell component='div' align="right">{row.fullname.middlenames}</TableCell>
                <TableCell component='div' align="right">{row.fullname.lastname}</TableCell>
                <TableCell component='div' align="right">{row._id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
