import { Button } from '@mui/material'
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux'

// Not fully functional just yet - to be fixed in next commit
// this just shows you how it would be done.
// token removal and logout works fine
// logging back in is the problem - fix should be relatively simple. 
export default function Logout() {
    const dispatch = useDispatch();
    const handleClick = event => {
        // 👇️ toggle shown state
          localStorage.removeItem('token');
          dispatch({type: "logout", payload: {} });
    };
    return(
        <div>
              <Link to="/login">
              <Button variant ="contained" onClick={handleClick}> Logout</Button>
              </Link>
        </div>
    )
}
