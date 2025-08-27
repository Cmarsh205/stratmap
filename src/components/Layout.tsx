import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/sidebar";
import MobileNavbar from "./MobileNavbar";

const Layout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white flex-col lg:flex-row">
      {/* Sidebar for desktop */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:!ml-60.25">
        {/* Mobile Header */}
        <MobileNavbar.Header />

        {/* Page content */}
        <div className="flex-1">
          <Outlet />
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileNavbar.Bottom />
      </div>
    </div>
  );
};

export default Layout;
