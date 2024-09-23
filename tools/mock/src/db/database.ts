import { Sequelize } from "sequelize";
import { Config } from "../config";

export default new Sequelize(
    Config.db.name,
    Config.db.username,
    Config.db.password,
    {
        host: "localhost",
        dialect: "postgres",
    }
);
