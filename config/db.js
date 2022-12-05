require('dotenv').config();
// const mongoose = require('mongoose');

// const connectDB = async () => {
//     try {
//     //   await mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`, {
//     await mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`, { 
//         // useFindAndModify: false,
//         // useUnifiedTopology: true,
//         // useNewUrlParser: true,
//         // useCreateIndex: true,
//       });
//       console.log('MongoDB Connected!');
//     } catch (err) {
//       console.error(err.message);
//       process.exit(1);
//     }
//   };

//   module.exports = connectDB;


const { Sequelize } = require('sequelize');

const sequelize= new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, '', {
  host: process.env.DB_READ_WRITE_HOST,
  // port: process.env.DB_PORT,
  dialect: 'mysql' /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
});
// const connectDB = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('Connection has been established successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// };

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})()

module.exports = sequelize;



