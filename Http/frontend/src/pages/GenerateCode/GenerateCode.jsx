import { Button } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { useState} from 'react';
import styles from './GenerateCode.module.css';
// REFACTOR to use server-side code generation

function makecode(length) {
    let result ='';
    let characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const theme = createTheme({
  status: {
    danger: '#e53e3e',
  },
  palette: {
    primary: {
      main: '#0971f1',
      darker: '#000000',
    },
    neutral: {
      main: '#64748B',
      contrastText: '#fff',
    },
  },
});

const randomCode = makecode(8);
// this will obviously be alphanumeric and possibly generated server-side
// either way it's calm
// style={{ fontSize: "9rem", color: 'blue'}}
// Grid it for full responsiveness

const GenerateCode = () => {
    const [isShown, setIsShown] = useState(false);

    const handleClick = event => {
  // 👇️ toggle shown state
    setIsShown(current => !current);
    };

    return (
        <div className="GenerateCode">
            <h1> Generate your random code here.</h1>
            <Button color="secondary" variant ="contained" onClick={handleClick}
            > Generate Code</Button>
            {isShown && (
                <div className="shadowBox">
                    <h1 style={{ fontSize: "9rem"}} className={styles.rainbow_text_animated}>{randomCode}</h1>
                </div>
            )}

        </div>

    )
}
export default GenerateCode;
