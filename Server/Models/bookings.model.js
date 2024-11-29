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
    payment_due: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    booking_status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "pending",
      validate: {
        isIn: [["pending", "confirmed", "cancelled"]],
      },
    },
    payment_status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "unpaid",
      validate: {
        isIn: [["unpaid", "partial", "paid"]],
      },
    },
    checked_status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "not_checked",
      validate: {
        isIn: [["not_checked", "checked_in", "checked_out"]],
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
    },
    cancellation_reasons: {
      type: DataTypes.TEXT,
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
