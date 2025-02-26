import { DataTypes } from "sequelize";
import sequelize from "../dbconnection.js";

const Room = sequelize.define(
  "Room",
  {
    room_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    roomtype_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "roomtypes",
        key: "roomtype_id",
      },
    },
    location_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "locations",
        key: "location_id",
      },
    },
    meals_available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    veg_meals_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100,
      validate: {
        min: {
          args: [[0]],
          msg: "Meals price can't be negative",
        },
      },
    },
    non_veg_meals_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 200,
      validate: {
        min: {
          args: [[0]],
          msg: "Meals price can't be negative",
        },
      },
    },
    retail_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [[0]],
          msg: "Retail price can't be negative",
        },
      },
    },
    selling_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [[0]],
          msg: "Selling price can't be negative",
        },
      },
    },
    no_of_rooms: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
      allowNull: false,
      validate: {
        min: {
          args: [[0]],
          msg: "The number of rooms must not decrease more than 0",
        },
        max: {
          args: [[5]],
          msg: "The number of rooms must not exceed 5.",
        },
      },
    },
    image_link_1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_link_2: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_link_3: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_link_4: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_link_5: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_link_6: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "inactive",
      validate: {
        isIn: {
          args: [["active", "inactive"]],
          msg: "state can only be active or inactive",
        },
      },
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
    timestamps: true,
    tableName: "rooms",
    createdAt: "created_at",
    updatedAt: "updated_at",
    hooks: {
      beforeValidate: (room) => {
        if (room.selling_price > room.retail_price) {
          throw new Error("Selling price must be less than retail price");
        }
      },
    },
  }
);

export { Room };
