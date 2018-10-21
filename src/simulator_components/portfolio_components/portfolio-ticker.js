import React, { Component } from 'react';
import { getUserPortfolio } from '../../helpers/interactions/user_interactions';
import { getStockPrice } from '../../helpers/interactions/iex_interactions';
import PropTypes from 'prop-types';
import { List } from 'semantic-ui-react'

export default class PortfolioTicker extends Component {
  constructor(props){
      super(props);
      this.state = {
        shares: this.props.user.portfolio[this.props.ticker].shares,
        user: this.props.user,
        ticker: this.props.ticker,
        waitingForUpdate: false
      } 
  }

  static propTypes = {
    ticker: PropTypes.string.isRequired,
    user: PropTypes.objectOf(PropTypes.any.isRequired)
  }

  componentDidMount(){
    clearInterval(this.interval);
    getTickerPrice(this.props.ticker).then(async (tickerPrice) => {
       this.setState({price: tickerPrice,})
    });
    
   
  }

  render(){
  
    if(!this.state.waitingForUpdate){
      this.interval = setInterval(async () => {
            console.log("UPDATED");
            var newPrice = await getStockPrice(this.state.ticker);
            var user = await getUserPortfolio(this.state.user.id);
            
            var amountOfSharesOwned = user.portfolio[this.state.ticker].shares;
          
            this.setState({price: newPrice, shares: amountOfSharesOwned, waitingForUpdate: true, user: user});
      }, 1000);
    }
     
    return (
             <List.Item>
                  <List.Content>
                          <List.Header>{this.state.ticker + " " + this.state.price}</List.Header>
                          {"Shares: " + this.state.shares}
                  </List.Content>
             </List.Item>
    );
  }
}

async function getTickerPrice(ticker){
  var tickerPrice = await getStockPrice(ticker)
  return tickerPrice;
}