import { useState } from "react";
import { mapsData } from "../../mapsData";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

export default function MapsPage() {
  const [selectedMap, setSelectedMap] = useState<any>(null);
  const navigate = useNavigate();

  const handleFloorSelect = (floorImage: string) => {
    const confirmReplace = window.confirm(
      "⚠️ Warning: Adding a new map will start a new strat. Please save any existing work before continuing.\n\nDo you want to proceed?"
    );

    if (confirmReplace) {
      navigate(`/stratmaker?map=${encodeURIComponent(floorImage)}`);
    }
  };

  return (
    <div className="!p-6">
      <h1 className="!text-3xl !font-bold !mb-6 !text-center md:!text-left">
        Maps
      </h1>

      <div className="!grid !grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-4 !gap-6">
        {mapsData.map((map) => (
          <motion.div
            key={map.name}
            onClick={() => setSelectedMap(map)}
            className="!cursor-pointer !border !rounded-lg !shadow !overflow-hidden !bg-white dark:!bg-neutral-900"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 800 }}
          >
            <img
              src={map.thumbnail}
              alt={map.name}
              className="!w-full !h-48 !object-cover"
            />
            <div className="!p-3 !text-center !font-medium">{map.name}</div>
          </motion.div>
        ))}
      </div>

      <Dialog open={!!selectedMap} onOpenChange={() => setSelectedMap(null)}>
        <DialogContent className="!p-6 !max-w-lg">
          <AnimatePresence>
            {selectedMap && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="!text-xl !font-semibold !mb-4 !text-center md:!text-left">
                  {selectedMap.name} - Select Floor
                </h2>

                <div className="!grid !grid-cols-1 !sm:grid-cols-2 !gap-4">
                  {selectedMap.floors.map((floor: any) => (
                    <motion.div
                      key={floor.name}
                      onClick={() => handleFloorSelect(floor.image)}
                      className="!cursor-pointer !border !rounded-lg !overflow-hidden !bg-white dark:!bg-neutral-800"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 800 }}
                    >
                      <img
                        src={floor.image}
                        alt={floor.name}
                        className="!w-full !h-32 !object-cover"
                      />
                      <div className="!p-2 !text-center !text-sm !font-medium">
                        {floor.name}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  );
}
