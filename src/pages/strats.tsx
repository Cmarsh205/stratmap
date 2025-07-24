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
    <div className="!min-h-screen !bg-gray-800 !p-8">
      <div className="max-w-4xl !mx-auto">
        <h1 className="!text-3xl !font-bold !text-yellow-400 !mb-6">
          Saved Strats
        </h1>

        {savedCanvases.length === 0 ? (
          <p className="text-gray-400">No saved strats found.</p>
        ) : (
          <ul className="space-y-4">
            {savedCanvases.map((key) => {
              const name = key.replace("tldraw-strat:", "");
              return (
                <li
                  key={key}
                  className="bg-gray-700 !rounded-xl !shadow-lg !p-3 !mb-4 !flex !items-center !justify-between !transition hover:!shadow-xl"
                >
                  <span className="!text-lg !font-semibold !text-yellow-400 !truncate !max-w-[60%]">
                    {name}
                  </span>
                  <div className="!flex !gap-2">
                    <Button
                      onClick={() => handleLoad(key)}
                      className="!bg-yellow-400 !text-gray-900 hover:!bg-yellow-300 !px-3 !py-2 !rounded-lg !flex !items-center !gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Load
                    </Button>
                    <Button
                      onClick={() => handleDelete(key)}
                      className="!bg-red-600 !text-white hover:!bg-red-500 !px-3 !py-2 !rounded-lg !flex !items-center !gap-2"
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
    </div>
  );
};

export default SavedCanvasesPage;
