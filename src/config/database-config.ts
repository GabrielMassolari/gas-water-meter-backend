import { Dialect } from "sequelize";

export const databaseConfig = {
    dialect: 'postgres' as Dialect,
    host: 'localhost',
    username: 'postgres',
    password: 'postgres',
    database: 'db_measurement',
    define: {
      timestamps: true,
      freezeTableName: true,
      underscored: true
    }
};