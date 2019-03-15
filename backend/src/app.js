const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { User } = require('../models/user');
const { Stage } = require('../models/stages');
const routes = require('./routes');

const app = express();

const PORT = 8000 || process.env.PORT;


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(routes);

app.use('/user', async (req, res) => {
  const users = await User.query();
  res.status(200).json({ users });
});


app.use('*', (req, res, next) => {
  res.status(200).json({ data: 'yessur', status: 200});
});



app.use((req, res, next) => {
  res.status(404).json({
    code: 404,
    message: 'Page not found'
  });
});

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`)
});


