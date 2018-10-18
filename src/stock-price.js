import React, { Component } from 'react';

export default class StockPrice extends Component {
    render() {
      return (
        <li>{"$" + this.props.stockPrice}</li>
      );
    }
  }
