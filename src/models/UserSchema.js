require('dotenv').config()
var Sequelize       = require('sequelize');


//connect
const sequelize = new Sequelize({
    database: process.env.DBNAME,
    username: process.env.USER,
    password: process.env.PASSWORD,
    dialect: 'postgres',
    port: 5433
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
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

// Users.sync({force: true}).then(() => {
//     // Table created
//     return Users.create({
//       firstName: 'John',
//       lastName: 'Hancock',
//       age: 23,
//       country: 'USA',
//       cash: 10000,
//       email: 'pvanny1124@gmail.com',
//       username: 'patrickv',
//       password: 'swaggy1124'
//     }).then(user => {
//       console.log(user);
//     });
//   });

Users.update({
        portfolio: {
              aapl: {
                shares: 5
              },
              amd: {
                shares: 4
              }
            },
          cash: 100000
         },
         {
           where: {id: 1},
           returning: true,
           raw: true
         }
      ).then(user => {
        console.log(user[1][0]);
      })

  

  module.exports = Users;