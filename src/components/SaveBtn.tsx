import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { getSnapshot, type TLEditorSnapshot } from "tldraw";
import { Save } from "lucide-react";
import { type RefObject } from "react";

interface SaveCanvasButtonProps {
  store: any;
  mapImageRef: RefObject<string | null>;
}

const SaveCanvasButton = ({ store, mapImageRef }: SaveCanvasButtonProps) => {
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
        meta?: { mapImage?: string | null };
      };

      snapshot.meta = {
        ...(snapshot.meta || {}),
        mapImage: mapImageRef.current || snapshot.meta?.mapImage || null,
      };

      localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(snapshot));

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
      className="!bg-yellow-400 !text-gray-900 hover:!bg-yellow-300 !px-3 !py-2 !rounded-lg !flex !items-center !gap-2"
    >
      <Save className="!w-4 !h-4" />
      Save
    </Button>
  );
};

export default SaveCanvasButton;
