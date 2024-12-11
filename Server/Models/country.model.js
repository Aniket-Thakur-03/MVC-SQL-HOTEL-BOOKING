import { DataTypes } from "sequelize";
import sequelize from "../dbconnection.js";
export const Country = sequelize.define(
  "Country",
  {
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    country_iso_code: {
      type: DataTypes.STRING(3),
      allowNull: false,
    },
    country_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "countries",
    schema: "hotel_booking",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);
