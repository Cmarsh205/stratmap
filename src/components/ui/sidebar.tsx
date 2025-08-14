import { Button } from "./button";
import {
  Home,
  Map,
  Settings,
  Pen,
  Folder,
  Github,
  Linkedin,
} from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/LogoSB.png";

const Sidebar = () => {
  return (
    <aside className="fixed top-0 left-0 h-screen w-60.25 !bg-slate-900 !backdrop-blur-sm !text-slate-300 !border-r !border-slate-800/95 flex flex-col justify-between shadow-lg">
      <div>
        <div className="!p-2 !border-b !border-slate-800/95 flex justify-center ">
          <img src={logo} alt="StratMap Logo" className="w-30 !pt-7 !pb-7" />
        </div>

        <nav className="flex flex-col gap-6 !px-4 !pt-8 !text-lg !font-bold">
          <Link to="/">
            <Button
              variant="custom"
              className="w-full justify-start !px-6 !py-2 hover:!text-yellow-400"
            >
              <Home className="!mr-2 !h-6 !w-6 transition-colors" />
              Home
            </Button>
          </Link>

          <Link to="/maps">
            <Button
              variant="custom"
              className="w-full justify-start !px-6 !py-2 hover:!text-yellow-400"
            >
              <Map className="!mr-2 !h-6 !w-6 transition-colors" />
              Maps
            </Button>
          </Link>

          <Link to="/stratmaker">
            <Button
              variant="custom"
              className="w-full justify-start !px-6 !py-2 hover:!text-yellow-400"
            >
              <Pen className="!mr-2 !h-6 !w-6 transition-colors" />
              StratMaker
            </Button>
          </Link>

          <Link to="/strats">
            <Button
              variant="custom"
              className="w-full justify-start !px-6 !py-2 hover:!text-yellow-400"
            >
              <Folder className="!mr-2 !h-6 !w-6 transition-colors" />
              Saved Strats
            </Button>
          </Link>

          <Link to="/settings">
            <Button
              variant="custom"
              className="w-full justify-start !px-6 !py-2 hover:!text-yellow-400"
            >
              <Settings className="!mr-2 !h-6 !w-6 transition-colors" />
              Settings
            </Button>
          </Link>
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
