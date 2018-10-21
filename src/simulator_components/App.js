import React, { Component } from 'react';
import StockPrice from './stock-price';
import PortfolioTicker from '../simulator_components/portfolio_components/portfolio-ticker';
import { updateUserPortfolio } from '../helpers/interactions/user_interactions';
import { getStockPrice } from '../helpers/interactions/iex_interactions';
import ShowPortfolioValue from './portfolio_components/show-portfolio-value';
import ShowPortfolio from './portfolio_components/show-portfolio';
import ShowCashValue from './portfolio_components/show-cash-value';
import PropTypes from 'prop-types';
import './App.css';

 //mount scoket io on top of http server
var fetch = require('isomorphic-fetch');
var io = require('socket.io-client');

/********************Configure Client Socket with the Backend Socket*****************/
const URL = "http://127.0.0.1:3000";
const socket = io(URL);

/*************************Component Configuration************************************/
class App extends Component {
  constructor(props){
      super(props);
      this.state = {
        responsePrice: false,
        endpoint: "http://127.0.0.1:3000",
        value: "",
        ticker: "",
        showPortfolio: false,
        buyFailed: false,
        sellFailed: false,
        user: {},
        amountOfSharesToBuy: "",
        amountOfSharesToSell: ""
      }
  }

  static propTypes = {
    userId: PropTypes.number.isRequired
  }

  handleBuy(event){
      event.preventDefault();

      var { responsePrice, ticker, amountOfSharesToBuy, user, value } = this.state;
      var totalCostOfShares = responsePrice * parseInt(amountOfSharesToBuy);

      //if the input is empty, just return and do nothing
      if(value == "" || amountOfSharesToBuy == "") return;

      //if user has no shares
      if(isEmpty(user.portfolio)){
        //TODO: Calculate average price brought
        
        //check
        user.portfolio[ticker] = {
          shares: amountOfSharesToBuy
        }

        user.cash = user.cash - totalCostOfShares;

        this.setState({user: user});
        
        updateUserPortfolio(user)
            .catch((err) => {console.log(err)});

        return;
      }

      //If the user has money to buy shares...
      if((user.cash - totalCostOfShares) > 0){
          //...Check if he/she already own the stock
          if(user.portfolio.hasOwnProperty(ticker)){
              //add new amount of shares
        
              user.portfolio[ticker].shares =   parseInt(user.portfolio[ticker].shares) + parseInt(amountOfSharesToBuy);

              //update cash
              user.cash = parseInt(user.cash) - parseInt(totalCostOfShares);

              //update user in db
              updateUserPortfolio(user)
                  .catch((err) => {console.log(err)})

              //update component
              this.setState({user: user, buyFailed: false});
              return;
          }
          //If the user doesn't own any shares of the ticker...
          //Add a new ticker in the portfolio and insert shares bought
          user.portfolio[ticker] = {
              shares: amountOfSharesToBuy
          };
          
          //update cash
          user.cash = user.cash - totalCostOfShares;
        
          //update component
          this.setState({user: user, buyFailed: false});

          //update user in db
          updateUserPortfolio(user)
              .catch((err) => {console.log(err)})

      } else {
          //if none of these checks passed, the user does not have enough cash to buy stocks.
          this.setState({buyFailed: true});
      }
  
  }

  handleSell(event){
      event.preventDefault();
      
      var { responsePrice, ticker, amountOfSharesToSell, user, sellResponse, value } = this.state;

      if(value == "" || amountOfSharesToSell == "") return;

      getStockPrice(ticker)
        .then((price) => {
            //if the user doesnt own stocks...
            if(isEmpty(user.portfolio)){
              this.setState({sellFailed: true});
            } else {
                    //check if the user has the stock 
                    if(user.portfolio.hasOwnProperty(ticker)){
                      //Check if he/she has more than or equal to x amount of shares to sell
                          var userOwnedShares = parseInt(user.portfolio[ticker].shares);

                          if(userOwnedShares >= parseInt(amountOfSharesToSell)){
                                //remove x amount of shares from ticker object in portfolio
                                user.portfolio[ticker].shares = parseInt(userOwnedShares) - parseInt(amountOfSharesToSell);

                                //add price x amount of shares to cash    
                                user.cash = parseInt(user.cash) + (parseInt(amountOfSharesToSell) * parseInt(price));

                                //Update user Portfolio on backend
                                updateUserPortfolio(user)
                                  .catch((err) => {console.log(err)});

                                //Update component for client
                                this.setState({user: user, sellFailed: false});
                          } else {
                            this.setState({sellFailed: true});
                          }
                    }                          
           
           }
        });
  }

  handleBuyChange(event){
      //need to do this to access event.target.value through handleBuy/handleSell
      this.setState({amountOfSharesToBuy: event.target.value});
  }

  handleSellChange(event){
    this.setState({amountOfSharesToSell: event.target.value});
  }

  handleShowPortfolio(event){
    event.preventDefault();
    this.setState({showPortfolio: true});
  }

  handleChange(event){
      var newValue = event.target.value.toLowerCase();
    
      if(newValue == "") {
        this.setState({value: newValue, response: false}) 
      } else {
        this.setState({value: newValue});
      }
  }

  handleSubmit(event) {
    event.preventDefault(); //prevent the form from opening another window

    //if value in input is empty...
    if(this.state.value == "") this.setState({value: "", response: false});

    //check if quote is valid...


    //get instant quote and update state
    socket.emit('get quote', this.state.value); //works
    socket.on("stock price", data => this.setState({ ticker: this.state.value, responsePrice: data }));
  }

  //Store dummy user once the component first renders using the built in componentWillMount() react function.
  componentDidMount(){
        fetch("/api/user/" + this.props.userId)
                .then((response) => {
                    return response.json();
                })
                .then((user) => {

                    this.setState({user: user});
                })
                .catch((err) => {
                  console.log(err);
                });
  }

  render() {
  
    var { responsePrice, showPortfolio, buyFailed, sellFailed, user } = this.state;

    console.log("UPDATED RESPONSE PRICE")
    return (
      <div className="App">
        <p>Midas Stock Trading Simulator Prototype</p>

          {/*main ticker input*/}
          <form onSubmit={(event) => this.handleSubmit(event)}>
            <input type="text"  placeholder="msft" onChange={(event) => this.handleChange(event)}/>
            <input type="submit" value="Submit" />
          </form>

          {/*Return StockPrice if we get a response back from the server*/}
           {responsePrice ? <StockPrice stockPrice={responsePrice} /> : <span>No information available yet</span> }

          {/*Buy button*/}
          <form onSubmit={(event) => this.handleBuy(event)}>
            <label for="buy">Buy</label>
            <input type="text" placeholder="x amount of shares" onChange={(event) => this.handleBuyChange(event)}/>
            <input type="submit" value="Submit" />
          </form>

          {buyFailed ? <div><span>Buy unsuccessful. Not enough cash.</span></div> : <span></span>}

          {/*Sell button*/}
          <form onSubmit={(event) => this.handleSell(event)}>
             <label for="buy">Sell</label>
             <input type="text" placeholder="x amount of shares" onChange={(event) => this.handleSellChange(event)}/>
             <input type="submit" value="Submit" />
          </form>


          {sellFailed ? <div><span>Sell unsuccessful. Not enough shares to sell</span></div> : <span></span>}

          {/*Button to show users portfolio*/}
          <form onSubmit={(event) => this.handleShowPortfolio(event)}>
            <input type="submit" value="Show Portfolio" />
          </form>


          {showPortfolio ? <ShowCashValue cashValue={user.cash} /> : <span></span>}
          {showPortfolio ? <ShowPortfolio cashValue={user.cash} user={user}/> : <span></span>}

      </div>
    );
  }

}


//Helper functions 
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}








export default App;
