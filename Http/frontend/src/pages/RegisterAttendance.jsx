import { useEffect } from "react";
import { Button, Grid, TextField, FormControl } from "@mui/material";
import { fetchToken } from "../store";

import { useState } from "react";

export default function RegisterAttendance() {
  const [code, setCode] = useState("");
  const [submitColourButton, setSubmitColourButton] = useState("primary");

  const handleCodeChange = (event) => {
    setSubmitColourButton("primary");
    setCode(event.target.value);
  };

  const onSubmit = async () => {
    if (code === "") {
      setSubmitColourButton("error");
      alert("The code cannot be empty");
    } else {
      var url = new URL(`${window.location.origin}/api/activeSessions/RecordStudentAttendance/${code}`);
      try{
        var request = await fetch(url,{
            method: "POST",
            headers: {
              Accept: "*/*",
              "Content-Type": "application/json",
              Authorization: `Bearer ${fetchToken().token}`,
            },
          });
          var body = await request.json();
    
          if(!body.Success){
            setSubmitColourButton("error");
            alert(`Failed to record attendance: ${body.Error}`);
          } else{
            setSubmitColourButton("success");
          }
      } catch(err) {
        setSubmitColourButton("error");
        alert(`Failed to record attendance`);
      }
     

    }
  };

  return (
    <div className="RegisterAttendance">
      <FormControl
        style={{
          marginTop: 20,
          display: "flex",
          flexDirection: "column",
          rowGap: "20px",
        }}
      >
        <TextField
          sx={{ width: 300 }}
          variant="outlined"
          id="input-code"
          label="Code"
          onChange={handleCodeChange}
        />
        <Button
          sx={{ width: 300 }}
          variant="outlined"
          color={submitColourButton}
          onClick={onSubmit}
        >
          Submit
        </Button>
      </FormControl>
    </div>
  );
}
