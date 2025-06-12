import { Home, Map, LayoutDashboard, Settings, Link } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { name: "Home", icon: Home, path: "/" },
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Map", icon: Map, path: "/map" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

export default function Sidebar() {
  return (
    <TooltipProvider>
      <aside className="h-screen w-16 bg-gray-900 text-white flex flex-col items-center py-4 space-y-6 shadow-md">
        {navItems.map((item) => (
          <Tooltip key={item.name}>
            <TooltipTrigger asChild>
              <Link to={item.path}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-700"
                >
                  <item.icon className="h-5 w-5" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">{item.name}</TooltipContent>
          </Tooltip>
        ))}
      </aside>
    </TooltipProvider>
  );
}
