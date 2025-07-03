import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";
import MapDropdown from "@/components/MapAndFloorMenu";
import OperatorSidebar from "@/components/OperatorIconMenu";
import SaveCanvasButton from "@/components/SaveBtn";

declare global {
  interface Window {
    __tldraw_editor?: any;
  }
}

const Stratmaker = () => {
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
          const width = 80;
          const height = 80;

          editor.updateAssets([
            {
              id: assetId,
              type: "image",
              typeName: "asset",
              props: {
                name: "Operator",
                src: iconUrl,
                mimeType: "image/png",
                w: width,
                h: height,
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
                w: width,
                h: height,
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
      <Tldraw
        onMount={(editor) => {
          window.__tldraw_editor = editor;
        }}
      >
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
          <MapDropdown />
        </div>

        <div className="absolute bottom-4 right-[20%] z-50">
          <SaveCanvasButton />
        </div>
      </Tldraw>

      <div className="absolute top-0 left-0 z-50">
        <OperatorSidebar />
      </div>
    </div>
  );
};

export default Stratmaker;
