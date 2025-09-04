import {
  Home,
  Map,
  Pen,
  Folder,
  Settings,
  Github,
  Linkedin,
} from "lucide-react";
import logo from "../assets/LogoSB.png";
import { Button } from "./ui/button";
import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/", label: "Home", icon: Home },
  { to: "/maps", label: "Maps", icon: Map },
  { to: "/stratmaker", label: "StratMaker", icon: Pen },
  { to: "/strats", label: "Saved Strats", icon: Folder },
  { to: "/settings", label: "Settings", icon: Settings },
];

const MobileNavbar = {
  Header: () => (
    <div className="lg:hidden fixed top-0 left-0 w-full z-50 !bg-slate-900/95 !backdrop-blur-sm !border-b !border-slate-800/50 !px-4 !py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center shadow-lg">
          <img src={logo} alt="StratMap Logo" className="w-full" />
        </div>
        <span className="text-white font-bold text-lg">StratMap</span>
      </div>
      <div className="flex !gap-6 !p-2">
        <a
          href="https://github.com/Cmarsh205"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-500 hover:text-yellow-400 transition-colors"
        >
          <Github className="h-5 w-5" />
        </a>
        <a
          href="https://www.linkedin.com/in/carter-marsh-21b569184/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-500 hover:text-yellow-400 transition-colors"
        >
          <Linkedin className="h-5 w-5" />
        </a>
      </div>
    </div>
  ),
  Bottom: () => {
    const location = useLocation();
    return (
      <div className="lg:hidden fixed bottom-0 left-0 w-full z-50 !bg-slate-900/95 !backdrop-blur-sm !border-t !border-slate-800/50 !px-2 !py-2">
        <div className="flex items-center justify-around">
          {links.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <Link key={to} to={to} className="flex-1">
                <Button
                  variant="custom"
                  className={`
                    flex flex-col items-center !gap-1 !px-3 !py-2 !rounded-xl !font-medium transition-all duration-200 w-full
                    ${
                      isActive
                        ? "!bg-yellow-500/20 !text-yellow-400 !shadow-lg !shadow-yellow-500/25"
                        : "!text-slate-400 hover:!text-white hover:!bg-slate-800/50"
                    }
                  `}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="text-xs">{label}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    );
  },
};

export default MobileNavbar;
