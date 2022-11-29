import { Button } from "@mui/material";
import { useState } from "react";
import { fetchToken } from "../../store";

// Restrict via roles on here - hide button or container if no admin role
// roles selector
// then either match or equal to
// for conditional rendering on code gen button
// then sneaky students can't generate a code from the frontend (enough for Proof of Context)

export default function GenerateCode() {
  const [code, setCode] = useState("");
  const [isShown, setIsShown] = useState(false);

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${fetchToken().token}`,
    },
    body: JSON.stringify({ // TODO: This body needs to be changed (potentially passed in to this function)
      type: "lecture",
      module: "63837a704a7208be7665db7a", 
      cohortIdentifier: "All",
      startDateTime: "2022-11-24T20:08:53+0000",
      endDateTime: "2022-11-24T20:11:53+0000",
    }),
  };

  const createSessionAndCode = async () => {
    var newSessionRequest = await fetch(
      `${window.location.origin}/api/sessions/resource`,
      requestOptions
    );
    var newSession = await newSessionRequest.json();

    if (newSession.Success) {
      var sessionCode = newSession.Response;
      var newActiveSessionRequest = await fetch(
        `${window.location.origin}/api/activeSessions/GenerateNewActiveSession/${sessionCode}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${fetchToken().token}`,
          },
        }
      );
      var codeBody = await newActiveSessionRequest.json();
      if (codeBody.Success) {
        return codeBody.Response.code;
      }
    } else {
      return "Failed to get code";
    }
  };

  const handleClick = async (event) => {
    var c = await createSessionAndCode();
    setCode(c);
    setIsShown(true);
  };

  return (
    <div className="GenerateCode">
      <h1> Generate your random code here.</h1>
      <Button color="secondary" variant="contained" onClick={handleClick}>
        {" "}
        Generate Code
      </Button>
      {isShown && <h1 style={{ fontSize: "9rem" }}>{code}</h1>}
    </div>
  );
}