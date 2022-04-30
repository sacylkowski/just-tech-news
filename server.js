const express = require('express');
const routes = require('./routes');
// where our connection is
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// turn on routes
app.use(routes);

// turn on connection to db and server
// force: if set to true it would drop and re-create all of the database tables on startup
// works like the DROP TABLE IF EXISTS
sequelize.sync({ force: true }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});