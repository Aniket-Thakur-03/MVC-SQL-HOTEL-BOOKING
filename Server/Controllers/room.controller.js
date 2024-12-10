import sequelize from "../dbconnection.js";
import { Room } from "../Models/room.model.js";
import { Roomtype } from "../Models/roomtype.model.js";

export const createRoom = async (req, res) => {
  if(!req.files || !req.files['roomimage'] || !req.files['roomimagelg']){
    return res.status(400).json({message:'Both images must be uploaded.'});
  }
  const filePaths = [
    `/uploads/${req.files['roomimage'][0].filename}`,
    `/uploads/${req.files['roomimagelg'][0].filename}`,
  ];
  const { roomData } = req.body;
  const {username} =req.user;


  console.log(roomData);
  const transaction =await sequelize.transaction();
  try {
    const newroomtype = await Roomtype.create({
      room_name:roomData.room_name,
      created_by:username,
      updated_by:username
    },{transaction:transaction});

    const newRoom = await Room.create({
      roomtype_id:Number(newroomtype.roomtype_id),
      max_adults: Number(roomData.max_adults),
      max_persons: Number(roomData.max_persons),
      veg_meals_price: Number(roomData.veg_meals_price),
      non_veg_meals_price: Number(roomData.non_veg_meals_price),
      retail_price: Number(roomData.retail_price),
      selling_price: Number(roomData.selling_price),
      no_of_rooms: Number(roomData.no_of_rooms),
      image_link: filePaths[0],
      big_image_link: filePaths[1],
      created_by:username,
      updated_by:username
    },{transaction:transaction});
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
    const rooms = await Room.findAll({include:{
      model:Roomtype,
      attributes:["room_name"]
    }});
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
    const rooms = await Room.findAll({include:{
      model:Roomtype,
      attributes:["room_name"]
    }});
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
  try {
    const { id } = req.params;
    const { updatedPrice } = req.body;
    const room = await Room.findByPk(id);
    room.selling_price = updatedPrice;
    await room.save();
    return res.status(200).json({ message: "Updated Successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
