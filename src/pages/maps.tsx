import { useState } from "react";
import { mapsData } from "../data/mapsData";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmationModal from "@/components/ConfirmationModal";

export default function MapsPage() {
  const [selectedMap, setSelectedMap] = useState<{
    name: string;
    floors: { name: string; image: string }[];
  } | null>(null);
  const [pendingFloorImage, setPendingFloorImage] = useState<string | null>(
    null
  );
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const navigate = useNavigate();

  const handleFloorSelect = (floorImage: string) => {
    setSelectedMap(null);
    setPendingFloorImage(floorImage);
    setIsConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (pendingFloorImage) {
      navigate(`/stratmaker?mapImage=${encodeURIComponent(pendingFloorImage)}`);
      setPendingFloorImage(null);
    }
    setIsConfirmOpen(false);
  };

  const handleCancel = () => {
    setPendingFloorImage(null);
    setIsConfirmOpen(false);
  };

  return (
    <div className="!p-8 !flex-1 !bg-gradient-to-br !from-slate-900 !via-slate-800 !to-slate-900 !min-h-screen">
      <h1 className="!text-4xl !font-bold !bg-gradient-to-r !from-yellow-400 !to-yellow-600 !bg-clip-text !text-transparent !mb-2">
        Maps
      </h1>
      <p className="!text-slate-400 !text-lg !mb-8">
        Choose your map and get started
      </p>

      <div className="!grid !grid-cols-1 md:!grid-cols-2 xl:!grid-cols-3 2xl:!grid-cols-4 !gap-6">
        {mapsData.map((map) => (
          <div
            key={map.name}
            onClick={() => setSelectedMap(map)}
            className="group !bg-slate-800/50 !rounded-2xl !overflow-hidden !border !border-slate-700/50 hover:!border-slate-600/50 !transition-all !duration-300 hover:!shadow-2xl hover:!shadow-slate-900/50 hover:!scale-[1.02]"
          >
            <img
              src={map.thumbnail}
              alt={map.name}
              className="!w-full !h-48 !object-cover"
            />
            <div className="!group !p-3 !text-center !font-medium !text-white group-hover:!text-yellow-400">
              {map.name}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedMap} onOpenChange={() => setSelectedMap(null)}>
        <DialogContent className="!p-6 !max-w-lg !flex-1 !bg-gradient-to-br !from-slate-900 !via-slate-800 !to-slate-900 !text-yellow-400">
          <AnimatePresence>
            {selectedMap && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="!text-xl !font-semibold !mb-4 !text-center md:!text-left !text-yellow-400">
                  {selectedMap.name} - Select Floor
                </h2>

                <div className="!grid !grid-cols-1 !gap-4">
                  {selectedMap.floors.map(
                    (floor: { name: string; image: string }) => (
                      <motion.div
                        key={floor.name}
                        onClick={() => handleFloorSelect(floor.image)}
                        className="!bg-slate-800/50 !rounded-2xl !overflow-hidden !border !border-slate-700/50 hover:!border-slate-600/50 !transition-all !duration-300 hover:!shadow-2xl hover:!shadow-slate-900/50 hover:!scale-[1.02]"
                      >
                        <div className="group">
                          <img
                            src={floor.image}
                            alt={floor.name}
                            className="!w-full !h-32 !object-cover"
                          />
                          <div className="!p-2 !text-center !text-sm !font-medium !text-white group-hover:!text-yellow-400">
                            {floor.name}
                          </div>
                        </div>
                      </motion.div>
                    )
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title="Replace Current Strat?"
        message="Adding a new map will start a new strat. Please save any existing work before continuing."
        confirmText="Proceed"
        cancelText="Cancel"
        type="warning"
      />
    </div>
  );
}
