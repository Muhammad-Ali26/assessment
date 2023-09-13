import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import Comment from "./views/Comment";

export default function App() {
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route exact path="/" element={<Comment />} />
        </Routes>
      </Router>
    </>
  );
}
