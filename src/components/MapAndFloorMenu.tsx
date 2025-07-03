import { useEditor } from "tldraw";
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
import { Map } from "lucide-react";

const imageCategories = {
  Bank: [
    { label: "Basement", src: "/public/maps/Bank/basement.jpg" },
    { label: "1st Floor", src: "/public/maps/Bank/floor1.jpg" },
    { label: "2nd Floor", src: "/public/maps/Bank/floor2.jpg" },
    { label: "Roof", src: "/public/maps/Bank/roof.jpg" },
  ],
  Border: [
    { label: "1st Floor", src: "/public/maps/Border/floor1.jpg" },
    { label: "2nd Floor", src: "/public/maps/Border/floor2.jpg" },
    { label: "Roof", src: "/public/maps/Border/roof.jpg" },
  ],
  Chalet: [
    { label: "Basement", src: "/public/maps/Chalet/basement.jpg" },
    { label: "1st Floor", src: "/public/maps/Chalet/floor1.jpg" },
    { label: "2nd Floor", src: "/public/maps/Chalet/floor2.jpg" },
    { label: "Roof", src: "/public/maps/Chalet/roof.jpg" },
  ],
  Clubhouse: [
    { label: "Basement", src: "/public/maps/Clubhouse/basement.jpg" },
    { label: "1st Floor", src: "/public/maps/Clubhouse/floor1.jpg" },
    { label: "2nd Floor", src: "/public/maps/Clubhouse/floor2.jpg" },
    { label: "Roof", src: "/public/maps/Clubhouse/roof.jpg" },
  ],
  Coastline: [
    { label: "1st Floor", src: "/public/maps/Coastline/floor1.jpg" },
    { label: "2nd Floor", src: "/public/maps/Coastline/floor2.jpg" },
    { label: "Roof", src: "/public/maps/Coastline/roof.jpg" },
  ],
  Consulate: [
    { label: "Basement", src: "/public/maps/Consulate/basement.jpg" },
    { label: "1st Floor", src: "/public/maps/Consulate/floor1.jpg" },
    { label: "2nd Floor", src: "/public/maps/Consulate/floor2.jpg" },
    { label: "Roof", src: "/public/maps/Consulate/roof.jpg" },
  ],
  EmeraldPlains: [
    { label: "1st Floor", src: "/public/maps/Emerald Plains/floor1.jpg" },
    { label: "2nd Floor", src: "/public/maps/Emerald Plains/floor2.jpg" },
    { label: "Roof", src: "/public/maps/Emerald Plains/roof.jpg" },
  ],
  Kafe: [
    { label: "1st Floor", src: "/public/maps/Kafe/floor1.jpg" },
    { label: "2nd Floor", src: "/public/maps/Kafe/floor2.jpg" },
    { label: "3rd Floor", src: "/public/maps/Kafe/floor3.jpg" },
    { label: "Roof", src: "/public/maps/Kafe/roof.jpg" },
  ],
  Kanal: [
    { label: "Basement", src: "/public/maps/Kanal/basement.jpg" },
    { label: "1st Floor", src: "/public/maps/Kanal/floor1.jpg" },
    { label: "2nd Floor", src: "/public/maps/Kanal/floor2.jpg" },
    { label: "Roof", src: "/public/maps/Kanal/roof.jpg" },
  ],
  Lair: [
    { label: "Basement", src: "/public/maps/Lair/basement.jpg" },
    { label: "1st Floor", src: "/public/maps/Lair/floor1.jpg" },
    { label: "2nd Floor", src: "/public/maps/Lair/floor2.jpg" },
    { label: "Roof", src: "/public/maps/Lair/roof.jpg" },
  ],
  NighthavenLabs: [
    { label: "Basement", src: "/public/maps/Nighthaven Labs/basement.jpg" },
    { label: "1st Floor", src: "/public/maps/Nighthaven Labs/floor1.jpg" },
    { label: "2nd Floor", src: "/public/maps/Nighthaven Labs/floor2.jpg" },
    { label: "Roof", src: "/public/maps/Nighthaven Labs/roof.jpg" },
  ],
  Oregon: [
    { label: "Basement", src: "/public/maps/Oregon/basement.jpg" },
    { label: "1st Floor", src: "/public/maps/Oregon/floor1.jpg" },
    { label: "2nd Floor", src: "/public/maps/Oregon/floor2.jpg" },
    { label: "Roof", src: "/public/maps/Oregon/roof.jpg" },
  ],
  Outback: [
    { label: "1st Floor", src: "/public/maps/Outback/floor1.jpg" },
    { label: "2nd Floor", src: "/public/maps/Outback/floor2.jpg" },
    { label: "Roof", src: "/public/maps/Outback/roof.jpg" },
  ],
  Skyscraper: [
    { label: "1st Floor", src: "/public/maps/Skyscraper/floor1.jpg" },
    { label: "2nd Floor", src: "/public/maps/Skyscraper/floor2.jpg" },
    { label: "Roof", src: "/public/maps/Skyscraper/roof.jpg" },
  ],
  Themepark: [
    { label: "1st Floor", src: "/public/maps/Themepark/floor1.jpg" },
    { label: "2nd Floor", src: "/public/maps/Themepark/floor2.jpg" },
    { label: "Roof", src: "/public/maps/Themepark/roof.jpg" },
  ],
  Villa: [
    { label: "Basement", src: "/public/maps/Villa/basement.jpg" },
    { label: "1st Floor", src: "/public/maps/Villa/floor1.jpg" },
    { label: "2nd Floor", src: "/public/maps/Villa/floor2.jpg" },
    { label: "Roof", src: "/public/maps/Villa/roof.jpg" },
  ],
};

const MapDropdown = () => {
  const editor = useEditor();

  const insertImage = (url: string) => {
    if (!editor) return;

    const assetId = `asset:${crypto.randomUUID()}` as TLAssetId;
    const shapeId = `shape:${crypto.randomUUID()}` as TLShapeId;

    const width = 300;
    const height = 300;

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

    editor.createShapes([
      {
        id: shapeId,
        type: "image",
        x: 100,
        y: 100,
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
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-[#1E293B] text-yellow-400 hover:bg-[#334155] hover:text-yellow-300 flex items-center gap-2 px-4 py-2 rounded-md shadow group">
          <Map className="w-4 h-4 text-yellow-400 group-hover:text-yellow-300" />
          Choose Map
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="bg-[#1E293B] border border-slate-700 text-yellow-300 w-56 max-h-96 overflow-y-auto shadow-lg"
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
            <DropdownMenuSubContent className="bg-[#1E293B] text-yellow-200 border-slate-700">
              {floors.map((floor) => (
                <DropdownMenuItem
                  key={floor.label}
                  onClick={() => insertImage(floor.src)}
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
  );
};

export default MapDropdown;
