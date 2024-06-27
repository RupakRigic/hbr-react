import React from 'react';

const PriceComponent = ({ price }) => {
  // Check if the price needs adjustment
  const currencyFormat = (num) => {
    if (isNaN(num) || typeof num !== 'number') {
      return '$0.00';
    }
    const parts = num.toFixed(2).split('.');
    const integerPart = parts[0];
    // const decimalPart = parts[1] || '';
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return '$' + formattedIntegerPart // + (decimalPart ? '.' + decimalPart : '');
  }

  const formattedPrice = currencyFormat(price);
  return <span>{formattedPrice}</span>;
};

export default PriceComponent;
