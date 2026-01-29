const express = require('express');
const app = express();

app.use(express.json());
const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app; 