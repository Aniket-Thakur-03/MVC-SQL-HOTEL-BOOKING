import { createContext, useEffect, useState } from "react";
import { roomData } from "../data";

export const RoomContext = createContext();
const RoomProvider = ({ children }) => {
  const [rooms, setRooms] = useState(roomData);
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    setTotal(kids + adults);
  });
  const handleClick = () => {
    const newRooms = roomData.filter((room) => {
      return room.maxAdults <= adults;
    });
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
