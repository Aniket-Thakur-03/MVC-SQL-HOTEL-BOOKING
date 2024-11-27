import { Room } from "../room.model.js";

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