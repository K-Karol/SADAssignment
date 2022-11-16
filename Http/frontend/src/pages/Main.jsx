import { Grid, Stack } from '@mui/material'
import {useState, useEffect} from 'react';


// These placeholder buttons will be changed to reflect functionality once we have a clear idea of it.
// Some will be altered in SAD-005: gives you an idea of what can be done.
export default function Main() {
    const [message, setMessage] = useState('');

    // this currenly does not work but should
    useEffect(() => {
      fetch(`${window.location.origin}/api`)
          .then((res) => res.text())
          .then((text) => {setMessage(text); console.log(text); });
    }, []);
    // ???

    return (
        <div>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                <Grid item xs={8}>
                    <h1> This is our SAD assignment system. Please select an option.</h1>
                </Grid>
                <Grid item xs={4}>
                    <h2> Welcome User. What would you like to do today?</h2>
                </Grid>
                <Grid item xs={4}>
                    <h2> Current Attendance Percentage 'X'</h2>
                </Grid>
                <Grid item xs={4}>
                    <h2> Current Classes: X, Y, Z</h2>
                </Grid>
                <Grid item xs={4}>
                    <h2>{message}</h2> 
                </Grid>
            </Grid>
        </div>
    )
}
