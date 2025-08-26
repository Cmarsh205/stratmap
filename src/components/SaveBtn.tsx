import { useState, type RefObject } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { getSnapshot, type TLEditorSnapshot } from "tldraw";
import { Save } from "lucide-react";
import NameInputModal from "@/components/SaveModal";
import ConfirmationModal from "@/components/ConfirmationModal";

interface SaveCanvasButtonProps {
  store: any;
  mapNameRef: RefObject<string | null>;
}

const SaveCanvasButton = ({ store, mapNameRef }: SaveCanvasButtonProps) => {
  const { name } = useParams();
  const navigate = useNavigate();

  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const handleSaveClick = () => {
    if (name) {
      handleSave(name);
    } else {
      setIsNameModalOpen(true);
    }
  };

  const handleSave = (saveName: string) => {
    try {
      const trimmedName = saveName.trim();
      if (!trimmedName) {
        setConfirmationMessage("A name is required.");
        setIsConfirmationOpen(true);
        return;
      }

      const PERSISTENCE_KEY = `tldraw-strat:${trimmedName}`;

      const snapshot = getSnapshot(store) as TLEditorSnapshot & {
        meta?: { mapName?: string | null };
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

      setConfirmationMessage(
        name
          ? `Strat "${trimmedName}" updated successfully!`
          : `Strat "${trimmedName}" saved successfully!`
      );
      setIsConfirmationOpen(true);

      if (!name) {
        navigate(`/strats/${encodeURIComponent(trimmedName)}`);
      }
    } catch (err) {
      console.error("Error saving strat:", err);
      setConfirmationMessage("Failed to save strat.");
      setIsConfirmationOpen(true);
    }
  };

  return (
    <>
      {/* Save Button */}
      <Button
        onClick={handleSaveClick}
        className="!h-11 bg-gradient-to-r !from-yellow-400 !to-yellow-500 hover:!from-yellow-300 hover:!to-yellow-400 !text-slate-900 !font-semibold !py-2.5 !px-4 !rounded-xl !transition-all !duration-200 !flex !items-center !gap-2 !shadow-lg hover:!shadow-yellow-500/25"
      >
        <Save className="!w-4 !h-4" />
        Save
      </Button>

      <NameInputModal
        isOpen={isNameModalOpen}
        onClose={() => setIsNameModalOpen(false)}
        onConfirm={(inputName) => handleSave(inputName)}
        title="Save Your Strat"
        placeholder="Enter strat name"
        initialValue=""
        confirmText="Save"
        cancelText="Cancel"
        maxLength={50}
      />

      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={() => setIsConfirmationOpen(false)}
        title="Save Strat"
        message={confirmationMessage}
        confirmText="OK"
        cancelText=""
        type="info"
      />
    </>
  );
};

export default SaveCanvasButton;
