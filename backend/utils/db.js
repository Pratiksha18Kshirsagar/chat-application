const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('chat_application', 'root', 'Pratiksha@18', {
  host: 'localhost',
  dialect: 'mysql' ,
});



// Test the database connection 
(async ()=>{
try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
})();


module.exports = sequelize;