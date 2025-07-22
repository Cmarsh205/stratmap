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
    <aside className="h-screen w-60 bg-gray-900 text-white flex flex-col justify-between shadow-lg">
      <div>
        <div className="flex justify-center py-8">
          <img
            src={logo}
            alt="StratMap Logo"
            className="h-10 w-40 !pt-8 !pb-8"
          />
        </div>

        <nav className="flex flex-col gap-4 px-6">
          <Link to="/">
            <Button
              variant="custom"
              className="w-full justify-start !px-6 !py-2 hover:!text-yellow-400"
            >
              <Home className="mr-2 h-4 w-4 text-inherit transition-colors" />
              Home
            </Button>
          </Link>

          <Link to="/maps">
            <Button
              variant="custom"
              className="w-full justify-start !px-6 !py-2 hover:!text-yellow-400"
            >
              <Map className="mr-2 h-4 w-4 text-inherit transition-colors" />
              Maps
            </Button>
          </Link>

          <Link to="/stratmaker">
            <Button
              variant="custom"
              className="w-full justify-start !px-6 !py-2 hover:!text-yellow-400"
            >
              <Pen className="mr-2 h-4 w-4 text-inherit transition-colors" />
              StratMaker
            </Button>
          </Link>

          <Link to="/strats">
            <Button
              variant="custom"
              className="w-full justify-start !px-6 !py-2 hover:!text-yellow-400"
            >
              <Folder className="mr-2 h-4 w-4 text-inherit transition-colors" />
              Saved Strats
            </Button>
          </Link>

          <Link to="/settings">
            <Button
              variant="custom"
              className="w-full justify-start !px-6 !py-2 hover:!text-yellow-400"
            >
              <Settings className="mr-2 h-4 w-4 text-inherit transition-colors" />
              Settings
            </Button>
          </Link>
        </nav>
      </div>

      <div className="flex justify-center gap-6 !pb-3">
        <a
          href="https://github.com/Cmarsh205"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:!text-yellow-400 transition-colors"
          aria-label="GitHub"
        >
          <Github className="h-5 w-5" />
        </a>

        <a
          href="https://www.linkedin.com/in/carter-marsh-21b569184/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:!text-yellow-400 transition-colors"
          aria-label="LinkedIn"
        >
          <Linkedin className="h-5 w-5" />
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
