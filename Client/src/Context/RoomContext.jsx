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
      const sortedRooms = response.data.rooms.sort(
        (a, b) => a.room_id - b.room_id
      );
      const sRooms = sortedRooms.filter((room) => room.no_of_rooms !== 0);
      setRooms(sRooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  useEffect(() => {
    setTotal(kids + adults);
    // Initial fetch of rooms
    fetchRooms();
    console.log(rooms);
    // Polling every 10 seconds
    const intervalId = setInterval(fetchRooms, 5000);
    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [adults, kids]);

  const handleClick = () => {
    const newRooms = rooms.filter((room) => room.max_adults >= adults);
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
