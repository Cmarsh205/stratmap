import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";

const SaveCanvasButton = () => {
  const handleSave = () => {
    const editor = window.__tldraw_editor;
    if (!editor) return;

    const name = prompt("Enter a name for your canvas:");
    if (!name) return;

    const data = editor.store.serialize();
    localStorage.setItem(`tldraw-canvas:${name}`, JSON.stringify(data));

    alert(`Canvas "${name}" saved!`);
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