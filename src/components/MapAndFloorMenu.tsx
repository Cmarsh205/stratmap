import { useEditor } from "tldraw";
import { useState } from "react";
import type { TLAssetId, TLShapeId } from "tldraw";

const imageCategories = {
  Bank: [
    { label: "Basement", src: "/public/maps/Bank/basement.jpg" },
    { label: "Dog", src: "/images/animals/dog.png" },
  ],
  Vehicles: [
    { label: "Car", src: "/images/vehicles/car.jpg" },
    { label: "Bike", src: "/images/vehicles/bike.png" },
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

    // ✅ Step 1: Add the image asset
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

    // ✅ Step 2: Add the shape referencing the asset
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
    <div className="bg-white p-4 rounded shadow max-w-sm space-y-2">
      <select
        onChange={(e) => setSelectedCategory(e.target.value)}
        defaultValue=""
        className="w-full border rounded p-2"
      >
        <option value="" disabled>
          Select Category
        </option>
        {Object.keys(imageCategories).map((cat) => (
          <option key={cat} value={cat}>
            {cat}
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
