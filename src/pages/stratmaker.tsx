import {
  Tldraw,
  createTLStore,
  defaultShapeUtils,
  getSnapshot,
  loadSnapshot,
  DefaultSpinner,
} from "tldraw";
import "tldraw/tldraw.css";

import MapDropdown from "@/components/MapAndFloorMenu";
import OperatorSidebar from "@/components/OperatorIconMenu";
import SaveCanvasButton from "@/components/SaveBtn";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { throttle } from "lodash";
import { Trash } from "lucide-react";

declare global {
  interface Window {
    __tldraw_editor?: any;
  }
}

const Stratmaker = () => {
  const { name } = useParams();
  const PERSISTENCE_KEY = `tldraw-strat:${name ?? "default"}`;
  const [canvasKey, setCanvasKey] = useState(0);

  const store = useMemo(() => {
    return createTLStore({ shapeUtils: defaultShapeUtils });
  }, [canvasKey]);

  const [loadingState, setLoadingState] = useState<
    | { status: "loading" }
    | { status: "ready" }
    | { status: "error"; error: string }
  >({ status: "loading" });

  const editorRef = useRef<any>(null);

  useLayoutEffect(() => {
    setLoadingState({ status: "loading" });

    const saved = localStorage.getItem(PERSISTENCE_KEY);
    if (saved) {
      try {
        const snapshot = JSON.parse(saved);
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
        localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(snapshot));
      }, 500)
    );

    return () => cleanup();
  }, [PERSISTENCE_KEY, store]);

  const handleMount = (editor: any) => {
    editorRef.current = editor;
    window.__tldraw_editor = editor;
  };

  const handleResetCanvas = () => {
    if (
      window.confirm(
        "Are you sure you want to clear this strat and start over?"
      )
    ) {
      localStorage.removeItem(PERSISTENCE_KEY);
      setCanvasKey((prev) => prev + 1);
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
      className="relative w-full h-screen"
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
                crop: {
                  topLeft: { x: 0, y: 0 },
                  bottomRight: { x: 1, y: 1 },
                },
              },
            },
          ]);
        }
      }}
      onDragOver={(e) => e.preventDefault()}
    >
      <Tldraw key={canvasKey} store={store} onMount={handleMount}>
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
          <MapDropdown />
        </div>

        <div className="absolute bottom-4 right-[12%] z-50 flex gap-2">
          <SaveCanvasButton />
          <button
            onClick={handleResetCanvas}
            className="!bg-red-600 !text-white !px-3 !rounded-md hover:!bg-red-500 flex items-center"
          >
            <Trash className="!mr-2 h-4 w-4 text-inherit transition-colors" />
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
