import { useEffect} from 'react';
import { Table, TableRow, TableContainer, TableBody, TableCell, TableHead, Paper } from '@mui/material';
import { useSelector, useDispatch} from "react-redux";

export default function UserTable() {
    const userArray = useSelector((state) => state.users);
    const dispatch = useDispatch();
    console.log(userArray);
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    function createData(firstName, middleNames, lastName, studentId, username)
      {
        return {
          firstName,
          middleNames,
          lastName,
          studentId,
          username,
        };
      }
      // foreach loop or map going here with userArray[x] to populate table rows.
    const rows = [createData(userArray[0].fullname.firstname, userArray[0].fullname.middleNames, userArray[0].fullname.lastname, userArray[0]._id, userArray[0].username)];

    useEffect(() => {
        fetch(`${window.location.origin}/api/users/resource`, {
          headers: {
              'Accept': '*/*',
              'Content-Type': 'application/json',
              "Authorization": `Bearer ${userToken?.token}`
          },
        })
          .then((res) => res.json())
          .then((data) => {
                dispatch({type: "fetchUsers", payload: {users: data.Response.users, roles: data.Response.users[0].roles}});
            })
          .catch((err) => {
             console.log(err.message);
          });
      });
      // does not work console.log(users[0]);
      //console.log(users.userArray.0.username);
      return (
        <div>
            {/* <h1> {userArray[0].username} </h1> */}
            <h1> Attendance </h1>
            {/* <h1> {userArray[0].username} </h1>
            <h1> {userArray[0].fullname.firstname} </h1> */}
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          
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
            <TableRow>
            <TableCell>Username</TableCell>
{/*             We'll pass in clickability by using component={Link} on TableRow for each user
 */}            <TableCell align="right">First Name</TableCell>
            <TableCell align="right">Middle Names</TableCell>
            <TableCell align="right">Last Name</TableCell>
            <TableCell align="right">Student ID</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.username}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.username}
              </TableCell>
              <TableCell align="right">{row.firstName}</TableCell>
              <TableCell align="right">{row.middleNames}</TableCell>
              <TableCell align="right">{row.lastName}</TableCell>
              <TableCell align="right">{row.studentId}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
        </div>
      )
}