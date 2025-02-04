import Room from "./Room";

function Rooms({ rooms }) {
  // Filter out rooms with no available rooms (noOfRooms === 0)
  const availableRooms = rooms.filter((room) => room.no_of_rooms > 0);

  return (
    <section className="py-24">
      <div className="container mx-auto lg:px-0">
        <div className="grid grid-cols-1 max-w-sm mx-auto gap-[30px] lg:grid-cols-3 lg:max-w-none lg:mx-0">
          {rooms.length > 0 ? (
            availableRooms.length > 0 ? (
              availableRooms.map((room) => {
                return <Room room={room} key={room.room_id} />;
              })
            ) : (
              <p className="mx-auto text-center text-tertiary">
                No rooms for selected adults and kids. Please book two or more
                rooms.
              </p>
            )
          ) : (
            <p className="mx-auto text-center text-tertiary">
              {" "}
              No rooms avaiable
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default Rooms;
