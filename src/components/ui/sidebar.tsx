import { Button } from "./button";
import { Home, Map, Settings, Pen, Folder } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/LogoSB.png";

const Sidebar = () => {
  return (
    <aside className="h-screen w-60 bg-gray-900 text-white flex flex-col p-4 shadow-lg">
      <div className="mb-8">
        <img src={logo} alt="StratMap Logo" className="h-10 w-40 mx-auto" />
      </div>
      <nav className="flex flex-col gap-4">
        <Link to="/">
          <Button
            variant="ghost"
            className="w-full justify-start text-white pl-4"
          >
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
        </Link>
        <Link to="/maps">
          <Button
            variant="ghost"
            className="w-full justify-start text-white pl-4"
          >
            <Map className="mr-2 h-4 w-4" />
            Maps
          </Button>
        </Link>
        <Link to="/stratmaker">
          <Button
            variant="ghost"
            className="w-full justify-start text-white pl-4"
          >
            <Pen className="mr-2 h-4 w-4" />
            StratMaker
          </Button>
        </Link>
        <Link to="/strats">
          <Button
            variant="ghost"
            className="w-full justify-start text-white pl-4"
          >
            <Folder className="mr-2 h-4 w-4" />
            Saved Strats
          </Button>
        </Link>
        <Link to="/settings">
          <Button
            variant="ghost"
            className="w-full justify-start text-white pl-4"
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
