import { DataTypes, Model, Sequelize } from "sequelize";
import Measurement from "./measurement";

class Customer extends Model {
    public id!: number;
    public nome!: string;

    static initModel(sequelize: Sequelize) {
        Customer.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            nome: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }, {
            sequelize,
            modelName: 'customer',
            tableName: 'customers'});
    }
}

export default Customer;