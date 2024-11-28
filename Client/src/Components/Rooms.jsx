import React, { useContext } from "react";
import { RoomContext } from "../Context/RoomContext";
import Room from "./Room";
function Rooms() {
  const { rooms } = useContext(RoomContext);
  return (
    <section className="py-24">
      <div className="container mx-auto lg:px-0">
        <div className="grid grid-cols-1 max-w-sm mx-auto gap-[30px] lg:grid-cols-3 lg:max-w-none lg:mx-0">
          {rooms.length > 0 ? (
            rooms.map((room) => {
              return <Room room={room} key={room.id} />;
            })
          ) : (
            <p className="text-center text-tertiary">
              No rooms for selected adults and kids. Please book two or more
              rooms
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default Rooms;
