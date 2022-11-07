import { Button, Stack } from '@mui/material'
import { Link } from 'react-router-dom';

// These placeholder buttons will be changed to reflect functionality once we have a clear idea of it.
// Some will be altered in SAD-005: gives you an idea of what can be done.
export default function Main() {
    return (
        <div>
            <h1> This is our SAD assignment system. Please select an option.</h1>
                <Stack direction="row" spacing={2}>
                    <Link to="/">
                        <Button variant ="contained"> Home</Button>
                    </Link>
                    <Button variant="contained"  onClick={() => {
                        alert('Great SADness');
                    }}
                    >
                        It's time to get SAD
                    </Button>
                    <Button variant="contained" onClick={() => {
                        alert('This will do some fun API things');
                    }}
                    >
                        Let's do some fun API things!
                    </Button>
                    <Button variant="contained" onClick={() => {
                        alert('Databases are a lie');
                    }}
                    >
                        Database Placeholder Button
                    </Button>
                    <Link to="/databaseTest">
                        <Button variant ="contained"> DATABASES</Button>
                    </Link>
                    <Link to="/register">
                        <Button variant ="contained"> LOGIN</Button>
                    </Link>
            </Stack> 
            <h2> Very-Much-Work-In-Progress UI (side bar coming back in next commit)</h2>
        </div>
   
    )
}
