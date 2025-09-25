import { Button } from "./ui/button";
import {
  Home,
  Map,
  Settings,
  Pen,
  Folder,
  Github,
  Linkedin,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/LogoSB.png";

const Sidebar = () => {
  const location = useLocation();

  const links = [
    { to: "/", label: "Home", icon: Home },
    { to: "/maps", label: "Maps", icon: Map },
    { to: "/stratmaker", label: "StratMaker", icon: Pen },
    { to: "/strats", label: "Saved Strats", icon: Folder },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-60.25 !bg-slate-900 !backdrop-blur-sm !text-slate-300 !border-r !border-slate-800/95 flex-col justify-between shadow-lg">
      <div>
        <div>
          <div className="!p-2 !border-b !border-slate-800/95 flex flex-col items-center">
          <img src={logo} alt="StratMap Logo" className="w-24 !pt-7 !pb-3" />
            <span className="text-white font-bold text-3xl !pb-3">StratMap</span>
          </div>
        </div>

        <nav className="flex flex-col !gap-6 !px-4 !pt-8 !text-lg !font-bold">
          {links.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to}>
              <Button
                variant="custom"
                className={`hover:cursor-pointer !w-full !flex !justify-start !gap-3 !px-4 !py-3 !rounded-xl !font-medium !transition-all !duration-200 ${
                  location.pathname === to
                    ? "!bg-yellow-500/20 !text-yellow-400 !shadow-lg !shadow-yellow-500/25"
                    : "!text-slate-300 hover:!text-white hover:!bg-slate-800/50"
                }`}
              >
                <Icon className="!mr-2 !h-6 !w-6" />
                {label}
              </Button>
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex justify-center gap-6 !p-4 !border-t !border-slate-800/95">
        <a
          href="https://github.com/Cmarsh205"
          target="_blank"
          rel="noopener noreferrer"
          className="!text-slate-500 hover:!text-yellow-400 transition-colors"
          aria-label="GitHub"
        >
          <Github className="h-5 w-5" />
        </a>

        <a
          href="https://www.linkedin.com/in/carter-marsh-21b569184/"
          target="_blank"
          rel="noopener noreferrer"
          className="!text-slate-500 hover:!text-yellow-400 transition-colors"
          aria-label="LinkedIn"
        >
          <Linkedin className="h-5 w-5" />
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
