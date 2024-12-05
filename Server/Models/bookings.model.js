import { DataTypes } from "sequelize";
import sequelize from "../dbconnection.js";
import { User } from "./user.model.js";
import { Room } from "./room.model.js";

const Booking = sequelize.define(
  "Booking",
  {
    booking_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id",
      },
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "rooms",
        key: "room_id",
      },
    },
    meal_chosen:{
      type:DataTypes.BOOLEAN,
      allowNull:false,
      defaultValue:false
    },
    meal_price:{
      type:DataTypes.INTEGER,
      allowNull:false,
      defaultValue:0
    },
    payment_due: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate:{
        min:{
          args:0,
          msg:"payment due can't be negative"
        }
      }
    },
    room_price:{
      type:DataTypes.INTEGER,
      allowNull:false,
    },
    booking_status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "pending",
      validate: {
        isIn: {
          args:[["pending", "confirmed", "cancelled"]],
          msg:"Wrong booking status"
        }
      },
    },
    payment_status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "unpaid",
      validate: {
        isIn: {
          args:[["unpaid", "partial", "paid"]],
          msg:"Wrong payment status"
        }
      },
    },
    checked_status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "not_checked",
      validate: {
        isIn: {
          args:[["not_checked", "checked_in", "checked_out"]],
          msg:"Wrong Check Status"
        }
      },
    },
    guest_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    guest_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    guest_phone_no: {
      type: DataTypes.CHAR(10),
      allowNull: false,
    },
    check_in_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    check_out_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    no_of_adults: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    no_of_kids: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    guest_aadhar_card: {
      type: DataTypes.CHAR(12),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    specia_requests: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    amount_paid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate:{
        min:{
          args:0,
          msg:"amount paid can't be negative"
        }
      }
    },
    cancellation_reasons: {
      type: DataTypes.TEXT,
      defaultValue:null
    },
  },
  {
    timestamps: true,
    tableName: "bookings",
    schema: "hotel_booking",
    createdAt: "created_at",
    updatedAt: "updated_at",
    }
);

User.hasMany(Booking, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

Booking.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });

Room.hasMany(Booking, {
  foreignKey: "room_id",
  onDelete: "CASCADE",
});
Booking.belongsTo(Room, { foreignKey: "room_id", onDelete: "CASCADE" });

export { Booking };
