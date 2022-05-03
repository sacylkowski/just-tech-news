const path = require("path");
const express = require('express');
const exphbs = require("express-handlebars");
const hbs = exphbs.create({});
const routes = require('./controllers/');
// where our connection is
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// turn on routes
app.use(routes);


// turn on connection to db and server
// force: if set to true it would drop and re-create all of the database tables on startup
// works like the DROP TABLE IF EXISTS
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});