import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const RoomContext = createContext();

const RoomProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Function to fetch room data
  const handleSearchRooms = async ({
    checkIn,
    checkOut,
    adults,
    kids,
    locationId,
  }) => {
    console.log("Fetching rooms with params:", {
      checkIn,
      checkOut,
      adults,
      kids,
      locationId,
    });
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/api/rooms", {
        checkIn,
        checkOut,
        adults,
        kids,
        locationId,
      });
      if (response.status === 200) {
        console.log("Rooms fetched successfully:", response.data);
        setRooms(response.data.rooms);
      } else {
        console.error("Error fetching rooms");
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTotal(kids + adults);
  }, [adults, kids]);

  return (
    <RoomContext.Provider
      value={{
        rooms,
        adults,
        setAdults,
        kids,
        setKids,
        handleSearchRooms,
        total,
        loading,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export default RoomProvider;
