import React from "react";
import { Line } from 'react-chartjs-2';

import 'chart.js/auto'


function LineChart1(props){
  return (
    <>
      <Line
        data={props.data}
        options={props.options}
        height={100 }
      />
    </>
  );
}
export default LineChart1;
