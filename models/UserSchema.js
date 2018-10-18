var Sequelize       = require('sequelize');

var dbUsername = process.env.USER;
var dbPassword = process.env.PASSWORD;
var db = "midas";

//connect
const sequelize = new Sequelize({
    database: db,
    username: dbUsername,
    password: dbPassword,
    dialect: 'postgres',
    port: 5433
  });

//schema
const Users = sequelize.define('users', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false

    },
    username: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    cash: {
      type: Sequelize.FLOAT
    },
    portfolioValue: {
      type: Sequelize.FLOAT
    },
    age: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    country: {
      type: Sequelize.STRING,
      allowNull: false
    },
    portfolio: {
      type: Sequelize.JSONB
    }
})

  module.exports = Users;