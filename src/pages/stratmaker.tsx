import {
  Tldraw,
  createTLStore,
  defaultShapeUtils,
  getSnapshot,
  loadSnapshot,
  DefaultSpinner,
} from "tldraw";
import "tldraw/tldraw.css";

import MapAndFloorMenu from "@/components/MapAndFloorMenu";
import OperatorSidebar from "@/components/OperatorIconMenu";
import SaveCanvasButton from "@/components/SaveBtn";
import ConfirmationModal from "@/components/ConfirmationModal";

import { useLayoutEffect, useMemo, useRef, useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { throttle } from "lodash";
import { Trash, HelpCircle } from "lucide-react";

declare global {
  interface Window {
    __tldraw_editor?: any;
  }
}

const Stratmaker = () => {
  const { name } = useParams();
  const location = useLocation();
  const PERSISTENCE_KEY = `tldraw-strat:${name ?? "default"}`;
  const [canvasKey, setCanvasKey] = useState(0);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isFirstVisitModalOpen, setIsFirstVisitModalOpen] = useState(false);

  const store = useMemo(
    () => createTLStore({ shapeUtils: defaultShapeUtils }),
    [canvasKey]
  );

  const [loadingState, setLoadingState] = useState<
    | { status: "loading" }
    | { status: "ready" }
    | { status: "error"; error: string }
  >({ status: "loading" });

  const editorRef = useRef<any>(null);
  const mapNameRef = useRef<string | null>(null);
  const mapImageRef = useRef<string | null>(null);

  useEffect(() => {
    const visited = localStorage.getItem("stratmaker-first-visit");
    if (!visited) {
      setIsFirstVisitModalOpen(true);
    }
  }, []);

  const handleFirstVisitClose = () => {
    localStorage.setItem("stratmaker-first-visit", "true");
    setIsFirstVisitModalOpen(false);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mapImageUrl = params.get("mapImage");
    if (mapImageUrl) mapImageRef.current = mapImageUrl;
  }, [location.search]);

  useLayoutEffect(() => {
    setLoadingState({ status: "loading" });

    const saved = localStorage.getItem(PERSISTENCE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const snapshot = parsed.snapshot || parsed;
        mapNameRef.current = snapshot?.meta?.mapName ?? parsed.mapName ?? null;
        loadSnapshot(store, snapshot);
        setLoadingState({ status: "ready" });
      } catch (err: any) {
        console.error("Error loading snapshot:", err);
        setLoadingState({ status: "error", error: err.message });
      }
    } else {
      setLoadingState({ status: "ready" });
    }

    const cleanup = store.listen(
      throttle(() => {
        const snapshot = getSnapshot(store);
        const existingData = JSON.parse(
          localStorage.getItem(PERSISTENCE_KEY) || "{}"
        );

        const saveData = {
          snapshot,
          mapName: mapNameRef.current,
          savedAt: existingData.savedAt,
        };

        localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(saveData));
      }, 500)
    );

    return () => cleanup();
  }, [PERSISTENCE_KEY, store]);

  const insertFloorOnCanvas = (imageUrl: string) => {
    const editor = window.__tldraw_editor ?? editorRef.current;
    if (!editor) return;

    editor.getCurrentPageShapes().forEach((shape: any) => {
      if (shape.type === "image" && shape.props?.name === "Map Background") {
        editor.deleteShapes([shape.id]);
      }
    });

    const viewport = editor.getViewportPageBounds();
    const width = viewport.width * 0.8;
    const height = viewport.height * 0.8;

    const assetId = `asset:${crypto.randomUUID()}`;
    const shapeId = `shape:${crypto.randomUUID()}`;

    editor.updateAssets([
      {
        id: assetId,
        type: "image",
        typeName: "asset",
        props: {
          name: "Map Background",
          src: imageUrl,
          w: width,
          h: height,
          isAnimated: false,
          mimeType: "image/jpeg",
        },
        meta: {},
      },
    ]);

    editor.createShapes([
      {
        id: shapeId,
        type: "image",
        x: viewport.minX + (viewport.width - width) / 2,
        y: viewport.minY + (viewport.height - height) / 2,
        props: {
          assetId,
          w: width,
          h: height,
          crop: { topLeft: { x: 0, y: 0 }, bottomRight: { x: 1, y: 1 } },
        },
      },
    ]);

    editor.updateShape({
      id: shapeId,
      isLocked: true,
      meta: { permanentLock: true }, 
    });
  };

  const handleMount = (editor: any) => {
    editorRef.current = editor;
    window.__tldraw_editor = editor;

    if (mapImageRef.current) {
      insertFloorOnCanvas(mapImageRef.current);
      mapImageRef.current = null;

      const url = new URL(window.location.href);
      url.searchParams.delete("mapImage");
      window.history.replaceState({}, "", url.toString());
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mapImageUrl = params.get("mapImage");

    if (mapImageUrl && editorRef.current) {
      insertFloorOnCanvas(mapImageUrl);
    }
  }, [location.search]);

  const handleResetCanvas = () => {
    setIsResetModalOpen(true);
  };

  const confirmResetCanvas = () => {
    localStorage.removeItem(PERSISTENCE_KEY);
    setCanvasKey((prev) => prev + 1);
    mapNameRef.current = null;
    setIsResetModalOpen(false);
  };

  if (loadingState.status === "loading") {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <DefaultSpinner />
      </div>
    );
  }

  if (loadingState.status === "error") {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl text-red-500">Error loading strat</h2>
          <p>{loadingState.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative h-screen"
      onDrop={(e) => {
        const editor = window.__tldraw_editor;
        const iconUrl = e.dataTransfer.getData("operator-icon");

        if (iconUrl && editor) {
          const mousePoint = editor.screenToPage({
            x: e.clientX,
            y: e.clientY,
          });

          const assetId = `asset:${crypto.randomUUID()}`;
          const shapeId = `shape:${crypto.randomUUID()}`;

          editor.updateAssets([
            {
              id: assetId,
              type: "image",
              typeName: "asset",
              props: {
                name: "Operator",
                src: iconUrl,
                mimeType: "image/png",
                w: 20,
                h: 20,
                isAnimated: false,
              },
              meta: {},
            },
          ]);

          editor.createShapes([
            {
              id: shapeId,
              type: "image",
              x: mousePoint.x,
              y: mousePoint.y,
              props: {
                assetId,
                w: 20,
                h: 20,
                crop: { topLeft: { x: 0, y: 0 }, bottomRight: { x: 1, y: 1 } },
              },
            },
          ]);
        }
      }}
      onDragOver={(e) => e.preventDefault()}
    >
      <Tldraw key={canvasKey} store={store} onMount={handleMount}>
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
          <MapAndFloorMenu
            onSelectFloor={(image) => insertFloorOnCanvas(image)}
            onSelectMapName={(mapName) => (mapNameRef.current = mapName)}
          />
        </div>

        <div className="absolute bottom-4 right-[11%] z-50 flex gap-2">
          <SaveCanvasButton store={store} mapNameRef={mapNameRef} />
          <button
            onClick={handleResetCanvas}
            className="!gap-2 !h-11 !px-4 !py-2.5 !bg-red-500/20 hover:!bg-red-500 !text-red-400 hover:!text-white border !border-red-500/30 hover:!border-red-500 !rounded-xl !transition-all !duration-200 !flex !items-center !justify-center"
          >
            <Trash className="mr-2 h-4 w-4" />
            Reset
          </button>
          <button
            onClick={() => setIsFirstVisitModalOpen(true)}
            className="!h-11 !px-4 !py-2.5 !bg-blue-500/20 hover:!bg-blue-500 !text-blue-400 hover:!text-white !rounded-xl !transition-all !duration-200 !flex !items-center !gap-2"
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            Help
          </button>
        </div>
      </Tldraw>

      <div className="absolute top-0 left-0 z-50">
        <OperatorSidebar />
      </div>

      <ConfirmationModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={confirmResetCanvas}
        title="Reset Strat?"
        message="Are you sure you want to clear this strat and start over?"
        confirmText="Reset"
        cancelText="Cancel"
        type="danger"
      />

      <ConfirmationModal
        isOpen={isFirstVisitModalOpen}
        onClose={handleFirstVisitClose}
        onConfirm={handleFirstVisitClose}
        title="Welcome to Stratmaker!"
        message="Use the menu above to select the map and floor you would like if you have not already selected one from the Maps page, there is also a menu to the left that allows you to drag and drop the operators icons. Treat this as a whiteboard and use your creativity to help display your strategy. I highly recommend using the pages in the top left hand corner as you can add a different floor to each page. Enjoy!"
        confirmText="Got it!"
        cancelText=""
        type="info"
      />
    </div>
  );
};

export default Stratmaker;
