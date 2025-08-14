import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { getSnapshot, type TLEditorSnapshot } from "tldraw";
import { Save } from "lucide-react";
import { type RefObject } from "react";

interface SaveCanvasButtonProps {
  store: any;
  mapNameRef: RefObject<string | null>;
}

const SaveCanvasButton = ({ store, mapNameRef }: SaveCanvasButtonProps) => {
  const { name } = useParams();
  const navigate = useNavigate();

  const handleSave = () => {
    try {
      const saveName = prompt(
        "Enter a name for your strat:",
        name || "New Strat"
      )?.trim();

      if (!saveName) {
        alert("Save cancelled: A name is required.");
        return;
      }

      const PERSISTENCE_KEY = `tldraw-strat:${saveName}`;

      const snapshot = getSnapshot(store) as TLEditorSnapshot & {
        meta?: { mapImage?: string | null; mapName?: string | null };
      };

      snapshot.meta = {
        ...(snapshot.meta || {}),
        mapName: mapNameRef.current || snapshot.meta?.mapName || null,
      };

      const saveData = {
        snapshot,
        mapName: mapNameRef.current || snapshot.meta?.mapName || null,
        savedAt: new Date().toISOString(),
      };

      localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(saveData));

      alert(`Strat "${saveName}" saved successfully!`);
      navigate(`/strats/${encodeURIComponent(saveName)}`);
    } catch (err) {
      console.error("Error saving strat:", err);
      alert("Failed to save strat.");
    }
  };

  return (
    <Button
      onClick={handleSave}
      className="!h-11 bg-gradient-to-r !from-yellow-400 !to-yellow-500 hover:!from-yellow-300 hover:!to-yellow-400 !text-slate-900 !font-semibold !py-2.5 !px-4 !rounded-xl !transition-all !duration-200 !flex !items-center !gap-2 !shadow-lg hover:!shadow-amber-500/25"
    >
      <Save className="!w-4 !h-4" />
      Save
    </Button>
  );
};

export default SaveCanvasButton;
