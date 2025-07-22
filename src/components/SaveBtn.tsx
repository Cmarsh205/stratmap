import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { getSnapshot } from "tldraw";

const SaveCanvasButton = () => {
  const editor = window.__tldraw_editor;
  const { name } = useParams();
  const PERSISTENCE_KEY = `tldraw-strat:${name ?? "default"}`;
  const handleSave = () => {
    if (!editor) return;

    if (name) {
      localStorage.setItem(
        PERSISTENCE_KEY,
        JSON.stringify(getSnapshot(editor.store))
      );
      alert(`Strat "${name}" updated!`);
      return;
    }

    const fallbackName = prompt("Enter a name for your strat:");
    if (!fallbackName) return;

    localStorage.setItem(
      `tldraw-strat:${fallbackName}`,
      JSON.stringify(getSnapshot(editor.store))
    );
    alert(`Strat "${fallbackName}" saved!`);
  };

  return (
    <Button
      onClick={handleSave}
      className="!bg-[#1E293B] !text-yellow-400 hover:!bg-[#334155] hover:!text-yellow-300 flex items-center !px-3 !rounded-md shadow group"
    >
      <Save className="w-4 h-4 text-yellow-400 group-hover:text-yellow-300" />
      Save
    </Button>
  );
};

export default SaveCanvasButton;
