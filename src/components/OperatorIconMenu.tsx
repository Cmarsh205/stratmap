import { useState } from "react";
import operators from "r6operators";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const OperatorSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => setCollapsed((prev) => !prev);

  const operatorsArray = Object.values(operators);
  const attackers = operatorsArray.filter((op) => op.role === "Attacker");
  const defenders = operatorsArray.filter((op) => op.role === "Defender");

  const handleDragStart = (e: React.DragEvent, imageUrl: string) => {
    e.dataTransfer.setData("operator-icon", imageUrl);
  };

  const getIconPath = (id: string) => `/operators/${id.toLowerCase()}.png`;

  return (
    <div
      className={`fixed top-5 left-60 h-[98%] max-h-[100%] bg-white border-r z-50 shadow-md flex flex-col items-center pt-4 transition-all duration-300 ease-in-out ${
        collapsed ? "w-0" : "w-35"
      }`}
    >
      <Button
        variant="ghost"
        size="sm"
        className="absolute -right-4.5 top-1/2 -translate-y-1/2 rounded-full shadow-md p-1"
        onClick={toggleCollapsed}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </Button>

      {!collapsed && (
        <div className="flex-grow flex flex-col justify-center w-full px-4 overflow-y-auto">
          <section className="text-center mb-12">
            <h2 className="font-extrabold text-xl mb-6 border-b-2 border-yellow-500 pb-2">
              Attackers
            </h2>
            <div className="grid grid-cols-3 gap-3 justify-center">
              {attackers.map((op) => (
                <img
                  key={op.id}
                  src={getIconPath(op.id)}
                  alt={op.name}
                  title={op.name}
                  draggable
                  onDragStart={(e) => handleDragStart(e, getIconPath(op.id))}
                  className="w-12 h-12 rounded-lg shadow hover:scale-110 transition-transform cursor-grab mx-auto p-0.5 bg-gray-50"
                />
              ))}
            </div>
          </section>

          <section className="text-center">
            <h2 className="font-extrabold text-xl mb-6 border-b-2 border-blue-600 pb-2">
              Defenders
            </h2>
            <div className="grid grid-cols-3 gap-3 justify-center">
              {defenders.map((op) => (
                <img
                  key={op.id}
                  src={getIconPath(op.id)}
                  alt={op.name}
                  title={op.name}
                  draggable
                  onDragStart={(e) => handleDragStart(e, getIconPath(op.id))}
                  className="w-12 h-12 rounded-lg shadow hover:scale-110 transition-transform cursor-grab mx-auto p-0.5 bg-gray-50"
                />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default OperatorSidebar;
