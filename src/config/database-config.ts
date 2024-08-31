import { Dialect } from "sequelize";

export const databaseConfig = {
    dialect: 'postgres' as Dialect,
    host: 'db',
    username: 'postgres',
    password: 'postgres',
    database: 'db_measurement',
    define: {
      timestamps: true,
      freezeTableName: true,
      underscored: true
    }
};