require('dotenv').config();
const express       = require("express");
const http          = require("http");
const socketIo      = require("socket.io");
const fetch         = require('isomorphic-fetch');
const mongoose      = require('mongoose');
const app           = express();
var Users           = require('./models/UserSchema');
var bodyParser      = require('body-parser');
var Sequelize       = require('sequelize');
var iextrading      = require('./helpers/interactions/iex_interactions');


/*******************Basic Setup and Configuration**********************/
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(function(req, res, next) {  

  //Following is needed to allow a fetch put request to work on the client side:

    //Website you wish to allow to connect
    var allowedOrigins = ['http://127.0.0.1:3001', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://localhost:3000'];
    var origin = req.headers.origin;

  
    if(allowedOrigins.indexOf(origin) > -1){
         res.setHeader('Access-Control-Allow-Origin', origin);
    }
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});  

/***********************Database Configuration*************************/

console.log(process.env.ENDPOINT);

const sequelize = new Sequelize({
  database: process.env.DBNAME,
  username: process.env.USER,
  password: process.env.PASSWORD,
  dialect: 'postgres',
  port: 5433
});

//Testing sequelize connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


const Op = sequelize.Op; //operations for where conditions
const port = 3000;

const server = http.createServer(app);
const io = socketIo(server); 


/******************************End of configuration************************/



/*******************************Routing Configuration*************************************/

//main route to return our dummy data in json
app.get("/api/user/:id", function(req, res){
  const userId = req.params.id;
  Users.findAll({where: { id: userId }, raw: true})
    .then(data => {
      res.json(data[0]);
  }).catch((err) => {
      res.send(err);
    })
});

//route to update the dummy data's portfolio/cash
app.put("/api/user/:id", function(req, res){
  const userId = req.params.id;
  const newPortfolio = req.body.portfolio;
  const newCashValue = req.body.cash;

  Users.update({portfolio: newPortfolio, cash: newCashValue}, 
        { where: { id: userId },
          returning: true,
          raw: true
        }).then(data => {
            res.json(data[1][0]);
        }).catch((error) => {
            console.log(error);
        });
});

app.put("/api/user/:id/portfolio-value", function(req, res){
  const newPortfolioValue = req.body.portfolioValue;
  const user_id = req.body.id;

  Users.update({portfolioValue: newPortfolioValue}, 
        { where: { id: user_id },
          returning: true,
          raw: true
        }).then(data => {
            res.json(data[1][0]);
        }).catch((error) => {
            console.log(error);
        });
});


// /*************************************Socket Configuration*******************************/
io.on("connection", socket => {

      console.log("New client connected");

      let interval;

      socket.on("get quote", (ticker) => {
            if (interval) clearInterval(interval);
            interval = setInterval(() => getStockPriceAndEmit(socket, ticker), 104);
      });

      socket.on("disconnect", () => {
          clearInterval(interval);
        console.log("Client disconnected");
      });

});

server.listen(port, () => console.log(`Listening on port ${port}`));


/******************************Helper Functions*************************************/

const getStockPriceAndEmit = async (socket, ticker) => {
    try {
      const res = await iextrading.getStockPrice(ticker); // Getting the data from DarkSky
      console.log(res);
      socket.emit("stock price", res); // Emitting a new message to the client

    } catch (error) {
      console.error(`Error: ${error.code}`);
    }
  };


  
// Users.findAll({
//   attributes: ['portfolio', 'id'],
//   where: {
//       id: 2, 
//       portfolio: { 
//         [Op.ne]: null //not null
//       }
//   },
//   raw: true
// })
//   .then(data => {
//   console.log(data[0]);
// })



  
  //force: true will drop the table if it already exists
  // Users.sync({force: true}).then(() => {
  //   // Table created
  //   return User.create({
  //     firstName: 'John',
  //     lastName: 'Hancock',
  //     age: 23,
  //     country: 'USA',
  //     cash: 10000,
  //     email: 'pvanny1124@gmail.com',
  //     username: 'patrickv',
  //     password: 'swaggy1124'
  //   });
  // });

  //Creating...
  // Users.create({
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

//updating
// Users.update({
//         portfolio: {
//               aapl: {
//                 shares: 5
//               },
//               amd: {
//                 shares: 4
//               }
//             }
//          },
//          {
//            where: {id: 1},
//            returning: true,
//            raw: true
//          }
//       ).then(user => {
//         console.log(user[1][0]);
//       })




