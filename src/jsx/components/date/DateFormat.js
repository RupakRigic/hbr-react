import React from 'react';

const DateComponent = ({ date }) => {
  // Formatting date as MM/DD/YY using Intl.DateTimeFormat
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date(date));

  return <span>{formattedDate}</span>;
};

export default DateComponent;
