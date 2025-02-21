import sequelize from "../dbconnection.js";
import { DataTypes } from "sequelize";
import { Room } from "./room.model.js";

const Roomtype = sequelize.define(
  "Roomtype",
  {
    roomtype_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    room_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    max_adults: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    max_persons: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isactive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    tableName: "roomtypes",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Room.hasOne(Roomtype, { foreignKey: "roomtype_id" });
Roomtype.belongsTo(Room, { foreignKey: "roomtype_id" });

export { Roomtype };
