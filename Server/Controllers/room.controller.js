import sequelize from "../dbconnection.js";
import { Room } from "../Models/room.model.js";
import { Roomtype } from "../Models/roomtype.model.js";

export const createRoom = async (req, res) => {
  if (
    !req.files ||
    !req.files["room_image_small"] ||
    !req.files["room_image_large"]
  ) {
    return res.status(400).json({ message: "Both images must be uploaded." });
  }
  const filePaths = [
    `/uploads/${req.files["room_image_small"][0].filename}`,
    `/uploads/${req.files["room_image_large"][0].filename}`,
  ];
  const {
    room_name,
    max_adults,
    max_persons,
    veg_meals_price,
    non_veg_meals_price,
    retail_price,
    selling_price,
    no_of_rooms,
  } = req.body;
  const { username } = req.user;
  const transaction = await sequelize.transaction();
  try {
    const newroomtype = await Roomtype.create(
      {
        room_name: room_name,
        created_by: username,
        updated_by: username,
      },
      { transaction: transaction }
    );

    const newRoom = await Room.create(
      {
        roomtype_id: Number(newroomtype.roomtype_id),
        max_adults: Number(max_adults),
        max_persons: Number(max_persons),
        veg_meals_price: Number(veg_meals_price),
        non_veg_meals_price: Number(non_veg_meals_price),
        retail_price: Number(retail_price),
        selling_price: Number(selling_price),
        no_of_rooms: Number(no_of_rooms),
        image_link: filePaths[0],
        big_image_link: filePaths[1],
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
      include: {
        model: Roomtype,
        attributes: ["room_name"],
      },
    });
    if (rooms.length === 0) {
      return res.status(400).json({ message: "Rooms doesn't exist" });
    }
    const sortedRooms = rooms.filter((room) => room.state === "active");
    return res.status(200).json({ message: "All rooms", rooms: sortedRooms });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const roomfindAdmin = async (req, res) => {
  try {
    const rooms = await Room.findAll({
      include: {
        model: Roomtype,
        attributes: ["room_name"],
      },
    });
    // console.log(rooms);
    if (rooms.length === 0) {
      return res.status(400).json({ message: "Rooms doesn't exist" });
    }
    return res.status(200).json({ message: "All rooms", rooms: rooms });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const avaialableRooms = async (req, res) => {
  try {
    const room_id = req.params.id;
    const room = await Room.findOne({ where: { room_id: room_id } });
    if (!room) {
      return res.status(500).json({ message: "Room doesn't exist" });
    }
    return res.status(200).json({
      message: `No of Rooms is ${room.no_of_rooms}`,
      no_of_rooms: room.no_of_rooms,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Error: ${error.message}` });
  }
};

export const updateRoom = async (req, res) => {
  // const filePaths = [];
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { username } = req.user;
    const {
      room_name,
      max_adults,
      max_persons,
      meals_available,
      state,
      veg_meals_price,
      non_veg_meals_price,
      retail_price,
      selling_price,
      no_of_rooms,
    } = req.body;
    // console.log(
    //   room_name,
    //   max_adults,
    //   max_persons,
    //   meals_available,
    //   state,
    //   veg_meals_price,
    //   non_veg_meals_price,
    //   retail_price,
    //   selling_price
    // );
    console.log(req.body);

    const room = await Room.findByPk(Number(id), { transaction: transaction });
    if (room_name) {
      const checktype = await Roomtype.findOne({
        where: { room_name: room_name },
        transaction: transaction,
      });
      if (!checktype) {
        const newroomtype = await Roomtype.create(
          {
            room_name: room_name,
            created_by: username,
            updated_by: username,
          },
          { transaction: transaction }
        );
        room.roomtype_id = Number(newroomtype.roomtype_id);
      } else {
        room.roomtype_id = Number(checktype.roomtype_id);
      }
    }
    if (max_adults) room.max_adults = Number(max_adults);
    if (max_persons) room.max_persons = Number(max_persons);
    if (veg_meals_price) room.veg_meals_price = Number(veg_meals_price);
    if (non_veg_meals_price)
      room.non_veg_meals_price = Number(non_veg_meals_price);
    if (meals_available) {
      if (meals_available == "false") room.meals_available = false;
      if (meals_available == "true") room.meals_available = true;
    }
    if (retail_price) room.retail_price = Number(retail_price);
    if (selling_price) room.selling_price = Number(selling_price);
    if (no_of_rooms) room.no_of_rooms = Number(no_of_rooms);
    if (state) room.state = state;
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
