import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import Dashboard from "./page/Dashboard";
import EditPage from "./page/EditPage";
import Home from "./page/Home";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={isSignedIn ? <Home /> : <Navigate to={"/dashboard"} />}
        />
        <Route
          path="/dashboard"
          element={!isSignedIn ? <Dashboard /> : <Navigate to={"/"} />}
        />
        <Route
          path="/Edit"
          element={!isSignedIn ? <EditPage /> : <Navigate to={"/dashboard"} />}
        />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
