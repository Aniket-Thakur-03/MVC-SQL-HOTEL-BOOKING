import sequelize from "../dbconnection.js";
import { Room } from "../Models/room.model.js";
import { Roomtype } from "../Models/roomtype.model.js";

export const createRoom = async (req, res) => {
  // Check if all six images are uploaded
  if (!req.files || Object.keys(req.files).length !== 6) {
    return res.status(400).json({ message: "All six images must be uploaded." });
  }

  // Create array of file paths for all six images
  const filePaths = Array.from({ length: 6 }, (_, i) => {
    const imageKey = `room_image_${i + 1}`;
    return `/uploads/${req.files[imageKey][0].filename}`;
  });

  const {
    roomtype_id,
    location_id,
    veg_meals_price,
    non_veg_meals_price,
    retail_price,
    selling_price,
    no_of_rooms,
  } = req.body;
  const { username } = req.user;

  const transaction = await sequelize.transaction();
  try {
    const newRoom = await Room.create(
      {
        roomtype_id: Number(roomtype_id),
        location_id: Number(location_id),
        veg_meals_price: Number(veg_meals_price),
        non_veg_meals_price: Number(non_veg_meals_price),
        retail_price: Number(retail_price),
        selling_price: Number(selling_price),
        no_of_rooms: Number(no_of_rooms),
        image_link_1: filePaths[0],
        image_link_2: filePaths[1],
        image_link_3: filePaths[2],
        image_link_4: filePaths[3],
        image_link_5: filePaths[4],
        image_link_6: filePaths[5],
        created_by: username,
        updated_by: username,
      },
      { transaction: transaction }
    );
    await transaction.commit();
    return res.json({ room: newRoom });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return res.json({ message: error.message });
  }
};
export const roomfind = async (req, res) => {
  try {
    const rooms = await Room.findAll({
      where: { state: "active" },
      include: {
        model: Roomtype,
        attributes: ["room_name", "max_adults", "max_persons"],
      },
    });
    if (rooms.length === 0) {
      return res.status(400).json({ message: "Rooms doesn't exist" });
    }
    const sortedRooms = rooms.sort((a, b) => a.room_id - b.room_id);
    const filteredRooms = sortedRooms.filter((room) => room.no_of_rooms > 0);
    return res.status(200).json({ message: "All rooms", rooms: filteredRooms });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const roomfindAdmin = async (req, res) => {
  try {
    const { location_id } = req.user;
    const rooms = await Room.findAll({
      where: { location_id: Number(location_id) },
      include: {
        model: Roomtype,
        attributes: ["room_name", "max_adults", "max_persons"],
      },
    });
    // console.log(rooms);
    if (rooms.length === 0) {
      return res.status(400).json({ message: "Rooms doesn't exist" });
    }
    const sortedRooms = rooms.sort((a, b) => a.room_id - b.room_id);
    return res.status(200).json({ message: "All rooms", rooms: sortedRooms });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// export const avaialableRooms = async (req, res) => {
//   try {
//     const room_id = req.params.id;
//     const room = await Room.findOne({ where: { room_id: room_id } });
//     if (!room) {
//       return res.status(500).json({ message: "Room doesn't exist" });
//     }
//     return res.status(200).json({
//       message: `No of Rooms is ${room.no_of_rooms}`,
//       no_of_rooms: room.no_of_rooms,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: `Error: ${error.message}` });
//   }
// };

export const updateRoom = async (req, res) => {
  const filePaths = {};
  // Check for each image and add to filePaths if present
  for (let i = 1; i <= 6; i++) {
    const fieldName = `room_image_${i}`;
    if (req.files[fieldName]) {
      filePaths[fieldName] = `/uploads/${req.files[fieldName][0].filename}`;
    }
  }

  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { username } = req.user;
    const {
      roomtype_id,
      location_id,
      meals_available,
      state,
      veg_meals_price,
      non_veg_meals_price,
      retail_price,
      selling_price,
      no_of_rooms,
    } = req.body;

    const room = await Room.findByPk(Number(id), { transaction: transaction });

    if (room.roomtype_id != Number(roomtype_id)) {
      const checkRoomtype = await Roomtype.findByPk(Number(roomtype_id), {
        transaction: transaction,
      });
      if (checkRoomtype.isactive == false) {
        throw new Error("Selected Roomtype inactive");
      }
      room.roomtype_id = Number(roomtype_id);
    }

    // Update basic fields if provided
    if (veg_meals_price) room.veg_meals_price = Number(veg_meals_price);
    if (non_veg_meals_price) room.non_veg_meals_price = Number(non_veg_meals_price);
    room.meals_available = meals_available;
    if (retail_price) room.retail_price = Number(retail_price);
    if (selling_price) room.selling_price = Number(selling_price);
    if (no_of_rooms) room.no_of_rooms = Number(no_of_rooms);

    // Handle state change
    if (state == "active") {
      const checkRoomtype = await Roomtype.findByPk(room.roomtype_id);
      if (checkRoomtype.isactive === false) {
        throw new Error("Roomtype not active ");
      } else {
        room.state = state;
      }
    }

    // Update images if provided
    if (filePaths.room_image_1) {room.image_link_1 = filePaths.room_image_1;}
    if (filePaths.room_image_2) {room.image_link_2 = filePaths.room_image_2;}
    if (filePaths.room_image_3) {room.image_link_3 = filePaths.room_image_3;}
    if (filePaths.room_image_4) {room.image_link_4 = filePaths.room_image_4;}
    if (filePaths.room_image_5) {room.image_link_5 = filePaths.room_image_5;}
    if (filePaths.room_image_6) {room.image_link_6 = filePaths.room_image_6;}

    room.updated_by = username;
    await room.save({ transaction: transaction });
    await transaction.commit();
    return res.status(200).json({ message: "Updated Successfully" });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getRoomsLocations = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { checkIn, checkOut, adults, kids, locationId } = req.body;
    const Rooms = await Room.findAll({
      where: { location_id: Number(locationId), state: "active" },
      order: [["room_id", "ASC"]],
      transaction: transaction,
    });
    const total = Number(adults) + Number(kids);
    const findRooms = await Promise.all(
      Rooms.map(async (room) => {
        const destroom = {
          room_id: room.room_id,
          meals_available: room.meals_available,
          retail_price: room.retail_price,
          selling_price: room.selling_price,
          veg_meals_price: room.veg_meals_price,
          non_veg_meals_price: room.non_veg_meals_price,
          no_of_rooms: room.no_of_rooms,
          image_link_1: room.image_link_1,
          image_link_2: room.image_link_2,
          image_link_3: room.image_link_3,
          image_link_4: room.image_link_4,
          image_link_5: room.image_link_5,
          image_link_6: room.image_link_6,
          location_id: room.location_id,
        };
        const roomtype = await Roomtype.findByPk(Number(room.roomtype_id), {
          transaction: transaction,
        });
        return {
          ...destroom,
          room_name: roomtype.room_name,
          max_adults: roomtype.max_adults,
          max_persons: roomtype.max_persons,
        };
      })
    );
    const sortedRooms = findRooms.sort((a, b) => a.max_adults - b.max_adults);
    const filteredRooms = sortedRooms.filter(
      (room) => room.max_adults >= Number(adults) && room.max_persons >= total
    );
    await transaction.commit();
    return res.status(200).json({ rooms: filteredRooms });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const findAllRoomtypes = async (req, res) => {
  try {
    const roomtypes = await Roomtype.findAll();
    if (roomtypes.length === 0) {
      return res.status(400).json({ message: "No Roomtypes exist" });
    }
    return res.status(200).json({ roomtypes: roomtypes });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
export const findAllRoomtypesAdmins = async (req, res) => {
  try {
    const roomtypes = await Roomtype.findAll({ where: { isactive: true } });
    if (roomtypes.length === 0) {
      return res.status(400).json({ message: "No Roomtypes exist" });
    }
    return res.status(200).json({ roomtypes: roomtypes });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
export const createRoomtypes = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { room_name, max_adults, max_persons } = req.body;
    const { username } = req.user;
    await Roomtype.create(
      {
        room_name: room_name,
        max_adults: max_adults,
        max_persons: max_persons,
        created_by: username,
        updated_by: username,
      },
      { transaction: transaction }
    );
    await transaction.commit();
    return res.status(200).json({ message: "Roomtype created successfully" });
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
export const editRoomtypes = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { room_name, max_adults, max_persons, isactive } = req.body;
    console.log(room_name, max_adults, max_persons, isactive);
    const findRoomtype = await Roomtype.findByPk(Number(req.params.id), {
      transaction: transaction,
    });
    if (!findRoomtype) {
      return res.status(400).json({ message: "No roomtype exist" });
    } else {
      if (room_name) findRoomtype.room_name = room_name;
      if (max_adults) findRoomtype.max_adults = max_adults;
      if (max_persons) findRoomtype.max_persons = max_persons;
      findRoomtype.isactive = isactive;
      if (isactive === false) {
        findRoomtype.isactive = isactive;
        await Room.update(
          { state: "inactive" },
          {
            where: { roomtype_id: findRoomtype.roomtype_id },
            transaction: transaction,
          }
        );
      }
      await findRoomtype.save({ transaction: transaction });
      await transaction.commit();
      return res.status(200).json({ message: "Room type updated" });
    }
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const showRoomsWithTypes = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { location_id } = req.user;
    const { locationid } = req.body;
    console.log(location_id, locationid);
    if (location_id) {
      const checkRoom = await Room.findAll({
        where: { location_id: Number(location_id) },
        transaction: transaction,
      });
      if (checkRoom.length === 0) {
        throw new Error("No rooms exist");
      }
      const obj1 = await Promise.all(
        checkRoom.map(async (room) => {
          const roomtype = await Roomtype.findByPk(room.roomtype_id, {
            attributes: ["room_name", "max_adults", "max_persons"],
            transaction: transaction,
          });
          return {
            room_id: room.room_id,
            roomtype_id: room.roomtype_id,
            room_name: roomtype.room_name,
            max_adults: roomtype.max_adults,
            max_persons: roomtype.max_persons,
            meals_available: room.meals_available,
            retail_price: room.retail_price,
            selling_price: room.selling_price,
            veg_meals_price: room.veg_meals_price,
            non_veg_meals_price: room.non_veg_meals_price,
            no_of_rooms: room.no_of_rooms,
            state: room.state,
            location_id: Number(room.location_id),
          };
        })
      );
      await transaction.commit();
      return res.status(200).json({ rooms: obj1 });
    } else if (locationid) {
      const checkRoom = await Room.findAll({
        where: { location_id: Number(locationid) },
        transaction: transaction,
      });
      if (checkRoom.length === 0) {
        throw new Error("No rooms exist");
      }
      const sortedRooms = checkRoom.sort((a, b) => a.room_id - b.room_id);
      const obj1 = await Promise.all(
        sortedRooms.map(async (room) => {
          const roomtype = await Roomtype.findByPk(room.roomtype_id, {
            attributes: ["room_name", "max_adults", "max_persons"],
            transaction: transaction,
          });
          return {
            room_id: room.room_id,
            roomtype_id: room.roomtype_id,
            room_name: roomtype.room_name,
            max_adults: roomtype.max_adults,
            max_persons: roomtype.max_persons,
            meals_available: room.meals_available,
            retail_price: room.retail_price,
            selling_price: room.selling_price,
            veg_meals_price: room.veg_meals_price,
            non_veg_meals_price: room.non_veg_meals_price,
            no_of_rooms: room.no_of_rooms,
            state: room.state,
          };
        })
      );
      await transaction.commit();
      return res.status(200).json({ rooms: obj1 });
    }
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({ message: error.message });
  }
};

export const singleRoomDetails = async (req,res) => {
  try {
    const room = await Room.findByPk(Number(req.params.id));
    return res.status(200).json({room:{
      veg_meals_price:room.veg_meals_price,
      non_veg_meals_price:room.non_veg_meals_price,
  }})
  } catch (error) {
    console.log(error);
    return res.status(500).json({message:error.message})
  }
}