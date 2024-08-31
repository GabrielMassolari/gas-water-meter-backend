import { DataTypes, Model, Sequelize } from "sequelize";

class Measurement extends Model {
    declare id: string;
    declare customer_id: number;
    declare measure_datetime: Date;
    declare measure_type: string;
    declare measure_value: number;
    declare image_url: string;
    declare has_confirmed: boolean;

    static initModel(sequelize: Sequelize){
        super.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            }, 
            customer_code: {
                type: DataTypes.STRING,
                allowNull: false,
              },
            measure_datetime: {
                type: DataTypes.DATEONLY,
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
    }
}

export default Measurement;