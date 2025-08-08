import { useState } from "react";
import { mapsData } from "@/data/mapsData"; 

interface MapAndFloorMenuProps {
  onSelectFloor: (floorImage: string) => void; 
  onSelectMapName: (mapName: string) => void;  
}

export default function MapAndFloorMenu({
  onSelectFloor,
  onSelectMapName
}: MapAndFloorMenuProps) {
  const [selectedMapName, setSelectedMapName] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");

  const handleMapChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const mapName = e.target.value;
    setSelectedMapName(mapName);
    setSelectedFloor("");
    onSelectMapName(mapName); 
  };

  const handleFloorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const floorName = e.target.value;
    setSelectedFloor(floorName);

    const map = mapsData.find((m) => m.name === selectedMapName);
    const floor = map?.floors.find((f) => f.name === floorName);

    if (floor) {
      onSelectFloor(floor.image); 
    }
  };

  return (
    <div className="!flex !gap-2 !items-center">
      {/* Map Selector */}
      <select
        value={selectedMapName}
        onChange={handleMapChange}
        className="!border !p-2 !rounded"
      >
        <option value="">Select Map</option>
        {mapsData.map((map) => (
          <option key={map.name} value={map.name}>
            {map.name}
          </option>
        ))}
      </select>

      {/* Floor Selector */}
      <select
        value={selectedFloor}
        onChange={handleFloorChange}
        className="!border !p-2 !rounded"
        disabled={!selectedMapName}
      >
        <option value="">Select Floor</option>
        {selectedMapName &&
          mapsData
            .find((map) => map.name === selectedMapName)
            ?.floors.map((floor) => (
              <option key={floor.name} value={floor.name}>
                {floor.name}
              </option>
            ))}
      </select>
    </div>
  );
}
