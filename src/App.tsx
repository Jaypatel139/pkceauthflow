import React from "react";
import "./App.css";
import { MouseEvent, useEffect } from "react";
import * as crypto from "crypto";
import * as microsoftTeams from "@microsoft/teams-js";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
microsoftTeams.initialize();

function App() {
  debugger;
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/Oauthcallback">
          <Oauthcallback />
        </Route>
      </Switch>
    </Router>
  );
}

function base64URLEncode(str: Buffer) {
  return str
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}
var verifier = base64URLEncode(crypto.randomBytes(32));
// console.log("V", verifier);
function sha256(buffer: string) {
  return crypto.createHash("sha256").update(buffer).digest();
}
var challenge = base64URLEncode(sha256(verifier));

const handleAuthResponse = (hostname?: string): void => {
  debugger;
  if (hostname) {
    // window.location.href = "https://" + hostname + window.location.pathname;
  } else {
    // window.location.reload();
  }
};

const handleSignIn = (e: MouseEvent): void => {
  e.preventDefault();
  // const path = `https://oauth-integration-v7.use1-test-4.internal.invision.works/oauth/v2/authorize?response_type=code
  // &client_id=01FAE4RAZKK224M47KHP7RBSRA&code_challenge=${challenge}
  // &code_challenge_method=S256&%20%20redirect_uri=http://localhost:3000
  // &audience=appointments:api&state=xyzABC123&redirectTo=%2F`;
  const path = `https://dev-4t7jabs8.us.auth0.com/authorize?response_type=code&client_id=gVPNspUn8AggRybYvQjrkGWwIcbrPk38&code_challenge=${challenge}&code_challenge_method=S256&redirect_uri=https://9dd6-2607-fea8-ba1-e400-9d7f-7c07-eaa7-e39a.ngrok.io/Oauthcallback&scope=appointments%20contacts&state=xyzABC123`;
  debugger;
  microsoftTeams.authentication.authenticate({
    url: path,
    height: 655,
    successCallback: (result) => {
      debugger;
      const entryHost = "";
      if (entryHost != null && entryHost !== window.location.hostname) {
        handleAuthResponse(entryHost);
      }
    },
    failureCallback: (result) => {
      debugger;
      const entryHost = "";
      if (entryHost != null && entryHost !== window.location.hostname) {
        handleAuthResponse(entryHost);
      }
    },
  });
};

function Home() {
  return (
    <div>
      <h2>Home</h2>
      <input type="submit" value="Login" onClick={handleSignIn} />
    </div>
  );
}

const accesstoken = () => {
  const urlParams = new URLSearchParams(window.location.search);
  fetch("https://dev-4t7jabs8.us.auth0.com/oauth/token", {
    method: "post",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: "gVPNspUn8AggRybYvQjrkGWwIcbrPk38",
      code_verifier: `${verifier}`,
      code: `${urlParams.get("code")}`,
      redirect_uri: "http://localhost:3000",
    }),
  })
    .then((response) => response.json())
    .then((data) => console.log(data));
};

function Oauthcallback() {
  useEffect(() => {
    debugger;
    const Params = new URLSearchParams(window.location.search);
    if (Params.has("code")) {
      console.log(Params.get("code"));
      accesstoken();
      microsoftTeams.authentication.notifySuccess(
        // @ts-ignore
        Params.get("code") || ""
      );
      // window.close();
    } else {
      microsoftTeams.authentication.notifyFailure();
    }
  }, []);
  return (
    <div>
      <h2>Hello Oauth</h2>
    </div>
  );
}

export default App;
