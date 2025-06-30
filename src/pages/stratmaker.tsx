import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";
import ImageDropdown from "@/components/MapAndFloorMenu";

const Stratmaker = () => {
  return (
    <div className="relative w-full h-screen">
      <Tldraw>
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
          <ImageDropdown />
        </div>
      </Tldraw>
    </div>
  );
};

export default Stratmaker;