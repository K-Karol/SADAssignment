import { Grid } from "@mui/material";

import { useSelector } from "react-redux";
import Logout from "./Logout";

export default function Main() {
  const user = useSelector((state) => state.user);
  const roles = useSelector((state) => state.roles);
  return (
    <div>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        <Grid item xs={4}>
          <h2>
            {" "}
            Welcome {roles[0] ?? "Student"}, {user.fullname.firstname} {user.fullname.lastname}.
            What would you like to do today?
          </h2>
        </Grid>
    </Grid>
    <Logout/>
    </div>
  );
}
