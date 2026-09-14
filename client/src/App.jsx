import React from "react";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Protectedlayout from "./components/Protectedlayout";

import Dashboard from "./pages/Dashboard";
import Sessions from "./pages/Sessions";
import Pricing from "./pages/Pricing";
import MeetingRoom from "./pages/MeetingRoom";

import Features from "./pages/Features";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Faq from "./pages/Faq";

const App = () => {
  return (
    <>
      <Toaster />

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login mode="login" />} />
        <Route path="/register" element={<Login mode="register" />} />

        {/* Public Pages */}
        <Route element={<Protectedlayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/privacy" element={<Privacy />} />
        </Route>

        {/* Private Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Protectedlayout />}>
            <Route path="/sessions" element={<Sessions />} />
          </Route>

          <Route path="/meeting/:meetingId" element={<MeetingRoom />} />
        </Route>

        {/* Other Routes */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
};

export default App;
