import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";

const SaveCanvasButton = () => {
  const editor = window.__tldraw_editor;
  const { name } = useParams();

  const handleSave = () => {
    if (!editor) return;

    if (name) {
      const data = editor.store.getSnapshot();
      localStorage.setItem(`tldraw-strat:${name}`, JSON.stringify(data));
      alert(`Strat "${name}" updated!`);
      return;
    }

    const fallbackName = prompt("Enter a name for your strat:");
    if (!fallbackName) return;

    const data = editor.store.getSnapshot();
    localStorage.setItem(`tldraw-strat:${fallbackName}`, JSON.stringify(data));
    alert(`Strat "${fallbackName}" saved!`);
  };

  return (
    <Button
      onClick={handleSave}
      className="bg-[#1E293B] text-yellow-400 hover:bg-[#334155] hover:text-yellow-300 flex items-center gap-2 px-4 py-2 rounded-md shadow group"
    >
      <Save className="w-4 h-4 text-yellow-400 group-hover:text-yellow-300" />
      Save
    </Button>
  );
};

export default SaveCanvasButton;
