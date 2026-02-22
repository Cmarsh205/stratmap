import { useState, type RefObject } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { getSnapshot } from "tldraw";
import type { TLStore } from "tldraw";
import { Save, Loader2 } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import NameInputModal from "@/components/SaveModal";
import ConfirmationModal from "@/components/ConfirmationModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost";

interface SaveCanvasButtonProps {
  store: TLStore;
  mapNameRef: RefObject<string | null>;
  floorImageRef: RefObject<string | null>;
  stratIdRef?: RefObject<string | null>;
}

interface StratmapResponse {
  id: string;
  title: string;
  description: string;
}

const SaveCanvasButton = ({
  store,
  mapNameRef,
  floorImageRef,
  stratIdRef,
}: SaveCanvasButtonProps) => {
  const { name } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveClick = () => {
    if (!isAuthenticated) {
      setConfirmationMessage("Please log in to save strats.");
      setIsConfirmationOpen(true);
      return;
    }
    if (name) {
      handleSave(name);
    } else {
      setIsNameModalOpen(true);
    }
  };

  const handleSave = async (saveName: string) => {
    const trimmedName = saveName.trim();
    if (!trimmedName) {
      setConfirmationMessage("A name is required.");
      setIsConfirmationOpen(true);
      return;
    }

    setIsSaving(true);
    try {
      const mapName = mapNameRef.current ?? "";
      const snapshot = getSnapshot(store);
      const floorImage = floorImageRef.current ?? null;

      const body = {
        title: trimmedName,
        description: mapName,
        data: {
          snapshot,
          mapName: mapName || null,
          floorImage,
        },
      };

      let token: string;
      try {
        token = await getAccessTokenSilently();
      } catch {
        setConfirmationMessage("Please log in to save strats.");
        setIsConfirmationOpen(true);
        setIsSaving(false);
        return;
      }

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      if (name && name === trimmedName) {
        const existingId = stratIdRef?.current;
        if (existingId) {
          const res = await fetch(`${API_URL}/api/v1/stratmaps/${existingId}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(body),
          });
          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.message || "Failed to update strat.");
          }
        } else {
          const listRes = await fetch(`${API_URL}/api/v1/stratmaps`, { headers });
          if (!listRes.ok) {
            const errData = await listRes.json().catch(() => ({}));
            throw new Error(errData.message || "Failed to load strats.");
          }
          const listJson = await listRes.json();
          const stratmaps: StratmapResponse[] = listJson.data ?? [];
          const existing = stratmaps.find((s) => s.title === trimmedName);

          if (existing) {
            const res = await fetch(`${API_URL}/api/v1/stratmaps/${existing.id}`, {
              method: "PUT",
              headers,
              body: JSON.stringify(body),
            });
            if (!res.ok) {
              const errData = await res.json().catch(() => ({}));
              throw new Error(errData.message || "Failed to update strat.");
            }
            stratIdRef && (stratIdRef.current = existing.id);
          } else {
            const res = await fetch(`${API_URL}/api/v1/stratmaps`, {
              method: "POST",
              headers,
              body: JSON.stringify(body),
            });
            if (!res.ok) {
              const errData = await res.json().catch(() => ({}));
              throw new Error(errData.message || "Failed to save strat.");
            }
            const createdJson = await res.json();
            stratIdRef && (stratIdRef.current = createdJson?.data?.id);
          }
        }
      } else {
        const res = await fetch(`${API_URL}/api/v1/stratmaps`, {
          method: "POST",
          headers,
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Failed to save strat.");
        }
        const createdJson = await res.json();
        setConfirmationMessage(`Strat "${trimmedName}" saved successfully!`);
        setIsConfirmationOpen(true);
        navigate(`/stratmaker/${encodeURIComponent(trimmedName)}`, {
          state: { stratId: createdJson?.data?.id },
        });
        return;
      }

      setConfirmationMessage(
        name && name === trimmedName
          ? `Strat "${trimmedName}" updated successfully!`
          : `Strat "${trimmedName}" saved successfully!`
      );
      setIsConfirmationOpen(true);
    } catch (err) {
      console.error("Error saving strat:", err);
      setConfirmationMessage(
        err instanceof Error ? err.message : "Failed to save strat."
      );
      setIsConfirmationOpen(true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleSaveClick}
        disabled={isSaving}
        className="hover:cursor-pointer !h-11 bg-gradient-to-r !from-yellow-400 !to-yellow-500 hover:!from-yellow-300 hover:!to-yellow-400 !text-slate-900 !font-semibold !py-2.5 !px-4 !rounded-xl !transition-all !duration-200 !flex !items-center !gap-2 !shadow-lg hover:!shadow-yellow-500/25 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSaving ? (
          <Loader2 className="!w-4 !h-4 animate-spin" />
        ) : (
          <Save className="!w-4 !h-4" />
        )}
        <span className="hidden lg:inline">{isSaving ? "Saving…" : "Save"}</span>
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
