import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Protectedlayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans bg-[url('/layout_bg.png')] bg-cover bg-center bg-no-repeat">
      <Navbar />

      <div className="flex-1">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};

export default Protectedlayout;
