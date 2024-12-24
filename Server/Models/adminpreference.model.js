import { DataTypes } from "sequelize";
import sequelize from "../dbconnection.js";

const AdminPreference = sequelize.define(
  "AdminPreference",
  {
    preference_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "useradmins",
        key: "admin_id",
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
    feature_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "features",
        key: "feature_id",
      },
    },
    isgranted: {
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
    tableName: "adminpreferences",
    schema: "hotel_booking",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export { AdminPreference };
