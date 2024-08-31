import { Sequelize } from "sequelize";
import { databaseConfig } from "./database-config.js";
import Measurement from '../models/measurement.js';

const sequelize = new Sequelize(databaseConfig);

Measurement.initModel(sequelize);

export default sequelize;