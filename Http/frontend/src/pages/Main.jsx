import { Grid, Stack, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { fetchToken } from "../store";
import { useSelector, useDispatch } from "react-redux";

// These placeholder buttons will be changed to reflect functionality once we have a clear idea of it.
// Some will be altered in SAD-005: gives you an idea of what can be done.
// Use a container to fix the many many requests
// GET api/users/self

// const useFetchSelf = () => {
//     //const dispatch = useDispatch();
//     useEffect(async () => {

//     });
// }

export default function Main() {
  //const [user, setUser] = useState([]);
  //const tokenString = sessionStorage.getItem('token');
  // const userToken = JSON.parse(tokenString);

  const user = useSelector((state) => state.user);
  const roles = useSelector((state) => state.roles);

  const dispatch = useDispatch()

  // useEffect(() => {
  //   const fetchSelfUser = async () => {
  //     const request = await fetch(`${window.location.origin}/api/users/self`, {
  //       headers: {
  //         Accept: "*/*",
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${fetchToken().token}`,
  //       },
  //     });
  //     const json = request.json();

      

  //     dispatch({ type: "setUser", payload: json.Response });
  //   };

  //   fetchSelfUser().catch(err => console.error(err));

  // }, []);
  // const userData = JSON.stringify(user.Response.username);
  //const userData2 = JSON.parse(userData);
  // console.log(userData.Response);

  //console.log(user.username);
  // const handleClick = event => {
  //     // 👇️ toggle shown state
  //       sessionStorage.removeItem('token', JSON.stringify(userToken));
  // };
  return (
    <div>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        <Grid item xs={8}>
          <h1> This is our SAD assignment system. Please select an option.</h1>
        </Grid>
        <Grid item xs={4}>
          <h2>
            {" "}
            Welcome {roles[0] ?? "Student"}, {user.fullname.firstname} {user.fullname.lastname}.
            What would you like to do today?
          </h2>
        </Grid>
        <Grid item xs={4}>
          <h2> Current Attendance Percentage 'X'</h2>
        </Grid>
        <Grid item xs={4}>
          <h2> Current Classes: X, Y, Z</h2>
          {/* </Grid>
                    <div>
                        {userData.map((givenUser, index) => {
                            return (
                                <div key={index}>
                                    <h2>firstName: {givenUser.Response.fullname.firstname}</h2>
                                    <h2>lastName: {givenUser.Response.fullname.lastname}</h2>
                                </div>
                            );
                        })}
                    </div>
                <Grid item xs={4}> */}
          {/* <h2>{userData2.Response.username.username}</h2>  */}
        </Grid>
      </Grid>
    </div>
  );
}
