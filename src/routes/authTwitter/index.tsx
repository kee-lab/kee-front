import { memo, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";


const forward = ()=>{window.location.href="https://twitter.com/i/oauth2/authorize?response_type=code&client_id=VDJXUzBESDhhUDlyWjBDa0FtckE6MTpjaQ&redirect_uri=https://127.0.0.1/auth/&scope=tweet.read%20users.read%20follows.read%20follows.write&state=state&code_challenge=challenge&code_challenge_method=plain"};

function AuthTwitter() {
  return (
    forward()
  );
}
export default AuthTwitter;
