import { Room } from "../Models/room.model.js";

export const createRoom = async (req,res) => {
    const {roomData} = req.body;
    try {
        const newRoom = await Room.create({
            room_type: roomData.room_type,
            max_adults: roomData.max_adults,
            max_persons: roomData.max_persons,
            meals_price: roomData.meals_price,
            retail_price: roomData.retail_price,
            selling_price: roomData.selling_price,
            no_of_rooms: roomData.no_of_rooms,
            image_link: roomData.image_link,
        })
        return res.json({room:newRoom});
    } catch (error) {
        console.error(error);
        return res.json({message:error.message});
    }
}

export const avaialableRooms = async(req,res)=>{
    try {
        const room_id = req.params.id;
        const room = await Room.findOne({where:{room_id:room_id}});
        if(!room){
            return res.status(500).json({message:"Room doesn't exist"});
        }
        return res.status(200).json({message:`No of Rooms is ${room.no_of_rooms}`,no_of_rooms:room.no_of_rooms})
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:`Error: ${error.message}`})
    }
}