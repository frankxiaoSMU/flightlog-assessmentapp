import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signin from "./Signin";
import Homepage from "./Homepage";
import Createlog from "./Createlog";
import Editlog from "./Editlog";

function App() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Signin />;
  }

  return (
    <div className="wrapper">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Homepage />}>
            {" "}
          </Route>{" "}
          <Route exact path="/createlog" element={<Createlog />}>
            {" "}
          </Route>{" "}
          <Route exact path="/editlog" element={<Editlog />}>
            {" "}
          </Route>{" "}
        </Routes>{" "}
      </BrowserRouter>{" "}
    </div>
  );
}

export default App;
