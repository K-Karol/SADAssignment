import { Button } from '@mui/material'
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux'

// Simple Logout component. Removes token and clears redux store.
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
