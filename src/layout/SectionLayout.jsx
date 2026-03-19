import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function SectionLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-slate-950 min-h-screen">
        <Header />
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

