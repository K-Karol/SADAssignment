import { Button } from '@mui/material';

const GenerateReport = () => {
    // drop down menu for class and student
    // possibly not necessary, focus on visualising attendance instead
    return (
        <div className="GenerateReport">
            <h1> Generate an attendance report for Class X, Student Y (drop downs go here)</h1>
            <Button variant ="contained" onClick={() => {
                        alert('Report generated for X, Y');
                    }}
            > Generate Report</Button>
        </div>

    )
}
export default GenerateReport;
