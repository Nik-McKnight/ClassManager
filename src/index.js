import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { App } from "./components";
// import AuthProvider from "./components/AuthProvider";
// css stylesheets can be created for each component
// place them in the src/style directory, and import them like this:
// import "./style/index.css";
// import "./components/styles/index.css";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* <AuthProvider> */}
      <App />
      {/* </AuthProvider> */}
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
