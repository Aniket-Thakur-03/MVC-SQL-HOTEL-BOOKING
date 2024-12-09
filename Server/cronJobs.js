import cron from "node-cron";
import { Room } from "./Models/room.model.js";

const updateSellingPrice = async () => {
  try {
    const dayOfWeek = new Date().getDay();
    let priceMultiplier;
    switch (dayOfWeek) {
      case 0:
        priceMultiplier = 0.9;
        break;
      case 1:
        priceMultiplier = 0.8;
        break;
      case 2:
        priceMultiplier = 0.8;
        break;
      case 3:
        priceMultiplier = 0.8;
        break;
      case 4:
        priceMultiplier = 0.8;
        break;
      case 5:
        priceMultiplier = 0.9;
        break;
      case 6:
        priceMultiplier = 0.9;
        break;
      default:
        priceMultiplier = 0.8;
        break;
    }
    const rooms = await Room.findAll();
    rooms.forEach(async (room) => {
      if (room.retail_price) {
        const updatedSellingPrice = room.retail_price;
        const mealprice = 100;
        await room.update({
          selling_price: updatedSellingPrice,
          meals_price: mealprice,
        });
        console.log(
          `Updated selling price ${updatedSellingPrice} for room ID ${room.room_id}`
        );
      }
    });
    console.log(
      "Selling prices updated for all rooms based on the day of week"
    );
  } catch (error) {
    console.error("Error updating selling prices", error);
  }
};

cron.schedule("*/10 * * * * *", updateSellingPrice, {
  scheduled: true,
  timezone: "Asia/Kolkata",
});

//'*/10 * * * * *' for every 10 seconds
//'0 0 * * *' for every 12 a.m midnight
