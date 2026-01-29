const express = require('express');
const app = express();
const port = 3000;
const sequelize = require('./utils/db');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');

app.use(cors());
app.use(express.json()); // 
app.use(express.urlencoded({ extended: true })); 

app.use('/user', userRoutes);



sequelize.sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Database sync failed:', err);
  });


module.exports = app; 