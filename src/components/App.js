import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
// getAPIHealth is defined in our axios-services directory index.js
// you can think of that directory as a collection of api adapters
// where each adapter fetches specific info from our express server's /api route

// import "../style/App.css";
// import Login from "./Login";
// import NavBar from "./NavBar";
// import Register from "./Register";
// import UserProfile from "./UserProfile";
// import LogOut from "./Logout";

const App = () => {
  useEffect(() => {
    // follow this pattern inside your useEffect calls:
    // first, create an async function that will wrap your axios service adapter
    // invoke the adapter, await the response, and set the data
    // const getAPIStatus = async () => {
    //   const { healthy } = await getAPIHealth();
    //   setAPIHealth(healthy ? "api is up! :D" : "api is down :/");
    // };
    // second, after you've defined your getter above
    // invoke it immediately after its declaration, inside the useEffect callback
    // getAPIStatus();
  }, []);

  return (
    <div className="app-container">
      {/* <NavBar /> */}
      <Routes>
        <Route path="/" element={<h1>Home</h1>}></Route>
        {/* <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/user" element={<UserProfile />} />
        <Route path="/Logout" element={<LogOut />} />
        <Route path="/*" element={<Products />} />{" "} */}
      </Routes>
    </div>
  );
};

export default App;
