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

function RechartJs() {
  const [currentDisplay, setCurrentDisplay] = useState(1);
  const [value, setValue] = React.useState("1");

  const [filterQuery, setFilterQuery] = useState({
    is_active: "",
    company_type: "",
  });

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  useEffect(() => {
    const currentDate = new Date(); // Today's date
    const currentYear = currentDate.getFullYear(); // Current year
    const firstDayOfYear = new Date(currentYear, 0, 1); // First day of the current year
    setStartDate(firstDayOfYear.toISOString().split('T')[0]); // Format as yyyy-mm-dd
    setEndDate(currentDate.toISOString().split('T')[0]); // Format as yyyy-mm-dd
  }, []);

  const HandleFilter = (e) => {
    const { name, value } = e.target;
    setFilterQuery((prevFilterQuery) => ({
      ...prevFilterQuery,
      [name]: value,
    }));
  };
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

  const [Error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleDisplay = (e) => {
    setCurrentDisplay(e.target.value);
  };
  const BuyerTrafficData = {
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
  };

  const getchartList = async (startDate,endDate) => {
    try {
      let responseData = await AdminWeeklyDataService.getstatistics(startDate,endDate).json();
      const filteredNetSaleData = Object.entries(
        responseData["net_sale"]
      ).filter(([key, value]) => key !== "status");
      const netSaleWeekDate = filteredNetSaleData.map(([key]) => key);
      const netSaleValue = filteredNetSaleData.map(([, value]) => value);
      const maxNetSaleValue = Math.max(...netSaleValue);
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
        responseData["cancelation"]
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

      // prepare Standing chart data
      const filteredStandingData = Object.entries(
        responseData["standing"]
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
      const filteredNetSaleSubWiseData = Object.entries(
        responseData["sub_wise"]
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
  const BuyerTrafficOption = {
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
  };
  const BuilderRawData = {
    defaultFontFamily: "Poppins",
    labels: ["-1", "-0.5", "0", "0.5", "1"],
    datasets: [
      {
        label: "Builder Raw Acres Purchaed",
        data: [5, 2, 3, 6, 1],
        borderColor: "rgba(44, 44, 44, 1)",
        borderWidth: "0",
        backgroundColor: "rgba(44, 44, 44, 1)",
        barThickness: 5,
        fill: {
          target: "origin", // 3. Set the fill options
          above: "rgba(255, 0, 0, 0.3)",
        },
      },
    ],
  };
  const BuilderRawoptions = {
    plugins: {
      legend: false,
    },
    scales: {
      y: {
        min: 0,
        max: 10,
        ticks: {
          beginAtZero: true,
          padding: 0,
        },
        grid: {
          color: "#e5e5e5",
        },
      },
      x: {
        // Change here
        barPercentage: 0.5,
        grid: {
          color: "#e5e5e5",
        },
      },
    },
  };
  const formattedData = ["01:00", "00:30", "01:11"];
  const AvgRawData = {
    labels: ["BC", "E", "H", "IS", "L", "M", "MV", "NLV", "NW", "p", "S", "SW"],
    datasets: [
      {
        data: [60, 30, 73],
        datalabels: {
          formatter: function (value, context) {
            return formattedData[context.dataIndex];
          },
        },
        barThickness: 10,
      },
    ],
  };
  const AvgRawoptions = {
    indexAxis: "y",
    elements: {
      bar: {
        borderWidth: 1,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: "General SMS - 150",
      },
      layout: {
        padding: 50,
      },
      datalabels: {
        font: {
          weight: "bold",
        },
        align: "end",
        anchor: "end",
        formatter: function (value, context) {
          return context.chart.formattedData[context.dataIndex];
        },
      },
    },
  };

  const HandleDateRange = () =>{
    getchartList(startDate,endDate);

  }

  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      getchartList(startDate, endDate); // Call getchartList with startDate and endDate
    } else {
      navigate("/");
    }
  }, [startDate, endDate]); 
  return (
    <>
      {/* <PageTitle motherMenu="Charts" activeMenu="ReChartJs" /> */}

      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Buyer Traffic" value="1" />
              <Tab label="Net Sales" value="2" />

              <Tab label="Cancellation%" value="3" />
              <Tab label="Standing Inventory" value="4" />

              <Tab label="Net Sales Per Sub" value="5" />
              <Tab label="Active Subdivisions" value="6" />
            </TabList>
          </Box>

          <TabPanel value="1" className="p-0">
            <Row>
              <Col xl={12} lg={12}>
                {" "}
                <Card>
                  <Card.Header>
                    <h4 className="card-title">Buyer Traffic</h4>
                    <div className="d-flex justify-content-center me-5">
                      <Dropdown>
                        <Dropdown.Toggle
                          variant="success"
                          className="btn-sm"
                          id="dropdown-basic"
                        >
                          <i className="fa fa-filter"></i>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <label htmlFor="start_date">From:</label>
                          <input
                            type="date"
                            id="start_date"
                            name="start_date"
                            className="form-control"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                          />

                          <label htmlFor="end_date">To:</label>
                          <input
                            type="date"
                            id="end_date"
                            name="end_date"
                            className="form-control"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                          />
                   
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
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
          </TabPanel>

          <TabPanel value="2" className="p-0">
            <Row>
              <Col xl={12} lg={12}>
                {" "}
                <Card>
                  <Card.Header>
                    <h4 className="card-title">Net Sales</h4>
                    <div className="d-flex justify-content-center me-5">
                      <Dropdown>
                        <Dropdown.Toggle
                          variant="success"
                          className="btn-sm"
                          id="dropdown-basic"
                        >
                          <i className="fa fa-filter"></i>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <label htmlFor="start_date">From:</label>
                          <input
                            type="date"
                            id="start_date"
                            name="start_date"
                            className="form-control"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                          />

                          <label htmlFor="end_date">To:</label>
                          <input
                            type="date"
                            id="end_date"
                            name="end_date"
                            className="form-control"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                          />
                       
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <LineChart1 data={NetSaleData} options={NetSaleOption} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </TabPanel>

          <TabPanel value="3" className="p-0">
            <Row>
              <Col xl={12} lg={12}>
                {" "}
                <Card>
                  <Card.Header>
                    <h4 className="card-title">Cancellation%</h4>
                    <div className="d-flex justify-content-center me-5">
                      <Dropdown>
                        <Dropdown.Toggle
                          variant="success"
                          className="btn-sm"
                          id="dropdown-basic"
                        >
                          <i className="fa fa-filter"></i>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <label htmlFor="start_date">From:</label>
                          <input
                            type="date"
                            id="start_date"
                            name="start_date"
                            className="form-control"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                          />

                          <label htmlFor="end_date">To:</label>
                          <input
                            type="date"
                            id="end_date"
                            name="end_date"
                            className="form-control"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                          />
                        
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <LineChart1
                      data={CancellationData}
                      options={CancellationOption}
                    />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </TabPanel>

          <TabPanel value="4" className="p-0">
            <Row>
              <Col xl={12} lg={12}>
                {" "}
                <Card>
                  <Card.Header>
                    <h4 className="card-title">Standing Inventory</h4>
                    <div className="d-flex justify-content-center me-5">
                      <Dropdown>
                        <Dropdown.Toggle
                          variant="success"
                          className="btn-sm"
                          id="dropdown-basic"
                        >
                          <i className="fa fa-filter"></i>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <label htmlFor="start_date">From:</label>
                          <input
                            type="date"
                            id="start_date"
                            name="start_date"
                            className="form-control"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                          />

                          <label htmlFor="end_date">To:</label>
                          <input
                            type="date"
                            id="end_date"
                            name="end_date"
                            className="form-control"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                          />
                       
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <LineChart1 data={StandingData} options={StandingOption} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </TabPanel>

          <TabPanel value="5" className="p-0">
            <Row>
              <Col xl={12} lg={12}>
                {" "}
                <Card>
                  <Card.Header>
                    <h4 className="card-title">Net Sales per Sub</h4>
                    <div className="d-flex justify-content-center me-5">
                      <Dropdown>
                        <Dropdown.Toggle
                          variant="success"
                          className="btn-sm"
                          id="dropdown-basic"
                        >
                          <i className="fa fa-filter"></i>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <label htmlFor="start_date">From:</label>
                          <input
                            type="date"
                            id="start_date"
                            name="start_date"
                            className="form-control"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                          />

                          <label htmlFor="end_date">To:</label>
                          <input
                            type="date"
                            id="end_date"
                            name="end_date"
                            className="form-control"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                          />
                         
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <LineChart1
                      data={NetSaleSubWisData}
                      options={NetSaleSubWisOption}
                    />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </TabPanel>

          <TabPanel value="6" className="p-0">
            <Row>
              <Col xl={12} lg={12}>
                {" "}
                <Card>
                  <Card.Header>
                    <h4 className="card-title">Active Subdivisions</h4>
                    <div className="d-flex justify-content-center me-5">
                      <Dropdown>
                        <Dropdown.Toggle
                          variant="success"
                          className="btn-sm"
                          id="dropdown-basic"
                        >
                          <i className="fa fa-filter"></i>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <label htmlFor="start_date">From:</label>
                          <input
                            type="date"
                            id="start_date"
                            name="start_date"
                            className="form-control"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                          />

                          <label htmlFor="end_date">To:</label>
                          <input
                            type="date"
                            id="end_date"
                            name="end_date"
                            className="form-control"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                          />
                 
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
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
          </TabPanel>
        </TabContext>
      </Box>

      {/* {currentDisplay == 1 ? (
          <Row>
            <Col xl={12} lg={12}>
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
            <Col xl={12} lg={12}>
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
            <Col xl={12} lg={12}>
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
            <Col xl={12} lg={12}>
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
            <Col xl={12} lg={12}>
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
            <Col xl={12} lg={12}>
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
            <Col xl={12} lg={12}>
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
            <Col xl={12} lg={12}>
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
            <Col xl={12} lg={12}>
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
            <Col xl={12} lg={12}>
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
            <Col xl={12} lg={12}>
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
            <Col xl={12} lg={12}>
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
            <Col xl={12} lg={12}>
              {" "}
              <Card>
                <Card.Header>
                  <h4 className="card-title">Buyer Traffic</h4>
                </Card.Header>
                <Card.Body></Card.Body>
              </Card>
            </Col>
            <Col xl={12} lg={12}>
              {" "}
              <Card>
                <Card.Header>
                  <h4 className="card-title">Net Sales</h4>
                </Card.Header>
                <Card.Body></Card.Body>
              </Card>
            </Col>
            <Col xl={12} lg={12} className="mt-5">
              <Card>
                <Card.Header>
                  <h4 className="card-title">Cancellation%</h4>
                </Card.Header>
                <Card.Body></Card.Body>
              </Card>
            </Col>
            <Col xl={12} lg={12}>
              {" "}
              <Card>
                <Card.Header>
                  <h4 className="card-title">Standing Inventory</h4>
                </Card.Header>
                <Card.Body></Card.Body>
              </Card>
            </Col>
            <Col xl={12} lg={12}>
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
            <Col xl={12} lg={12}>
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
