import { createContext, useEffect, useState } from "react";

export const RoomContext = createContext();

const RoomProvider = ({ children }) => {
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(kids + adults);
  }, [adults, kids]);

  return (
    <RoomContext.Provider
      value={{
        adults,
        setAdults,
        kids,
        setKids,
        total,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export default RoomProvider;
