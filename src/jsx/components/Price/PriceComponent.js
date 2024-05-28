import React from 'react';

const PriceComponent = ({ price }) => {
  // Check if the price needs adjustment
  const adjustedPrice = Number.isInteger(price) && price >= 100 ? price / 100 : price;

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(adjustedPrice);

  return <span>{formattedPrice}</span>;
};

export default PriceComponent;
