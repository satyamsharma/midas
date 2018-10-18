import React, { Component } from 'react';

//ShowCashValue displays users cash passed in as a prop
export default class ShowCashValue extends Component {
    render(){
      var cashValue = this.props.cashValue;
      return (
        <div>
          <span>{"Cash on account: " + "$" + Math.round(100*cashValue)/100}</span>
        </div>
      );
    }
  }