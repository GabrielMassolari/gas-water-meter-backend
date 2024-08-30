import { Sequelize } from "sequelize";
import { databaseConfig } from "./database-config.js";
import Measurement from '../models/measurement.js';
import Customer from '../models/customer.js';

const sequelize = new Sequelize(databaseConfig)

Customer.initModel(sequelize)
Measurement.initModel(sequelize)

export default sequelize