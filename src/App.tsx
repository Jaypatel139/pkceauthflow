import React from "react";
import "./App.css";
import { MouseEvent, useEffect } from "react";
import * as crypto from "crypto";
import * as microsoftTeams from "@microsoft/teams-js";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
var axios = require("axios").default;
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
  const path = `https://dev-4t7jabs8.us.auth0.com/authorize?response_type=code&client_id=QPjjWTU2m7XuWtPTo1FAYbNaZphqnbWQ&code_challenge=${challenge}&code_challenge_method=S256&redirect_uri=https://authpkceflow.herokuapp.com/Oauthcallback&scope=appointments%20contacts&state=xyzABC123`;
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
  console.log("verifier", verifier);
  fetch("https://dev-4t7jabs8.us.auth0.com/oauth/token", {
    method: "post",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: "QPjjWTU2m7XuWtPTo1FAYbNaZphqnbWQ",
      code_verifier: `${verifier}`,
      code: `${urlParams.get("code")}`,
      redirect_uri: "https://authpkceflow.herokuapp.com/",
    }),
  })
    .then((response) => response.json())
    .then((data) => microsoftTeams.authentication.notifySuccess(data.token));
  // var options = {
  //   method: "POST",
  //   url: "https://dev-4t7jabs8.us.auth0.com/oauth/token",
  //   headers: {
  //     "Content-Type":
  //       "application/x-www-form-urlencoded; charset=UTF-8;application/json",
  //   },
  //   data: {
  //     grant_type: "authorization_code",
  //     client_id: "B0eryZijemcFaKFOIDDM7BZvAWN1sGje",
  //     client_secret:
  //       "1G9yzpEuL224k2iI7WXA0BH-wAzgfYHRZDChlT1Ld0pleEWOAeV72CzRk57Hfa-n",
  //     code: `${urlParams.get("code")}`,
  //     redirect_uri:
  //       "https://34e0-2607-fea8-ba1-e400-acb1-eb67-8300-ed93.ngrok.io",
  //   },
  // };

  // axios
  //   .request(options)
  //   .then(function (response: { data: any }) {
  //     console.log(response.data);
  //   })
  //   .catch(function (error: any) {
  //     console.error(error);
  //   });
};

function Oauthcallback() {
  useEffect(() => {
    debugger;
    const Params = new URLSearchParams(window.location.search);
    if (Params.has("code")) {
      console.log(Params.get("code"));
      accesstoken();
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
