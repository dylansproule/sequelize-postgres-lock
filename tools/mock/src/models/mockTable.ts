import { DataTypes } from "sequelize";
import database from "../db/database";

export const MockTable = database.define(
  "mockUpdates",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderId: {
      type: DataTypes.CHAR,
    },
    state: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['orderId'],
      },
    ]
  }
);
