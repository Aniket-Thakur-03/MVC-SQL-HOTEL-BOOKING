import { DataTypes } from "sequelize";
import sequelize from "../dbconnection.js";

const ExtraService = sequelize.define(
  "ExtraService",
  {
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    service_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    service_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    location_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "locations",
        key: "location_id",
      },
    },
    gst_rate: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    isactive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "extraservices",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export { ExtraService };
