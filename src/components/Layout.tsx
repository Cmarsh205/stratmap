import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/components/sidebar";
import MobileNavbar from "./MobileNavbar";

const Layout: React.FC = () => {
  const location = useLocation();
  const isStratmaker = location.pathname.includes("/stratmaker");

  // Only apply top/bottom padding for non-Stratmaker pages
  const contentPaddingClasses = isStratmaker
    ? ""
    : "!pt-12 !pb-12 lg:!pt-0 lg:!pb-0";

  return (
    <div className="flex min-h-screen bg-slate-950 text-white flex-col lg:flex-row">
      {/* Sidebar for desktop */}
      <Sidebar />

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col lg:!ml-60.25 ${contentPaddingClasses}`}
      >
        {/* Mobile Header */}
        <div className="lg:hidden">
          <MobileNavbar.Header />
        </div>

        {/* Page content */}
        <div className="flex-1 h-[calc(100vh-8rem)] lg:h-auto">
          <Outlet />
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden">
          <MobileNavbar.Bottom />
        </div>
      </div>
    </div>
  );
};

export default Layout;
