import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SavedCanvasesPage = () => {
  const [savedCanvases, setSavedCanvases] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const keys = Object.keys(localStorage).filter(
      (key) => key.startsWith("tldraw-strat:") && !key.endsWith("default")
    );
    setSavedCanvases(keys);
  }, []);

  const handleLoad = (key: string) => {
    const name = key.replace("tldraw-strat:", "");
    navigate(`/strats/${encodeURIComponent(name)}`);
  };

  const handleDelete = (key: string) => {
    if (confirm("Are you sure you want to delete this strat?")) {
      localStorage.removeItem(key);
      setSavedCanvases((prev) => prev.filter((k) => k !== key));
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Saved Strats</h1>

      {savedCanvases.length === 0 ? (
        <p className="text-gray-500">No saved strats found.</p>
      ) : (
        <ul className="space-y-4">
          {savedCanvases.map((key) => {
            const name = key.replace("tldraw-strat:", "");
            return (
              <li
                key={key}
                className="flex items-center justify-between bg-gray-100 p-4 rounded shadow"
              >
                <span className="font-medium text-gray-700">{name}</span>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleLoad(key)}
                    className="bg-blue-600 text-white hover:bg-blue-500 px-3 py-1 flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    Load
                  </Button>
                  <Button
                    onClick={() => handleDelete(key)}
                    className="bg-red-600 text-white hover:bg-red-500 px-3 py-1 flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SavedCanvasesPage;
