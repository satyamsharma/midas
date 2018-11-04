import React, { Component } from 'react';
import PortfolioTicker from './portfolio-ticker';
import ShowPortfolioValue from './show-portfolio-value';
import PropTypes from 'prop-types';
import { List, Segment } from 'semantic-ui-react'

class ShowPortfolio extends Component {
    constructor(props){
      super(props);
  
      this.state = {
        portfolio: {},
        portfolioList: [],
        waitingForUpdate: false
  
      }
    }

    static propTypes = {
      user: PropTypes.objectOf(PropTypes.any.isRequired),
      cashValue: PropTypes.number
    }

    
    render() {
     var { user, cashValue } = this.props;
     var portfolioList = [];
  

     for(let ticker in user.portfolio) portfolioList.push(<PortfolioTicker ticker={ticker} user={user} />);
     
     return (
        <div>
          <ShowPortfolioValue user={user}/>
    
          <Segment inverted>
              <List divided inverted relaxed>
                      {portfolioList}
              </List>
            </Segment>
                
        </div>
        
      );
    }
  }

  export default ShowPortfolio;