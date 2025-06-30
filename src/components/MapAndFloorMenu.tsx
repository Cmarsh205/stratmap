import { useEditor } from "tldraw";
import { useState } from "react";
import type { TLAssetId, TLShapeId } from "tldraw";

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

const ImageDropdown = () => {
  const editor = useEditor();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
          name: "image",
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
    setSelectedCategory(null);
  };

  return (
    <div className="bg-white p-4 rounded shadow max-w-sm space-y-2">
      <select
        key={selectedCategory ?? "initial"}
        value={selectedCategory ?? ""}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="w-full border rounded p-2"
      >
        <option value="" disabled>
          Select Map
        </option>
        {Object.keys(imageCategories).map((maps) => (
          <option key={maps} value={maps}>
            {maps}
          </option>
        ))}
      </select>
      {selectedCategory && (
        <div className="space-y-1">
          {imageCategories[
            selectedCategory as keyof typeof imageCategories
          ].map((img) => (
            <button
              key={img.label}
              onClick={() => insertImage(img.src)}
              className="w-full text-left p-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              {img.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageDropdown;
