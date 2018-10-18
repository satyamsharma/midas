import React, { Component } from 'react';
import { getUserPortfolio } from './user_interactions';
import { getStockPrice } from './iex_interactions';

export default class PortfolioTicker extends Component {
  constructor(props){
      super(props);
      this.state = {
        price: 0,
        shares: 0,
        waitingForUpdate: false
      }
  }

  componentDidMount(){
    clearInterval(this.interval);
    getTickerPrice(this.props.ticker).then(async (tickerPrice) => {
      this.setState({
        user: this.props.user,
        ticker: this.props.ticker,
        price: tickerPrice,
      })
    });
   
  }


  render(){
  
    if(!this.state.waitingForUpdate){
      this.interval = setInterval(async () => {
            var newPrice = await getStockPrice(this.state.ticker);
            var user = await getUserPortfolio(this.state.user.id);
            
            var amountOfSharesOwned = user.portfolio[this.state.ticker].shares;
          
            this.setState({price: newPrice, shares: amountOfSharesOwned, waitingForUpdate: true, user: user});
      }, 1000);
    }
     
    return (
        <li>{"Ticker: " + this.state.ticker + " current price: " + this.state.price + " shares owned: " + this.state.shares}</li>
    );
  }
}

async function getTickerPrice(ticker){
  var tickerPrice = await getStockPrice(ticker)
  return tickerPrice;
}