import React, { useState, useEffect, useRef } from "react";
// import { Link } from 'react-router-dom';
import { Row, Col, Card } from "react-bootstrap";
import PageTitle from "../../../layouts/PageTitle";
import LineChart1 from "../Chartjs/line1";
import BarChart1 from "../Chartjs/bar1";
import { Link, useNavigate } from "react-router-dom";
import AdminWeeklyDataService from "../../../../API/Services/AdminService/AdminWeeklyDataService";
import { orange } from "@mui/material/colors";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


function RechartJs() {
  const [currentDisplay, setCurrentDisplay] = useState(1);
  const [value, setValue] = React.useState("1");

  const [filterQuery, setFilterQuery] = useState({
    to: "",
    from: "",
  });

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [type, setType] = useState("");

  const [graph1Title,setgraph1Title] = useState("");
  const [graph2Title,setgraph2Title] = useState("");
  const [graph3Title,setgraph3Title] = useState("");
  const [graph4Title,setgraph4Title] = useState("");
  const [graph5Title,setgraph5Title] = useState("");
  const [graph6Title,setgraph6Title] = useState("");

  useEffect(() => {
    const currentDate = new Date(); // Today's date
    const currentYear = currentDate.getFullYear(); // Current year
    const firstDayOfYear = new Date(currentYear, 0, 1); // First day of the current year
    const formatDate = (date) => {
      const padToTwoDigits = (num) => num.toString().padStart(2, '0');
      return `${padToTwoDigits(date.getMonth() + 1)}/${padToTwoDigits(date.getDate())}/${date.getFullYear()}`;
    };
    setStartDate(formatDate(firstDayOfYear));
    setEndDate(formatDate(currentDate));
  }, []);


  const handleFilterDateFrom = (date) => {
    if (date) {
      const formattedDate = date.toLocaleDateString('en-US'); // Formats date to "MM/DD/YYYY"
      console.log(formattedDate)

      setStartDate(formattedDate)

    } else {
      setStartDate('')

    }
  };

  const handleFilterDateTo = (date) => {
    if (date) {
      const formattedDate = date.toLocaleDateString('en-US');
      console.log(formattedDate)
      setEndDate(formattedDate)

    } else {
    
      setEndDate('')
    }
  };

  const parseDate = (dateString) => {
    const [month, day, year] = dateString.split('/');
    return new Date(year, month - 1, day);
  };

  const [BuyerTrafficData, setBuyerTrafficdata] = useState({
    defaultFontFamily: "Poppins",
    labels: ["0", "01-07", "01-14", "01-21"],
    datasets: [
      {
        label: "My First Dataset",
        data: [0, 2000, 4500, 500],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.4,
      },
    ],
  });

  const [BuyerTrafficOption, setBuyerTrafficOption] = useState({
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 5000,
        ticks: {
          beginAtZero: true,
          padding: 0,
        },
        grid: {
          color: "#e5e5e5",
        },
      },
      x: {
        ticks: {
          padding: 0,
        },
        grid: {
          color: "#e5e5e5",
        },
      },
    },
  });
  const [NetSaleData, setNetSaleData] = useState({
    defaultFontFamily: "Poppins",
    labels: ["0", "01-07", "01-14", "01-21"],
    datasets: [
      {
        label: "My First Dataset",
        data: [0, 2000, 4500, 500],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.4,
      },
    ],
  });
  const [NetSaleOption, setNetSaleOption] = useState({
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 5000,
        ticks: {
          beginAtZero: true,
          padding: 0,
        },
        grid: {
          color: "#e5e5e5",
        },
      },
      x: {
        ticks: {
          padding: 0,
        },
        grid: {
          color: "#e5e5e5",
        },
      },
    },
  });

  const [CancellationData, setCanclelationData] = useState({
    defaultFontFamily: "Poppins",
    labels: ["0", "01-07", "01-14", "01-21"],
    datasets: [
      {
        label: "My First Dataset",
        data: [0, 2000, 4500, 500],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.4,
      },
    ],
  });
  const [CancellationOption, setCancelationOption] = useState({
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 5000,
        ticks: {
          beginAtZero: true,
          padding: 0,
        },
        grid: {
          color: "#e5e5e5",
        },
      },
      x: {
        ticks: {
          padding: 0,
        },
        grid: {
          color: "#e5e5e5",
        },
      },
    },
  });

  const [StandingData, setStandingData] = useState({
    defaultFontFamily: "Poppins",
    labels: ["0", "01-07", "01-14", "01-21"],
    datasets: [
      {
        label: "My First Dataset",
        data: [0, 2000, 4500, 500],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.4,
      },
    ],
  });
  const [StandingOption, setStandingOption] = useState({
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 5000,
        ticks: {
          beginAtZero: true,
          padding: 0,
        },
        grid: {
          color: "#e5e5e5",
        },
      },
      x: {
        ticks: {
          padding: 0,
        },
        grid: {
          color: "#e5e5e5",
        },
      },
    },
  });
  const [NetSaleSubWisData, setNetSaleSubWisData] = useState({
    defaultFontFamily: "Poppins",
    labels: ["0", "01-07", "01-14", "01-21"],
    datasets: [
      {
        label: "My First Dataset",
        data: [0, 2000, 4500, 500],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.4,
      },
    ],
  });
  const [NetSaleSubWisOption, setNetSaleSubWisOption] = useState({
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 5000,
        ticks: {
          beginAtZero: true,
          padding: 0,
        },
        grid: {
          color: "#e5e5e5",
        },
      },
      x: {
        ticks: {
          padding: 0,
        },
        grid: {
          color: "#e5e5e5",
        },
      },
    },
  });

  const [ActiveSubData, setActiveSubData] = useState({
    defaultFontFamily: "Poppins",
    labels: ["0", "01-07", "01-14", "01-21"],
    datasets: [
      {
        label: "My First Dataset",
        data: [0, 2000, 4500, 500],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.4,
      },
    ],
  });
  const [ActiveSubOption, setActiveSubOption] = useState({
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 5000,
        ticks: {
          beginAtZero: true,
          padding: 0,
        },
        grid: {
          color: "#e5e5e5",
        },
      },
      x: {
        ticks: {
          padding: 0,
        },
        grid: {
          color: "#e5e5e5",
        },
      },
    },
  });


  const [Error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    setType(event.target.value);
    if(event.target.value == "New-Home-Traffic-Sales"){
      setgraph1Title("Buyer Traffic");
      setgraph2Title("Net sales");
      setgraph3Title("Cancellation %");
      setgraph4Title("Standing Inventory");
      setgraph5Title("Net sale Per Sub");
      setgraph6Title("Active Subdivision");
    }else if(event.target.value == "New-Home-Prices"){
      setgraph1Title("Median Closing Price");
      setgraph2Title("Median Closing Price SFR");
      setgraph3Title("Median Closng Price Attached");
      setgraph4Title("Median Closing Price By Area");
      setgraph5Title("Average Base Asking Price Overall");
      setgraph6Title("Average Base Asking Price By Area");
    }else if(event.target.value == "New-Home-Closings"){
      setgraph1Title("New Home Closings Overall");
      setgraph2Title("New Home Closings SFR");
      setgraph3Title("New Home Closings Attached");
      setgraph4Title("New Home Closings By Area");
      setgraph5Title("New Home Closings By Builder");
      setgraph6Title("New Home Closings By Master Plan");
    }else if(event.target.value == "New-Home-Permits"){
      setgraph1Title("New Home Permits Overall");
      setgraph2Title("New Home Permits SFR");
      setgraph3Title("New Home Permits Attached");
      setgraph4Title("New Home Permits By Area");
      setgraph5Title("New Home Permits By Builder");
      setgraph6Title("New Home Permits By Master Plan");
    }else if(event.target.value == "Resales"){
      setgraph1Title("New Home Resales OveResales")
      setgraph2Title("New Home Resales SFR");
      setgraph3Title("New Home Resales Attached");
      setgraph4Title("New Home Resales By Area");
      setgraph5Title("New Home Resales By Builder");
      setgraph6Title("New Home Resales By Master Plan");
    }
  };

  const handleDisplay = (e) => {
    setCurrentDisplay(e.target.value);
  };


  const getchartList = async (type,startDate,endDate) => {
    try {
      let responseData = await AdminWeeklyDataService.getstatistics(type,startDate,endDate).json();

      console.log(responseData);

      const filteredBuyerData = Object.entries(
        responseData["buyer_traffic"]
      ).filter(([key, value]) => key !== "status");
      const BuyerDate = filteredBuyerData.map(([key]) => key);
      const buyerValue = filteredBuyerData.map(([, value]) => value);
      const maxBuyerValue = Math.max(...buyerValue);

      console.log(buyerValue);
      setBuyerTrafficdata({
        defaultFontFamily: "Poppins",
        labels: BuyerDate,
        datasets: [
          {
            label: "",
            data: buyerValue,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.4,
          },
        ],
      });

      setBuyerTrafficOption({
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            min: 0,
            max: maxBuyerValue * 2,
            ticks: {
              beginAtZero: true,
              padding: 0,
            },
            grid: {
              color: "#e5e5e5",
            },
          },
          x: {
            ticks: {
              padding: 0,
            },
            grid: {
              color: "#e5e5e5",
            },
          },
        },
      });

      const filteredNetSaleData = Object.entries(
        responseData["net_sales"]
      ).filter(([key, value]) => key !== "status");
      const netSaleWeekDate = filteredNetSaleData.map(([key]) => key);
      const netSaleValue = filteredNetSaleData.map(([, value]) => value);
      const maxNetSaleValue = Math.max(...netSaleValue);

      console.log(netSaleWeekDate);
            console.log(netSaleWeekDate);

      setNetSaleData({
        defaultFontFamily: "Poppins",
        labels: netSaleWeekDate,
        datasets: [
          {
            label: "My First Dataset",
            data: netSaleValue,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.4,
          },
        ],
      });

      setNetSaleOption({
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            min: 0,
            max: maxNetSaleValue * 2,
            ticks: {
              beginAtZero: true,
              padding: 0,
            },
            grid: {
              color: "#e5e5e5",
            },
          },
          x: {
            ticks: {
              padding: 0,
            },
            grid: {
              color: "#e5e5e5",
            },
          },
        },
      });

      // prepare cancelation chart data
      const filteredCancelationData = Object.entries(
        responseData["cancellation"]
      ).filter(([key, value]) => key !== "status");
      const cancelationWeekDate = filteredCancelationData.map(([key]) => key);
      const cancelationValue = filteredCancelationData.map(
        ([, value]) => value
      );

      const cancelationMaxValue = Math.max(...cancelationValue);
      setCanclelationData({
        defaultFontFamily: "Poppins",
        labels: cancelationWeekDate,
        datasets: [
          {
            label: "My First Dataset",
            data: cancelationValue,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.4,
          },
        ],
      });

      setCancelationOption({
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            min: 0,
            max: cancelationMaxValue * 2,
            ticks: {
              beginAtZero: true,
              padding: 0,
            },
            grid: {
              color: "#e5e5e5",
            },
          },
          x: {
            ticks: {
              padding: 0,
            },
            grid: {
              color: "#e5e5e5",
            },
          },
        },
      });

      const filteredStandingData = Object.entries(
        responseData["standing_inventory"]
      ).filter(([key, value]) => key !== "status");
      const StandingWeekDate = filteredStandingData.map(([key]) => key);
      const StandingValue = filteredStandingData.map(([, value]) => value);

      const StandingValueMaxValue = Math.max(...StandingValue);
      setStandingData({
        defaultFontFamily: "Poppins",
        labels: StandingWeekDate,
        datasets: [
          {
            label: "My First Dataset",
            data: StandingValue,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.4,
          },
        ],
      });

      setStandingOption({
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            min: 0,
            max: StandingValueMaxValue * 2,
            ticks: {
              beginAtZero: true,
              padding: 0,
            },
            grid: {
              color: "#e5e5e5",
            },
          },
          x: {
            ticks: {
              padding: 0,
            },
            grid: {
              color: "#e5e5e5",
            },
          },
        },
      });

      // prepare net sale sub division wise chart data
      console.log(responseData["net_sales_per_subdivsion"]);
      const filteredNetSaleSubWiseData = Object.entries(
        responseData["net_sales_per_subdivsion"]
      ).filter(([key, value]) => key !== "status");
      const SubdivisionName = filteredNetSaleSubWiseData.map(([key]) => key);
      const NetSaleValue = filteredNetSaleSubWiseData.map(([, value]) => value);

      const NetSaleSubWiseMaxValue = Math.max(...NetSaleValue);
      setNetSaleSubWisData({
        defaultFontFamily: "Poppins",
        labels: SubdivisionName,
        datasets: [
          {
            label: "My First Dataset",
            data: NetSaleValue,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.4,
          },
        ],
      });

      setNetSaleSubWisOption({
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            min: 0,
            max: NetSaleSubWiseMaxValue * 2,
            ticks: {
              beginAtZero: true,
              padding: 0,
            },
            grid: {
              color: "#e5e5e5",
            },
          },
          x: {
            ticks: {
              padding: 0,
            },
            grid: {
              color: "#e5e5e5",
            },
          },
        },
      });



      // prepare net Active sub division wise chart data
      const filteredActiveSub = Object.entries(
        responseData["active_subdivision"]
      ).filter(([key, value]) => key !== "status");
      const activeSubLevels = filteredActiveSub.map(([key]) => key);
      const ActiveSubValue = filteredActiveSub.map(([, value]) => value);

      const ActiveSubMax = Math.max(...ActiveSubValue);
      setActiveSubData({
        defaultFontFamily: "Poppins",
        labels: activeSubLevels,
        datasets: [
          {
            label: "My First Dataset",
            data: ActiveSubValue,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.4,
          },
        ],
      });

      setActiveSubOption({
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            min: 0,
            max: ActiveSubMax * 2,
            ticks: {
              beginAtZero: true,
              padding: 0,
            },
            grid: {
              color: "#e5e5e5",
            },
          },
          x: {
            ticks: {
              padding: 0,
            },
            grid: {
              color: "#e5e5e5",
            },
          },
        },
      });

    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };
  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      getchartList();
    } else {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      getchartList(type,startDate, endDate); // Call getchartList with startDate and endDate
    } else {
      navigate("/");
    }
  }, [type, startDate, endDate]); 
  return (
    <>
      {/* <PageTitle motherMenu="Charts" activeMenu="ReChartJs" /> */}

      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
    <div className="row mb-3">
    <div className="col-md-3">
    <label className="form-label">Data Type:</label>
    <select className="default-select form-control" onChange={handleChange}>
      <option value="">Select Data Type</option>
      <option value="New-Home-Traffic-Sales">New Home Traffic & Sales</option>
      <option value="New-Home-Prices">New Home Prices</option>
      <option value="New-Home-Closings">New Home Closings</option>
      <option value="New-Home-Permits">New Home Permits</option>
      <option value="Resales">Resales</option>
    </select>
    </div>
    <div className="col-md-3 mt-4">
    <Dropdown>
                        <Dropdown.Toggle
                          variant="success"
                          className="btn-md"
                          id="dropdown-basic"
                        >
                          <i className="fa fa-filter"></i>
                        </Dropdown.Toggle>

                        <Dropdown.Menu style={{width:"200px",overflow:"unset"}}>
                          <label htmlFor="start_date">From:</label>
                          {/* <input
                            type="date"
                            id="start_date"
                            name="start_date"
                            className="form-control"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                          /> */}
                          <DatePicker
                            name="from"
                            className="form-control"
                            selected={ parseDate(startDate)}
                            onChange={handleFilterDateFrom}
                            dateFormat="MM/dd/yyyy"
                            placeholderText="mm/dd/yyyy"
                          />


                          <label htmlFor="end_date">To:</label>
                          {/* <input
                            type="date"
                            id="end_date"
                            name="end_date"
                            className="form-control"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                          /> */}
                            <DatePicker
                              name="to"
                              className="form-control"
                              selected={parseDate(endDate)}
                              onChange={handleFilterDateTo}
                              dateFormat="MM/dd/yyyy"
                              placeholderText="mm/dd/yyyy"
                            />
                   
                        </Dropdown.Menu>
    </Dropdown>
    </div>
    </div>

          </Box>
            <Row>
              <Col xl={4} lg={4}>
                {" "}
                <Card>
                  <Card.Header>
                    <h4 className="card-title">{graph1Title}</h4>
                    <div className="d-flex justify-content-center me-5">
                    </div>
                  </Card.Header>
                  <Card.Body>
                    {/* <LineChart1
                      data={BuyerTrafficData}
                      options={BuyerTrafficOption}
                    /> */}

                    <BarChart1
                      data={BuyerTrafficData}
                      options={BuyerTrafficOption}
                    />
                 </Card.Body>
                </Card>
              </Col>
            {/* </Row> */}
            {/* <Row> */}
              <Col xl={4} lg={4}>
                {" "}
                <Card>
                  <Card.Header>
                    <h4 className="card-title">{graph2Title}</h4>
                  </Card.Header>
                  <Card.Body>
                    <LineChart1 data={NetSaleData} options={NetSaleOption} />
                  </Card.Body>
                </Card>
              </Col>
            {/* </Row> */}
            {/* <Row> */}
              <Col xl={4} lg={4}>
                {" "}
                <Card>
                  <Card.Header>
                    <h4 className="card-title">{graph3Title}</h4>
                  </Card.Header>
                  <Card.Body>
                    {/* <LineChart1
                      data={CancellationData}
                      options={CancellationOption}
                    /> */}

                    <BarChart1
                      data={CancellationData}
                      options={CancellationOption}
                    />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col xl={4} lg={4}>
                {" "}
                <Card>
                  <Card.Header>
                    <h4 className="card-title">{graph4Title}</h4>
                  </Card.Header>
                  <Card.Body>
                    <LineChart1 data={StandingData} options={StandingOption} />
                  </Card.Body>
                </Card>
              </Col>
              <Col xl={4} lg={4}>
                {" "}
                <Card>
                  <Card.Header>
                    <h4 className="card-title">{graph5Title}</h4>
                  </Card.Header>
                  <Card.Body>
                    {/* <LineChart1
                      data={NetSaleSubWisData}
                      options={NetSaleSubWisOption}
                    /> */}

                    <BarChart1
                      data={NetSaleSubWisData}
                      options={NetSaleSubWisOption}
                    />
                  </Card.Body>
                </Card>
              </Col>
            {/* </Row> */}
            {/* <Row> */}
              <Col xl={4} lg={4}>
                {" "}
                <Card>
                  <Card.Header>
                    <h4 className="card-title">{graph6Title}</h4>
                  </Card.Header>
                  <Card.Body>
                    <LineChart1
                      data={ActiveSubData}
                      options={ActiveSubOption}
                    />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
        </TabContext>
      </Box>

      {/* {currentDisplay == 1 ? (
          <Row>
            <Col xl={4} lg={4}>
              {" "}
              <Card>
                <Card.Header>
                  <h4 className="card-title">Buyer Traffic</h4>
                </Card.Header>
                <Card.Body>
                  <LineChart1
                    data={BuyerTrafficData}
                    options={BuyerTrafficOption}
                  />
                </Card.Body>
              </Card>
            </Col>
            <Col xl={4} lg={4}>
              {" "}
              <Card>
                <Card.Header>
                  <h4 className="card-title">Net Sales</h4>
                </Card.Header>
                <Card.Body>
                  <LineChart1 data={NetSaleData} options={NetSaleOption} />
                </Card.Body>
              </Card>
            </Col>
            <Col xl={4} lg={4}>
              {" "}
              <Card>
                <Card.Header>
                  <h4 className="card-title">Cancellation%</h4>
                </Card.Header>
                <Card.Body>
                  <LineChart1
                    data={CancellationData}
                    options={CancellationOption}
                  />
                </Card.Body>
              </Card>
            </Col>
            <Col xl={4} lg={4}>
              {" "}
              <Card>
                <Card.Header>
                  <h4 className="card-title">Standing Inventory</h4>
                </Card.Header>
                <Card.Body>
                  <LineChart1 data={StandingData} options={StandingOption} />
                </Card.Body>
              </Card>
            </Col>
            <Col xl={4} lg={4}>
              {" "}
              <Card>
                <Card.Header>
                  <h4 className="card-title">Net Sales per Sub</h4>
                </Card.Header>
                <Card.Body>
                  <LineChart1
                    data={NetSaleSubWisData}
                    options={NetSaleSubWisOption}
                  />
                </Card.Body>
              </Card>
            </Col>
            <Col xl={4} lg={4}>
              {" "}
              <Card>
                <Card.Header>
                  <h4 className="card-title">Active Subdivisions</h4>
                </Card.Header>
                <Card.Body>
                  <LineChart1
                    data={BuyerTrafficData}
                    options={BuyerTrafficOption}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ) : (
          ""
        )}
        {currentDisplay == 2 ? (
          <Row>
            <Col xl={4} lg={4}>
              {" "}
              <Card>
                <Card.Header>
                  <h4 className="card-title">
                    Data column(s) for axis#0 cannot be of type string
                  </h4>
                </Card.Header>
                <Card.Body></Card.Body>
              </Card>
            </Col>
            <Col xl={4} lg={4}>
              {" "}
              <Card>
                <Card.Header>
                  <h4 className="card-title">
                    Data column(s) for axis#0 cannot be of type string
                  </h4>
                </Card.Header>
                <Card.Body></Card.Body>
              </Card>
            </Col>
            <Col xl={4} lg={4}>
              {" "}
              <Card>
                <Card.Header>
                  <h4 className="card-title">Land Sales Distribution</h4>
                  <select>
                    <option value="1">Janaury</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                </Card.Header>
                <Card.Body></Card.Body>
              </Card>
            </Col>
            <Col xl={4} lg={4}>
              {" "}
              <Card>
                <Card.Header>
                  <h4 className="card-title">Builder Raw Acres Purchaed</h4>
                  <select>
                    <option value="1">Janaury</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                </Card.Header>
                <Card.Body>
                  <BarChart1
                    data={BuilderRawData}
                    options={BuilderRawoptions}
                  />
                </Card.Body>
              </Card>
            </Col>
            <Col xl={4} lg={4}>
              {" "}
              <Card>
                <Card.Header>
                  <h4 className="card-title">Builder Average Price Per Acre</h4>
                  <select>
                    <option value="1">Janaury</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                </Card.Header>
                <Card.Body>
                  <BarChart1
                    data={BuilderRawData}
                    options={BuilderRawoptions}
                  />
                </Card.Body>
              </Card>
            </Col>
            <Col xl={4} lg={4}>
              {" "}
              <Card>
                <Card.Header>
                  <h4 className="card-title"></h4>
                </Card.Header>
                <Card.Body></Card.Body>
              </Card>
            </Col>
          </Row>
        ) : (
          ""
        )}
        {currentDisplay == 3 ? (
          <Row>
            <Col xl={4} lg={4}>
              {" "}
              <Card>
                <Card.Header>
                  <h4 className="card-title">Buyer Traffic</h4>
                </Card.Header>
                <Card.Body></Card.Body>
              </Card>
            </Col>
            <Col xl={4} lg={4}>
              {" "}
              <Card>
                <Card.Header>
                  <h4 className="card-title">Net Sales</h4>
                </Card.Header>
                <Card.Body></Card.Body>
              </Card>
            </Col>
            <Col xl={4} lg={4} className="mt-5">
              <Card>
                <Card.Header>
                  <h4 className="card-title">Cancellation%</h4>
                </Card.Header>
                <Card.Body></Card.Body>
              </Card>
            </Col>
            <Col xl={4} lg={4}>
              {" "}
              <Card>
                <Card.Header>
                  <h4 className="card-title">Standing Inventory</h4>
                </Card.Header>
                <Card.Body></Card.Body>
              </Card>
            </Col>
            <Col xl={4} lg={4}>
              {" "}
              <Card>
                <Card.Header>
                  <h4 className="card-title">
                    Average Base Asking Price - OverAll
                  </h4>
                </Card.Header>
                <Card.Body></Card.Body>
              </Card>
            </Col>
            <Col xl={4} lg={4}>
              {" "}
              <Card>
                <Card.Header>
                  <h4 className="card-title">
                    Average Base Asking Price - By Area
                  </h4>
                  <select>
                    <option value="1">Janaury</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                </Card.Header>
                <Card.Body>
                  <BarChart1 data={AvgRawData} options={AvgRawoptions} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ) : (
          ""
        )} */}
    </>
  );
}

export default RechartJs;
