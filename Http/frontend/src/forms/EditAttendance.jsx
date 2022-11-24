const EditAttendance = () => {
    return (
        <div className="EditAttendance">
            <h1> Manually edit attendance, form goes here</h1>
        </div>

    )
}
export default EditAttendance;
// do the extend period thing here
// extenuating circumstances etc - easy to do with API call
// could also include change status of session too 
// with RBAC we limit his edit access
// get the roles from the token, and that governs what can be done