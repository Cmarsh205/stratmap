import { useEditor } from "tldraw";
import { useState } from "react";
import type { TLAssetId, TLShapeId } from "tldraw";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Map } from "lucide-react";

const imageCategories = {
  Bank: [
    { label: "Basement", src: "/maps/Bank/basement.jpg" },
    { label: "1st Floor", src: "/maps/Bank/floor1.jpg" },
    { label: "2nd Floor", src: "/maps/Bank/floor2.jpg" },
    { label: "Roof", src: "/maps/Bank/roof.jpg" },
  ],
  Border: [
    { label: "1st Floor", src: "/maps/Border/floor1.jpg" },
    { label: "2nd Floor", src: "/maps/Border/floor2.jpg" },
    { label: "Roof", src: "/maps/Border/roof.jpg" },
  ],
  Chalet: [
    { label: "Basement", src: "/maps/Chalet/basement.jpg" },
    { label: "1st Floor", src: "/maps/Chalet/floor1.jpg" },
    { label: "2nd Floor", src: "/maps/Chalet/floor2.jpg" },
    { label: "Roof", src: "/maps/Chalet/roof.jpg" },
  ],
  Clubhouse: [
    { label: "Basement", src: "/maps/Clubhouse/basement.jpg" },
    { label: "1st Floor", src: "/maps/Clubhouse/floor1.jpg" },
    { label: "2nd Floor", src: "/maps/Clubhouse/floor2.jpg" },
    { label: "Roof", src: "/maps/Clubhouse/roof.jpg" },
  ],
  Coastline: [
    { label: "1st Floor", src: "/maps/Coastline/floor1.jpg" },
    { label: "2nd Floor", src: "/maps/Coastline/floor2.jpg" },
    { label: "Roof", src: "/maps/Coastline/roof.jpg" },
  ],
  Consulate: [
    { label: "Basement", src: "/maps/Consulate/basement.jpg" },
    { label: "1st Floor", src: "/maps/Consulate/floor1.jpg" },
    { label: "2nd Floor", src: "/maps/Consulate/floor2.jpg" },
    { label: "Roof", src: "/maps/Consulate/roof.jpg" },
  ],
  EmeraldPlains: [
    { label: "1st Floor", src: "/maps/Emerald Plains/floor1.jpg" },
    { label: "2nd Floor", src: "/maps/Emerald Plains/floor2.jpg" },
    { label: "Roof", src: "/maps/Emerald Plains/roof.jpg" },
  ],
  Kafe: [
    { label: "1st Floor", src: "/maps/Kafe/floor1.jpg" },
    { label: "2nd Floor", src: "/maps/Kafe/floor2.jpg" },
    { label: "3rd Floor", src: "/maps/Kafe/floor3.jpg" },
    { label: "Roof", src: "/maps/Kafe/roof.jpg" },
  ],
  Kanal: [
    { label: "Basement", src: "/maps/Kanal/basement.jpg" },
    { label: "1st Floor", src: "/maps/Kanal/floor1.jpg" },
    { label: "2nd Floor", src: "/maps/Kanal/floor2.jpg" },
    { label: "Roof", src: "/maps/Kanal/roof.jpg" },
  ],
  Lair: [
    { label: "Basement", src: "/maps/Lair/basement.jpg" },
    { label: "1st Floor", src: "/maps/Lair/floor1.jpg" },
    { label: "2nd Floor", src: "/maps/Lair/floor2.jpg" },
    { label: "Roof", src: "/maps/Lair/roof.jpg" },
  ],
  NighthavenLabs: [
    { label: "Basement", src: "/maps/Nighthaven Labs/basement.jpg" },
    { label: "1st Floor", src: "/maps/Nighthaven Labs/floor1.jpg" },
    { label: "2nd Floor", src: "/maps/Nighthaven Labs/floor2.jpg" },
    { label: "Roof", src: "/maps/Nighthaven Labs/roof.jpg" },
  ],
  Oregon: [
    { label: "Basement", src: "/maps/Oregon/basement.jpg" },
    { label: "1st Floor", src: "/maps/Oregon/floor1.jpg" },
    { label: "2nd Floor", src: "/maps/Oregon/floor2.jpg" },
    { label: "Roof", src: "/maps/Oregon/roof.jpg" },
  ],
  Outback: [
    { label: "1st Floor", src: "/maps/Outback/floor1.jpg" },
    { label: "2nd Floor", src: "/maps/Outback/floor2.jpg" },
    { label: "Roof", src: "/maps/Outback/roof.jpg" },
  ],
  Skyscraper: [
    { label: "1st Floor", src: "/maps/Skyscraper/floor1.jpg" },
    { label: "2nd Floor", src: "/maps/Skyscraper/floor2.jpg" },
    { label: "Roof", src: "/maps/Skyscraper/roof.jpg" },
  ],
  Themepark: [
    { label: "1st Floor", src: "/maps/Themepark/floor1.jpg" },
    { label: "2nd Floor", src: "/maps/Themepark/floor2.jpg" },
    { label: "Roof", src: "/maps/Themepark/roof.jpg" },
  ],
  Villa: [
    { label: "Basement", src: "/maps/Villa/basement.jpg" },
    { label: "1st Floor", src: "/maps/Villa/floor1.jpg" },
    { label: "2nd Floor", src: "/maps/Villa/floor2.jpg" },
    { label: "Roof", src: "/maps/Villa/roof.jpg" },
  ],
};

interface MapDropdownProps {
  onMapChange?: (mapUrl: string) => void;
}

const MapDropdown = ({ onMapChange }: MapDropdownProps) => {
  const editor = useEditor();
  const [pendingMap, setPendingMap] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  const insertImage = (url: string) => {
    if (!editor) return;

    const shapes = editor.getCurrentPageShapes();
    shapes.forEach((shape: any) => {
      if (shape.type === "image" && shape.props?.name === "map") {
        editor.deleteShapes([shape.id]);
      }
    });

    const viewportBounds = editor.getViewportPageBounds();
    const viewportWidth = viewportBounds.width;
    const viewportHeight = viewportBounds.height;

    const width = viewportWidth * 0.8;
    const height = viewportHeight * 0.8;

    const assetId = `asset:${crypto.randomUUID()}` as TLAssetId;
    const shapeId = `shape:${crypto.randomUUID()}` as TLShapeId;

    editor.updateAssets([
      {
        id: assetId,
        type: "image",
        typeName: "asset",
        props: {
          name: "map",
          src: url,
          mimeType: url.endsWith(".png")
            ? "image/png"
            : url.endsWith(".jpg") || url.endsWith(".jpeg")
            ? "image/jpeg"
            : "image/*",
          w: width,
          h: height,
          isAnimated: false,
        },
        meta: {},
      },
    ]);

    const centerX = viewportBounds.minX + (viewportWidth - width) / 2;
    const centerY = viewportBounds.minY + (viewportHeight - height) / 2;

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
          crop: {
            topLeft: { x: 0, y: 0 },
            bottomRight: { x: 1, y: 1 },
          },
        },
      },
    ]);

    if (onMapChange) {
      onMapChange(url);
    }
  };

  const handleSelectMap = (url: string) => {
    setPendingMap(url);
    setShowWarning(true);
  };

  const confirmMapChange = () => {
    if (pendingMap) {
      insertImage(pendingMap);
    }
    setPendingMap(null);
    setShowWarning(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="!bg-gray-800 !text-yellow-400 hover:!bg-[#334155] hover:!text-yellow-300 flex items-center gap-2 !px-3 py-2 !rounded-md shadow group">
            <Map className="w-4 h-4 text-yellow-400 group-hover:text-yellow-300" />
            Choose Map
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="bg-gray-800 border border-slate-700 text-yellow-300 w-56 max-h-96 overflow-y-auto shadow-lg"
          sideOffset={8}
        >
          <DropdownMenuLabel className="text-yellow-400 font-bold text-sm px-2 py-1">
            Select Map & Floor
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-slate-600" />

          {Object.entries(imageCategories).map(([mapName, floors]) => (
            <DropdownMenuSub key={mapName}>
              <DropdownMenuSubTrigger className="text-yellow-200 hover:bg-[#334155] px-2 py-1">
                {mapName}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="bg-gray-800 text-yellow-200 border-slate-700">
                {floors.map((floor) => (
                  <DropdownMenuItem
                    key={floor.label}
                    onClick={() => handleSelectMap(floor.src)}
                    className="hover:bg-yellow-500 hover:text-slate-900 px-2 py-1 cursor-pointer"
                  >
                    {floor.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent className="bg-gray-800 text-yellow-300 border border-slate-700 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-yellow-400 text-lg">
              Warning
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm mb-4">
            Changing the map will clear the current strat. Make sure to save
            your work first.
          </p>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              onClick={() => setShowWarning(false)}
              className="!bg-gray-600 hover:!bg-gray-500 text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmMapChange}
              className="!bg-red-600 hover:!bg-red-500 text-white"
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MapDropdown;
