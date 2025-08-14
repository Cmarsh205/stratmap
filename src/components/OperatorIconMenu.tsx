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
      className={`fixed top left-60 h-[100%] max-h-[100%] !bg-slate-900 !border-l !border-slate-800/95 z-50 !shadow-md !flex !flex-col !items-center !pt-8 transition-all duration-300 ease-in-out ${
        collapsed ? "w-0" : "w-35"
      }`}
    >
      <Button
        variant="ghost"
        size="sm"
        className="absolute -right-4 top-1/2 -translate-y-1/2 rounded-full shadow-md p-1 !bg-yellow-400 !text-gray-800"
        onClick={toggleCollapsed}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </Button>

      {!collapsed && (
        <div className="flex-grow flex flex-col justify-center w-full !px-3 !overflow-y-auto">
          <section className="text-center mb-12">
            <h2 className="!font-extrabold !text-xl !mb-5 !border-b-2 !border-red-600 !pb-2 text-yellow-400">
              Attackers
            </h2>
            <div className="grid grid-cols-3 gap-2 justify-center">
              {attackers.map((op) => (
                <img
                  key={op.id}
                  src={getIconPath(op.id)}
                  alt={op.name}
                  title={op.name}
                  draggable
                  onDragStart={(e) => handleDragStart(e, getIconPath(op.id))}
                  className="w-12 h-12 rounded-lg shadow hover:scale-110 transition-transform cursor-grab mx-auto p-0.5 bg-[#888888]"
                />
              ))}
            </div>
          </section>

          <section className="text-center">
            <h2 className="!font-extrabold !text-xl !mb-5 !mt-5 !border-b-2 !border-blue-600 !pb-2 text-yellow-400">
              Defenders
            </h2>
            <div className="grid grid-cols-3 gap-2 justify-center">
              {defenders.map((op) => (
                <img
                  key={op.id}
                  src={getIconPath(op.id)}
                  alt={op.name}
                  title={op.name}
                  draggable
                  onDragStart={(e) => handleDragStart(e, getIconPath(op.id))}
                  className="w-12 h-12 rounded-lg shadow hover:scale-150 transition-transform cursor-grab p-0.5 bg-[#888888]"
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
