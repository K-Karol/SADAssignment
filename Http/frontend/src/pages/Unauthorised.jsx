import { Grid } from "@mui/material";
export default function Unauthorised() {
    return (
      <div>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          <Grid item xs={4}>
            <h2>
                Sorry, you are not authorised to access this page. 
                If you believe this is a mistake, please contact your system administrator.
            </h2>
          </Grid>
        </Grid>
      </div>
    );
}