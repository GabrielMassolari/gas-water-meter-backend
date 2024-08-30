import { DataTypes, Model, Sequelize } from "sequelize";
import Customer from "./customer";

class Measurement extends Model {
    public id!: string;
    public customer_id!: number;
    public measure_datetime!: Date;
    public measure_type!: string;
    public measure_value!: number;
    public image_url!: string;
    public has_confirmed!: boolean;

    static initModel(sequelize: Sequelize){
        super.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            }, 
            customer_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                  model: 'customers',
                  key: 'id',
                },
              },
            measure_datetime: {
                type: DataTypes.DATE,
                allowNull: false,
              },
            measure_type: {
                type: DataTypes.ENUM('WATER', 'GAS'),
                allowNull: false,
              },
            measure_value: {
                type: DataTypes.INTEGER,
                allowNull: true,
              },
            image_url: {
                type: DataTypes.STRING,
                allowNull: false,
              },
            has_confirmed: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
              },
        }, {sequelize,
            modelName: 'measurement',
            tableName: 'measurements'})

        Customer.hasMany(Measurement, {
            foreignKey: 'customer_id',
            as: 'measurements'
        });
        Measurement.belongsTo(Customer, {
            foreignKey: 'customer_id',
            as: 'customer'
        });
    }
}

export default Measurement;