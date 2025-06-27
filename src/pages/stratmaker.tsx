import { useState, useMemo } from "react";
import {
  TldrawEditor,
  defaultShapeUtils,
  createTLStore,
  useEditor,
  Tldraw,
} from "tldraw";
import "tldraw/tldraw.css";

// 👇️ Define image categories and images
const imageCategories = {
  Animals: [
    { label: "Cat", src: "/images/animals/cat.jpg" },
    { label: "Dog", src: "/images/animals/dog.png" },
  ],
  Vehicles: [
    { label: "Car", src: "/images/vehicles/car.jpg" },
    { label: "Bike", src: "/images/vehicles/bike.png" },
  ],
};

// 👇️ Image insertion dropdown
const ImageMenu = () => {
  const editor = useEditor();
  const [selectedCategory, setSelectedCategory] = useState<
    keyof typeof imageCategories | null
  >(null);

  const insertImage = (url: string) => {
    if (!editor || !url) return;

    editor.createShapes([
      {
        type: "image",
        x: 100,
        y: 100,
        props: {
          w: 200,
          h: 200,
          url,
          scaleX: 1,
          scaleY: 1,
          crop: {
            top: 0,
            bottom: 1,
            left: 0,
            right: 1,
          },
          opacity: 1,
          playing: true,
        },
      },
    ]);
  };

  return (
    <div className="absolute top-4 left-4 z-50 bg-white p-3 rounded shadow-md">
      {/* First dropdown: categories */}
      <select
        onChange={(e) =>
          setSelectedCategory(e.target.value as keyof typeof imageCategories)
        }
        defaultValue=""
        className="mb-2 p-2 border rounded"
      >
        <option value="" disabled>
          Select Category
        </option>
        {Object.keys(imageCategories).map((cat, i) => (
          <option key={i} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {/* Second menu: image buttons */}
      {selectedCategory && (
        <div className="flex flex-col space-y-1">
          {imageCategories[selectedCategory].map((img, i) => (
            <button
              key={i}
              onClick={() => insertImage(img.src)}
              className="text-left p-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              {img.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const CustomTldraw = () => {
  const store = useMemo(() => createTLStore(), []);

  return (
    <TldrawEditor store={store} shapeUtils={defaultShapeUtils}>
      <Tldraw />
      <ImageMenu />
    </TldrawEditor>
  );
};

export default CustomTldraw;
