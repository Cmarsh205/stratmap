import { useState } from "react";
import operators from "r6operators";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

const OperatorSidebar = () => {
  const [open, setOpen] = useState<string[]>(["attackers", "defenders"]);

  const operatorsArray = Object.values(operators);
  const attackers = operatorsArray.filter((op) => op.role === "Attacker");
  const defenders = operatorsArray.filter((op) => op.role === "Defender");

  const handleDragStart = (e: React.DragEvent, imageUrl: string) => {
    e.dataTransfer.setData("operator-icon", imageUrl);
  };

  const getIconPath = (id: string) => `/operators/${id.toLowerCase()}.png`;

  return (
    <div className="w-24 bg-white h-screen shadow-lg border-r z-50 p-2">
      <Accordion
        type="multiple"
        value={open}
        onValueChange={setOpen}
        className="space-y-2"
      >
        <AccordionItem value="attackers">
          <AccordionTrigger className="text-sm font-semibold">
            Attackers
          </AccordionTrigger>
          <AccordionContent>
            <ScrollArea className="h-64 pr-1">
              <div className="grid grid-cols-3 gap-2">
                {attackers.map((op) => (
                  <img
                    key={op.id}
                    src={getIconPath(op.id)}
                    alt={op.name}
                    title={op.name}
                    draggable
                    onDragStart={(e) => handleDragStart(e, getIconPath(op.id))}
                    className="w-8 h-8 rounded hover:scale-110 transition"
                  />
                ))}
              </div>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="defenders">
          <AccordionTrigger className="text-sm font-semibold">
            Defenders
          </AccordionTrigger>
          <AccordionContent>
            <ScrollArea className="h-64 pr-1">
              <div className="grid grid-cols-3 gap-2">
                {defenders.map((op) => (
                  <img
                    key={op.id}
                    src={getIconPath(op.id)}
                    alt={op.name}
                    title={op.name}
                    draggable
                    onDragStart={(e) => handleDragStart(e, getIconPath(op.id))}
                    className="w-8 h-8 rounded hover:scale-110 transition"
                  />
                ))}
              </div>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default OperatorSidebar;
