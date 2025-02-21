import { DataTypes } from "sequelize";
import sequelize from "../dbconnection.js";

const Feature = sequelize.define(
  "Feature",
  {
    feature_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    feature_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    feature_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "features",
  }
);

export { Feature };
