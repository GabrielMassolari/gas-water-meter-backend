import express from 'express'
import dotenv from 'dotenv'
import router from './routes/measurementRoutes'
import sequelize from './config/database-connection'

dotenv.config()

const app = express()

app.use(router)

sequelize.sync().then(() => {
    app.listen(3333, () => {
        console.log(`Server is running on port 3333`);
    });
});