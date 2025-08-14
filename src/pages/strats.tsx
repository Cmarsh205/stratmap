import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Play,
  MapPin,
  Clock,
  Filter,
  Search,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mapsData } from "@/data/mapsData";

interface SavedStrat {
  key: string;
  name: string;
  thumbnail?: string;
  mapName?: string;
  savedAt?: string;
  savedAtRaw?: number;
}

const SavedCanvasesPage = () => {
  const [savedCanvases, setSavedCanvases] = useState<SavedStrat[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"newest" | "oldest" | "map">(
    "newest"
  );
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const keys = Object.keys(localStorage).filter(
      (key) => key.startsWith("tldraw-strat:") && !key.endsWith("default")
    );

    const canvases: SavedStrat[] = keys.map((key) => {
      const name = key.replace("tldraw-strat:", "");
      let thumbnail: string | undefined;
      let mapName: string | undefined;
      let savedAt: string | undefined;
      let savedAtRaw: number | undefined;

      try {
        const savedData = JSON.parse(localStorage.getItem(key) || "{}");

        mapName =
          savedData?.snapshot?.meta?.mapName || savedData?.mapName || undefined;

        const mapEntry = mapsData.find(
          (map) => map.name.toLowerCase() === mapName?.toLowerCase()
        );
        thumbnail = mapEntry?.thumbnail;

        const savedTime =
          savedData?.savedAt || savedData?.snapshot?.meta?.savedAt || undefined;

        savedAtRaw = savedTime ? new Date(savedTime).getTime() : undefined;

        savedAt = savedAtRaw
          ? new Date(savedAtRaw).toLocaleString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : undefined;
      } catch {
        thumbnail = undefined;
        savedAt = undefined;
        savedAtRaw = undefined;
      }

      return { key, name, thumbnail, mapName, savedAt, savedAtRaw };
    });

    setSavedCanvases(canvases);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setFilterMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLoad = (key: string) => {
    const name = key.replace("tldraw-strat:", "");
    navigate(`/strats/${encodeURIComponent(name)}`);
  };

  const handleDelete = (key: string) => {
    if (confirm("Are you sure you want to delete this strat?")) {
      localStorage.removeItem(key);
      setSavedCanvases((prev) => prev.filter((c) => c.key !== key));
    }
  };

  let filteredCanvases = savedCanvases.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filterType === "newest") {
    filteredCanvases = filteredCanvases.sort(
      (a, b) => (b.savedAtRaw || 0) - (a.savedAtRaw || 0)
    );
  } else if (filterType === "oldest") {
    filteredCanvases = filteredCanvases.sort(
      (a, b) => (a.savedAtRaw || 0) - (b.savedAtRaw || 0)
    );
  } else if (filterType === "map") {
    filteredCanvases = filteredCanvases.sort((a, b) =>
      (a.mapName || "").localeCompare(b.mapName || "")
    );
  }

  return (
    <div className="!min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 !p-8 !ml-60.25">
      <div className="!mx-auto">
        <h1 className="!text-4xl !font-bold !text-yellow-400 !mb-2">
          Saved Strats
        </h1>
        <h2 className="!text-lg !text-slate-300 !mb-6">
          Manage and load your tactical strategies
        </h2>

        <div className="!flex !gap-4 !mb-6">
          <div className="!flex-1 !relative">
            <Search className="!absolute !left-4 !top-1/2 !transform !-translate-y-1/2 !text-slate-400 !w-5 !h-5" />
            <input
              type="text"
              placeholder="Search strats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="!w-full !bg-slate-800/50 !border !border-slate-700/50 !rounded-xl !py-3 !pl-12 !pr-4 !text-white !placeholder-slate-400 focus:!outline-none focus:!ring-2 focus:!ring-yellow-500/80 focus:!border-yellow-500/80 !transition-all !duration-200"
            />
          </div>

          <div className="relative" ref={filterRef}>
            <Button
              className="!h-12.5 !bg-slate-800/50 !border !border-slate-700/50 hover:!border-slate-600/50 !text-slate-300 hover:!text-white !py-3 !px-6 !rounded-xl !transition-all !duration-200 !flex !items-center !gap-2"
              onClick={() => setFilterMenuOpen((prev) => !prev)}
            >
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline">Filter</span>
              <ChevronDown className="w-4 h-4" />
            </Button>

            {filterMenuOpen && (
              <div className="!absolute !right-0 !mt-2 !w-40 !bg-slate-800 !border !border-slate-700 !rounded-xl !shadow-lg !overflow-hidden !z-10">
                <button
                  onClick={() => {
                    setFilterType("newest");
                    setFilterMenuOpen(false);
                  }}
                  className={`!block !w-full !text-left !px-4 !py-2 !text-sm hover:!bg-slate-700 !text-slate-400 ${
                    filterType === "newest" ? "!bg-slate-700" : ""
                  }`}
                >
                  Newest First
                </button>
                <button
                  onClick={() => {
                    setFilterType("oldest");
                    setFilterMenuOpen(false);
                  }}
                  className={`!block !w-full !text-left !px-4 !py-2 !text-sm hover:!bg-slate-700 !text-slate-400 ${
                    filterType === "oldest" ? "!bg-slate-700" : ""
                  }`}
                >
                  Oldest First
                </button>
                <button
                  onClick={() => {
                    setFilterType("map");
                    setFilterMenuOpen(false);
                  }}
                  className={`!block !w-full !text-left !px-4 !py-2 !text-sm hover:!bg-slate-700 !text-slate-400 ${
                    filterType === "map" ? "!bg-slate-700" : ""
                  }`}
                >
                  By Map Name
                </button>
              </div>
            )}
          </div>
        </div>

        {filteredCanvases.length === 0 ? (
          <p className="!text-gray-400 text-lg">No saved strats found.</p>
        ) : (
          <div className="!grid !grid-cols-1 sm:!grid-cols-2 md:!grid-cols-4 !gap-8">
            {filteredCanvases.map(
              ({ key, name, thumbnail, mapName, savedAt }) => (
                <div
                  key={key}
                  className="group !bg-slate-800/50 !backdrop-blur-sm !rounded-2xl overflow-hidden !border !border-slate-700/50 hover:!border-slate-600/50 transition-all duration-300 hover:!shadow-2xl hover:!shadow-slate-900/50 hover:!scale-[1.02]"
                >
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={`${name} thumbnail`}
                      className="!w-full !h-48 !object-cover !transition-transform !duration-500 group-hover:!scale-110"
                    />
                  ) : (
                    <div className="!w-full h-48 !bg-gray-700 !flex !items-center !justify-center !text-gray-500 !text-sm">
                      No Map Thumbnail
                    </div>
                  )}

                  <div className="!p-4 !flex !flex-col !flex-grow">
                    <h2
                      className="!text-xl !font-bold !text-white !mb-2 group-hover:!text-yellow-400 !transition-colors !duration-200 !truncate"
                      title={name}
                    >
                      {name}
                    </h2>

                    <div className="flex justify-between">
                      {mapName && (
                        <p
                          className="!mt-1 !text-gray-300 !text-sm !truncate !flex !items-center !gap-1"
                          title={mapName}
                        >
                          <MapPin className="!w-4 !h-4 !text-gray-400" />
                          <span>{mapName}</span>
                        </p>
                      )}

                      {savedAt && (
                        <p className="!mt-1 !text-gray-400 !text-xs !italic !flex !items-center !gap-1">
                          <Clock className="!w-4 !h-4 !text-gray-400" />
                          {savedAt}
                        </p>
                      )}
                    </div>

                    <div className="!mt-auto !flex !gap-3 !pt-4">
                      <Button
                        onClick={() => handleLoad(key)}
                        className="!h-11 !flex-1 !bg-gradient-to-r !from-yellow-500 !to-yellow-600 hover:!from-yellow-400 hover:!to-yellow-500 !text-slate-900 !font-semibold !py-2.5 !px-4 !rounded-xl !transition-all !duration-200 !flex !items-center !justify-center !gap-2 !shadow-lg hover:!shadow-amber-500/25"
                      >
                        <Play className="!w-4 !h-4" />
                        Load
                      </Button>
                      <Button
                        onClick={() => handleDelete(key)}
                        className="!h-11 !px-4 !py-2.5 !bg-red-500/20 hover:!bg-red-500 !text-red-400 hover:!text-white border !border-red-500/30 hover:!border-red-500 !rounded-xl !transition-all !duration-200 !flex !items-center !justify-center"
                      >
                        <Trash2 className="!w-4 !h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedCanvasesPage;
