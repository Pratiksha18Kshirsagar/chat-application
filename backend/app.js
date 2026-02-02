const express = require('express');
const app = express();
const port = 4000;
const sequelize = require('./utils/db');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
require('./models/index');
const cors = require('cors');

app.use(cors());
app.use(express.json()); // 
app.use(express.urlencoded({ extended: true })); 

app.use('/user', userRoutes);
app.use('/chat', chatRoutes);



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