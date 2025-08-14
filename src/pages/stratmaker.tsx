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

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { throttle } from "lodash";
import { Trash } from "lucide-react";

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

    const shapes = editor.getCurrentPageShapes();
    shapes.forEach((shape: any) => {
      if (shape.type === "image" && shape.props?.name === "Map Background") {
        editor.deleteShapes([shape.id]);
      }
    });

    const viewportBounds = editor.getViewportPageBounds();
    const width = viewportBounds.width * 0.8;
    const height = viewportBounds.height * 0.8;

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
          mimeType: imageUrl.endsWith(".png")
            ? "image/png"
            : imageUrl.endsWith(".jpg") || imageUrl.endsWith(".jpeg")
            ? "image/jpeg"
            : "image/*",
          w: width,
          h: height,
          isAnimated: false,
        },
        meta: {},
      },
    ]);

    const centerX = viewportBounds.minX + (viewportBounds.width - width) / 2;
    const centerY = viewportBounds.minY + (viewportBounds.height - height) / 2;

    editor.createShapes([
      {
        id: shapeId,
        type: "image",
        x: centerX,
        y: centerY,
        props: {
          assetId,
          w: width,
          h: height,
          crop: { topLeft: { x: 0, y: 0 }, bottomRight: { x: 1, y: 1 } },
        },
      },
    ]);
  };

  const handleMount = (editor: any) => {
    editorRef.current = editor;
    window.__tldraw_editor = editor;

    const params = new URLSearchParams(location.search);
    const mapNameFromQuery = params.get("map");
    if (mapNameFromQuery?.trim()) {
      mapNameRef.current = mapNameFromQuery.trim();
    }
  };

  const handleResetCanvas = () => {
    if (
      window.confirm(
        "Are you sure you want to clear this strat and start over?"
      )
    ) {
      localStorage.removeItem(PERSISTENCE_KEY);
      setCanvasKey((prev) => prev + 1);
      mapNameRef.current = null;
    }
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
      className="relative h-screen !ml-60.25"
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
        </div>
      </Tldraw>

      <div className="absolute top-0 left-0 z-50">
        <OperatorSidebar />
      </div>
    </div>
  );
};

export default Stratmaker;
