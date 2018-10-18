import React, { Component } from 'react';
import PortfolioTicker from './portfolio-ticker';
import ShowPortfolioValue from './show-portfolio-value';

class ShowPortfolio extends Component {
    constructor(props){
      super(props);
  
      this.state = {
        portfolio: {},
        portfolioList: [],
        waitingForUpdate: false
  
      }
    }
  
    render() {
     var { user, cashValue } = this.props;
     var portfolioList = [];

     for(let ticker in user.portfolio) portfolioList.push(<PortfolioTicker ticker={ticker} user={user} />);
     
     return (
        <div>
          <ShowPortfolioValue user={user}/>
          {portfolioList}
        </div>
        
      );
    }
  }

  export default ShowPortfolio;