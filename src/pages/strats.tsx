import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Play,
  Clock,
  Filter,
  Search,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { mapsData } from "@/data/mapsData";
import ConfirmationModal from "@/components/ConfirmationModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost";

interface SavedStrat {
  id: string;
  name: string;
  thumbnail?: string;
  mapName?: string;
  savedAt?: string;
  savedAtRaw?: number;
  floorImage?: string;
}

interface StratmapRow {
  id: string;
  title: string;
  description: string;
  created_at?: string;
  updated_at?: string;
  data?: { mapName?: string; floorImage?: string };
}

const getThumbnailByMapName = (
  mapName: string | undefined,
): string | undefined => {
  if (!mapName?.trim()) return undefined;
  const normalized = mapName.trim().toLowerCase();
  const map = mapsData.find((m) => m.name.toLowerCase() === normalized);
  return map?.thumbnail;
};

const getThumbnailByFloorImage = (
  floorImage: string | undefined,
): string | undefined => {
  if (!floorImage?.trim()) return undefined;
  const normalized = floorImage.trim();
  const pathPart = normalized.includes("/maps/")
    ? normalized.slice(normalized.indexOf("/maps/"))
    : normalized;
  const map = mapsData.find((m) =>
    m.floors.some((f) => f.image === pathPart || f.image === normalized),
  );
  return map?.thumbnail;
};

const rowToSavedStrat = (row: StratmapRow): SavedStrat => {
  const mapName = row.description || row.data?.mapName || undefined;
  const floorImage = row.data?.floorImage;
  const thumbnail =
    getThumbnailByMapName(mapName) ?? getThumbnailByFloorImage(floorImage);
  const updatedAt = row.updated_at || row.created_at;
  const savedAtRaw = updatedAt ? new Date(updatedAt).getTime() : undefined;
  const savedAt = savedAtRaw
    ? new Date(savedAtRaw).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : undefined;
  return {
    id: row.id,
    name: row.title,
    thumbnail,
    mapName,
    savedAt,
    savedAtRaw,
    floorImage: undefined,
  };
};

const SavedCanvasesPage = () => {
  const [savedCanvases, setSavedCanvases] = useState<SavedStrat[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"newest" | "oldest" | "map">(
    "newest",
  );
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadState, setLoadState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [loadError, setLoadError] = useState<string | null>(null);
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated) {
      setSavedCanvases([]);
      setLoadState("success");
      return;
    }

    let cancelled = false;
    setLoadState("loading");
    setLoadError(null);

    getAccessTokenSilently()
      .then((token) =>
        fetch(`${API_URL}/api/v1/stratmaps`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      )
      .then(async (res) => {
        if (!res.ok) {
          const isNetworkError = res.type === "error" || res.status === 0;
          if (isNetworkError || res.status === 404) {
            throw new Error(
              "Could not reach the API. Make sure the API is running and VITE_API_URL in .env points to it (e.g. http://localhost).",
            );
          }
          if (res.status === 401) {
            throw new Error("Please log in again.");
          }
          let msg = "Failed to load strats.";
          try {
            const body = await res.json();
            if (body?.message) msg = body.message;
            if (body?.error) msg = body.error;
          } catch {
            msg = res.statusText || msg;
          }
          throw new Error(msg);
        }
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;
        const rows: StratmapRow[] = json.data ?? [];
        setSavedCanvases(rows.map(rowToSavedStrat));
        setLoadState("success");
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Error loading strats:", err);
        const message =
          err instanceof Error
            ? err.message
            : String(err).startsWith("Failed to fetch")
              ? "Could not reach the API. Make sure the API is running and VITE_API_URL in .env points to it (e.g. http://localhost)."
              : "Failed to load strats.";
        setLoadError(message);
        setLoadState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, getAccessTokenSilently]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setFilterMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLoad = (strat: SavedStrat) => {
    navigate(`/stratmaker/${encodeURIComponent(strat.name)}`, {
      state: { stratId: strat.id },
    });
  };

  const handleDelete = (id: string) => {
    setDeleteTargetId(id);
    setDeleteError(null);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteTargetId(null);
    setDeleteError(null);
    setIsDeleting(false);
  };

  const confirmDelete = async () => {
    if (deleteTargetId === null) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(`${API_URL}/api/v1/stratmaps/${deleteTargetId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const msg =
          body?.message ??
          body?.error ??
          (res.status === 401
            ? "Please log in again."
            : "Failed to delete strat.");

        throw new Error(msg);
      }
      setSavedCanvases((prev) => prev.filter((c) => c.id !== deleteTargetId));
      closeDeleteModal();
    } catch (err) {
      console.error("Error deleting strat:", err);
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete strat.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  let filteredCanvases = savedCanvases.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (filterType === "newest") {
    filteredCanvases = filteredCanvases.sort(
      (a, b) => (b.savedAtRaw || 0) - (a.savedAtRaw || 0),
    );
  } else if (filterType === "oldest") {
    filteredCanvases = filteredCanvases.sort(
      (a, b) => (a.savedAtRaw || 0) - (b.savedAtRaw || 0),
    );
  } else if (filterType === "map") {
    filteredCanvases = filteredCanvases.sort((a, b) =>
      (a.mapName || "").localeCompare(b.mapName || ""),
    );
  }

  return (
    <div className="!min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 !p-8">
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
              className="hover:cursor-pointer !h-12.5 !bg-slate-800/50 !border !border-slate-700/50 hover:!border-slate-600/50 !text-slate-300 hover:!text-white !py-3 !px-6 !rounded-xl !transition-all !duration-200 !flex !items-center !gap-2"
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

        {loadState === "loading" ? (
          <div className="!flex !items-center !justify-center !gap-2 !py-16 !text-slate-400">
            <Loader2 className="!w-6 !h-6 animate-spin" />
            <span>Loading strats…</span>
          </div>
        ) : !isAuthenticated ? (
          <p className="!text-gray-400 text-lg">
            Log in to view and manage your saved strats.
          </p>
        ) : loadState === "error" ? (
          <p className="!text-red-400 text-lg">
            {loadError ?? "Failed to load strats."}
          </p>
        ) : filteredCanvases.length === 0 ? (
          <p className="!text-gray-400 text-lg">No saved strats found.</p>
        ) : (
          <div className="!grid !grid-cols-1 sm:!grid-cols-2 md:!grid-cols-3 lg:!grid-cols-4 !gap-8">
            {filteredCanvases.map(
              ({ id, name, thumbnail, mapName, savedAt, savedAtRaw }) => (
                <div
                  key={id}
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
                      {savedAt && (
                        <p className="!mt-1 !text-gray-400 !text-xs !italic !flex !items-center !gap-1">
                          <Clock className="!w-4 !h-4 !text-gray-400" />
                          {savedAt}
                        </p>
                      )}
                    </div>

                    <div className="!mt-auto !flex !gap-3 !pt-4">
                      <Button
                        onClick={() =>
                          handleLoad({
                            id,
                            name,
                            thumbnail,
                            mapName,
                            savedAt,
                            savedAtRaw,
                          })
                        }
                        className="hover:cursor-pointer !h-11 !flex-1 !bg-gradient-to-r !from-yellow-500 !to-yellow-600 hover:!from-yellow-400 hover:!to-yellow-500 !text-slate-900 !font-semibold !py-2.5 !px-4 !rounded-xl !transition-all !duration-200 !flex !items-center !justify-center !gap-2 !shadow-lg hover:!shadow-amber-500/25"
                      >
                        <Play className="!w-4 !h-4" />
                        Load
                      </Button>
                      <Button
                        onClick={() => handleDelete(id)}
                        className="hover:cursor-pointer !h-11 !px-4 !py-2.5 !bg-red-500/20 hover:!bg-red-500 !text-red-400 hover:!text-white border !border-red-500/30 hover:!border-red-500 !rounded-xl !transition-all !duration-200 !flex !items-center !justify-center"
                      >
                        <Trash2 className="!w-4 !h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </div>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Delete Strat?"
        message={
          deleteError ??
          "Are you sure you want to delete this strat? This action cannot be undone."
        }
        confirmText={isDeleting ? "Deleting…" : "Delete"}
        cancelText="Cancel"
        type="danger"
        confirmDisabled={isDeleting}
      />
    </div>
  );
};

export default SavedCanvasesPage;
