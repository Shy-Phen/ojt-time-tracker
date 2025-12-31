import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./page/Dashboard";
import Home from "./page/Home";
import AuthPage from "./page/auth/AuthPage";
import Settings from "@/page/Settings";
import { useGetTime } from "./hooks/useTime";
import { Toaster } from "sonner";
import { authClient } from "./Lib/auth-client";

const App = () => {
  const { data: session, isPending } = authClient.useSession();
  const { isPending: isGettingTIme, isLoading } = useGetTime();

  if (isPending || isGettingTIme || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-infinity loading-xl"></span>
      </div>
    );
  }
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            session?.user ? <Home /> : <Navigate to="/dashboard" replace />
          }
        />
        <Route
          path="/dashboard"
          element={!session?.user ? <Dashboard /> : <Navigate to="/" replace />}
        />

        <Route path="/auth/:pathname" element={<AuthPage />} />
        <Route
          path="/account/settings"
          element={session?.user ? <Settings /> : <Navigate to="/dashboard" />}
        />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
