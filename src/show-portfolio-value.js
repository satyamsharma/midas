import React, { Component } from 'react';
import { getUserPortfolio, updateUserPortfolioValue } from './user_interactions';
import { getStockPrice } from './iex_interactions';

export default class ShowPortfolioValue extends Component {
    constructor(props){
      super(props);
      this.state = {
        portfolioValue: 0,
        waitingForUpdate: false
      }
    }
  
    componentDidMount(){
      clearInterval(this.interval);
      this.setState({
        user: this.props.user,
        portfolioValue: this.props.user.portfolioValue
      })
    }
  
    render(){
  
      if(!this.state.waitingForUpdate){
  
        this.interval = setInterval(async () => {
              var totalPortfolioValue = 0;
              var user = await getUserPortfolio(this.state.user.id);
              totalPortfolioValue = parseInt(user.cash); 
              const userPortfolio = user.portfolio;

              for(let ticker in userPortfolio){
                    var newPriceOfStock = await getStockPrice(ticker);
                    totalPortfolioValue += (parseInt(userPortfolio[ticker].shares) * parseFloat(newPriceOfStock));
              }

              user.portfolioValue = totalPortfolioValue;

              updateUserPortfolioValue(user).catch((error) => console.log(error));
      
              this.setState({portfolioValue: Math.round(100*totalPortfolioValue)/100, waitingForUpdate: true})
         }, 1000);
        }
      return (
          <li>{"Total portfolio value: $" + this.state.portfolioValue}</li>
      );
    }
  }
