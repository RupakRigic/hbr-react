import React, { useState } from "react";
import RechartJs from "../../components/charts/rechart";

const Statistics = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  return (
    
    <>

    <div className="container-fluid pt-0">
      <div className="row mt-3">
        <div className="col-md-12">
          <RechartJs />
        </div>
      </div>
    </div>
    </>
  );
};

export default Statistics;
