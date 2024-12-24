import axios from "axios";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";

function LocationSearch({ selectedLocationId, setSelectedLocationId }) {
  const [locations, setLocations] = useState([]);

  async function fetchLocations() {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/location/get/user/location"
      );
      if (response.status === 200) {
        setLocations(response.data.locations);
      } else {
        setLocations([]);
      }
    } catch (error) {
      console.log(`${error.response?.data.message || error.message}`, "error");
    }
  }

  useEffect(() => {
    fetchLocations();
  }, []);

  return (
    <div className="relative flex items-center justify-start h-full">
      <div className="absolute z-10 pl-2">
        <MapPin className="text-accent text-base" />
      </div>
      <select
        className="w-full h-full bg-white right-8 pl-14"
        onChange={(e) => setSelectedLocationId(e.target.value)}
        value={selectedLocationId || ""}
      >
        <option className="text-left" value="" disabled>
          Select location
        </option>
        {locations.map((location) => (
          <option
            className="text-left"
            key={location.location_id}
            value={location.location_id}
          >{`${location.city}(${location.pincode})`}</option>
        ))}
      </select>
    </div>
  );
}

export default LocationSearch;
