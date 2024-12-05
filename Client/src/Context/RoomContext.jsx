import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const RoomContext = createContext();

const RoomProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);
  const [total, setTotal] = useState(0);

  // Function to fetch room data
  const fetchRooms = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/rooms");
      setRooms(response.data.rooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  useEffect(() => {
    // Update total whenever adults or kids change
    setTotal(kids + adults);

    // Initial fetch of rooms
    fetchRooms();

    // Polling every 30 seconds (adjust the interval as needed)
    const intervalId = setInterval(fetchRooms, 10000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [adults, kids]);

  const handleClick = () => {
    const newRooms = rooms.filter((room) => room.maxAdults >= adults);
    setRooms(newRooms);
  };

  return (
    <RoomContext.Provider
      value={{ rooms, adults, setAdults, kids, setKids, handleClick, total }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export default RoomProvider;