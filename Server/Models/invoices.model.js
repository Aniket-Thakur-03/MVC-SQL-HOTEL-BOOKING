import { DataTypes } from "sequelize";
import sequelize from "../dbconnection.js";

const Invoice = sequelize.define(
  "Invoice",
  {
    invoice_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    booking_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "bookings",
        key: "booking_id",
      },
    },
    location_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "locations",
        key: "location_id",
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
    invoice_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    invoice_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "invoices",
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export { Invoice };
