import express from 'express';
import router from './routes/measurementRoutes';
import sequelize from './config/database-connection';

const app = express();

app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({limit: '10mb'}));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});
app.use(router);

sequelize.sync().then(() => {
    app.listen(3333, () => {
        console.log(`Server is running on port 3333`);
    });
});