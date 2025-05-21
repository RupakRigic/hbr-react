import React, { useState, useEffect, Fragment } from "react";
import { Row, Col, Card } from "react-bootstrap";
import LineChart1 from "../Chartjs/line1";
import BarChart1 from "../Chartjs/bar1";
import { useNavigate } from "react-router-dom";
import AdminWeeklyDataService from "../../../../API/Services/AdminService/AdminWeeklyDataService";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const RechartJs = () => {
  const [currentDisplay, setCurrentDisplay] = useState(1);
  const [value, setValue] = React.useState("1");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [type, setType] = useState("");
  const [dataTypeOption, setDataTypeOption] = useState([]);

  const [graph1Title, setgraph1Title] = useState("");
  const [graph2Title, setgraph2Title] = useState("");
  const [graph3Title, setgraph3Title] = useState("");
  const [graph4Title, setgraph4Title] = useState("");
  const [graph5Title, setgraph5Title] = useState("");
  const [graph6Title, setgraph6Title] = useState("");

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

  const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date);
  };

  const handleFilterDateFrom = (date) => {
    if (isValidDate(date)) {
      setStartDate(date);
    } else {
      setStartDate(null);
    }
  };

  const handleFilterDateTo = (date) => {
    if (isValidDate(date)) {
      setEndDate(date);
    } else {
      setEndDate(null);
    }
  };

  const parseDate = (date) => {
    return date ? new Date(date) : null;
  };

  const [BuyerTrafficData, setBuyerTrafficdata] = useState({
    defaultFontFamily: "Poppins",
    labels: ["0", "01-07", "01-14", "01-21"],
    datasets: [
      {
        // label: "My First Dataset",
        data: [0, 2000, 4500, 500],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgb(73, 116, 185)",
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
        //  label: "My First Dataset",
        data: [0, 2000, 4500, 500],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgb(73, 116, 185)",
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
        // label: "My First Dataset",
        data: [0, 2000, 4500, 500],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgb(73, 116, 185)",
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
        // label: "My First Dataset",
        data: [0, 2000, 4500, 500],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgb(73, 116, 185)",
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
        // label: "My First Dataset",
        data: [0, 2000, 4500, 500],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgb(73, 116, 185)",
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
        // label: "My First Dataset",
        data: [0, 2000, 4500, 500],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgb(73, 116, 185)",
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
    if (event.target.value == "New-Home-Traffic-Sales") {
      setgraph1Title("Buyer Traffic");
      setgraph2Title("Net sales");
      setgraph3Title("Cancellation %");
      setgraph4Title("Standing Unsold Inventory");
      setgraph5Title("Net Sales Per Subdivision");
      setgraph6Title("Active Subdivisions");
    } else if (event.target.value == "New-Home-Prices") {
      setgraph1Title("Median Closing Price");
      setgraph2Title("Median Closing Price SFR");
      setgraph3Title("Median Closing Price Attached");
      setgraph4Title("Median Closing Price By Area");
      setgraph5Title("Average Base Asking Price Overall");
      setgraph6Title("Average Base Asking Price By Area");
    } else if (event.target.value == "New-Home-Closings") {
      setgraph1Title("New Home Closings Overall");
      setgraph2Title("New Home Closings SFR");
      setgraph3Title("New Home Closings Attached");
      setgraph4Title("New Home Closings By Area");
      setgraph5Title("New Home Closings By Builder");
      setgraph6Title("New Home Closings By Master Plan");
    } else if (event.target.value == "New-Home-Permits") {
      setgraph1Title("New Home Permits Overall");
      setgraph2Title("New Home Permits SFR");
      setgraph3Title("New Home Permits Attached");
      setgraph4Title("New Home Permits By Area");
      setgraph5Title("New Home Permits By Builder");
      setgraph6Title("New Home Permits By Master Plan");
    } else if (event.target.value == "Resales") {
      setgraph1Title("New Home Resales OveResales")
      setgraph2Title("New Home Resales SFR");
      setgraph3Title("New Home Resales Attached");
      setgraph4Title("New Home Resales By Area");
      setgraph5Title("New Home Resales By Builder");
      setgraph6Title("New Home Resales By Master Plan");
    }
    else if (event.target.value == "landsales") {
      setgraph1Title("Builder Land Purchases - Total Acres")
      setgraph2Title("Builder Land Purchases - Total Price");
      setgraph3Title("Builder Land Purchases - Price per Acre");
      setgraph4Title("Price per Acre by Master Plan");
      setgraph5Title("Price per Acre by ZIP Code");
      setgraph6Title("Price per Lot by ZIP Code");
    }
  };

  const handleDisplay = (e) => {
    setCurrentDisplay(e.target.value);
  };

  const formatDate = (date) => {
    const parsedDate = date instanceof Date ? date : new Date(date);
    return !isNaN(parsedDate) ? parsedDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) : null;
  };

  const getchartList = async (type, startDate, endDate) => {
    if (type == "" || startDate == null || endDate == null) {
      return;
    }
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    try {
      let responseData = await AdminWeeklyDataService.getstatistics(type, formattedStartDate, formattedEndDate).json();
      console.log(responseData);
      const filteredBuyerData = Object.entries(
        responseData["buyer_traffic"]
      ).filter(([key, value]) => key !== "status");
      const BuyerDate = filteredBuyerData.map(([key]) => key);
      const buyerValue = filteredBuyerData.map(([, value]) => value);
      const maxBuyerValue = Math.max(...buyerValue);
      const minBuyerValue = Math.min(...buyerValue);
      const suggestedBuyerMax = maxBuyerValue * 1.2;
      const adjustedMinBuyerValue = minBuyerValue === 0 ? Math.min(...buyerValue.filter(value => value > 0)) : minBuyerValue;

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
            backgroundColor: "rgb(73, 116, 185)",
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
            min: minBuyerValue != 0 ? minBuyerValue - (minBuyerValue * 50 / 100) : adjustedMinBuyerValue,
            suggestedMax: suggestedBuyerMax,
            ticks: {
              beginAtZero: true,
              padding: 0,
              autoSkip: false
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
      const suggestedNetSaleMax = maxNetSaleValue * 1.2;
      const minNetSaleValue = Math.min(...netSaleValue);
      const adjustedMinNetSaleValue = minNetSaleValue === 0 ? Math.min(...netSaleValue.filter(value => value > 0)) : minNetSaleValue;
      console.log(netSaleWeekDate);
      console.log(netSaleWeekDate);

      setNetSaleData({
        defaultFontFamily: "Poppins",
        labels: netSaleWeekDate,
        datasets: [
          {
            // label: "My First Dataset",
            data: netSaleValue,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgb(73, 116, 185)",
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
            min: minNetSaleValue != 0 ? minNetSaleValue - (minNetSaleValue * 50 / 100) : adjustedMinNetSaleValue,
            suggestedMax: suggestedNetSaleMax,
            ticks: {
              beginAtZero: true,
              padding: 0,
              autoSkip: false
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
      const suggestedcancelationMax = cancelationMaxValue * 1.2;
      const cancelationMinValue = Math.min(...cancelationValue);
      const adjustedCancelationMinValue = cancelationMinValue === 0 ? Math.min(...cancelationValue.filter(value => value > 0)) : cancelationMinValue;
      setCanclelationData({
        defaultFontFamily: "Poppins",
        labels: cancelationWeekDate,
        datasets: [
          {
            // label: "My First Dataset",
            data: cancelationValue,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgb(73, 116, 185)",
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
            min: cancelationMinValue != 0 ? cancelationMinValue.toFixed(0) - (cancelationMinValue * 50 / 100).toFixed(0) : adjustedCancelationMinValue,
            suggestedMax: suggestedcancelationMax,
            ticks: {
              beginAtZero: true,
              padding: 0,
              autoSkip: false,
              // Format the y-axis labels to append the "%" sign
              callback: function (value) {
                return graph3Title === "Cancellation %" ? value + '%' : value;
              },
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
      const suggestedStandingValueMax = StandingValueMaxValue * 1.2;
      const StandingValueMinValue = Math.min(...StandingValue);
      const adjustedStandingValueMinValue = StandingValueMinValue === 0 ? Math.min(...StandingValue.filter(value => value > 0)) : StandingValueMinValue;
      setStandingData({
        defaultFontFamily: "Poppins",
        labels: StandingWeekDate,
        datasets: [
          {
            //label: "My First Dataset",
            data: StandingValue,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgb(73, 116, 185)",
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
            min: StandingValueMinValue != 0 ? StandingValueMinValue - (StandingValueMinValue * 50 / 100) : adjustedStandingValueMinValue,
            suggestedMax: suggestedStandingValueMax,
            ticks: {
              beginAtZero: true,
              padding: 0,
              autoSkip: false
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
      const suggestedNetSaleSubWiseMax = NetSaleSubWiseMaxValue * 1.2;
      const NetSaleSubWiseMinValue = Math.min(...NetSaleValue);
      const adjustedNetSaleSubWiseMinValue = NetSaleSubWiseMinValue === 0 ? Math.min(...NetSaleValue.filter(value => value > 0)) : NetSaleSubWiseMinValue;
      setNetSaleSubWisData({
        defaultFontFamily: "Poppins",
        labels: SubdivisionName,
        datasets: [
          {
            //  label: "My First Dataset",
            data: NetSaleValue,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgb(73, 116, 185)",
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
            min: NetSaleSubWiseMinValue != 0 ? NetSaleSubWiseMinValue - (NetSaleSubWiseMinValue * 50 / 100) : adjustedNetSaleSubWiseMinValue,
            suggestedMax: suggestedNetSaleSubWiseMax,
            ticks: {
              beginAtZero: true,
              padding: 0,
              autoSkip: false
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
      const suggestedActiveSubMax = ActiveSubMax * 1.2;
      const ActiveSubMin = Math.min(...ActiveSubValue);
      const adjustedActiveSubMin = ActiveSubMin === 0 ? Math.min(...ActiveSubValue.filter(value => value > 0)) : ActiveSubMin;
      setActiveSubData({
        defaultFontFamily: "Poppins",
        labels: activeSubLevels,
        datasets: [
          {
            //  label: "My First Dataset",
            data: ActiveSubValue,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgb(73, 116, 185)",
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
            min: ActiveSubMin != 0 ? ActiveSubMin - (ActiveSubMin * 50 / 100) : adjustedActiveSubMin,
            suggestedMax: suggestedActiveSubMax,
            ticks: {
              beginAtZero: true,
              padding: 0,
              autoSkip: false
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
    if (localStorage.getItem("subscription_data_types") != "undefined") {
      const subscription_data_types = JSON.parse(localStorage.getItem("subscription_data_types"));

      const customMappings = {
        "Weekly Traffic & Sales": "New Home Traffic & Sales",
        "Product Pricing": "New Home Prices"
      };

      const transformedData = subscription_data_types?.data?.flatMap(item => {
        if (item.title === "Weekly Traffic & Sales + Product Pricing") {
          return [
            {
              label: customMappings["Weekly Traffic & Sales"],
              value: customMappings["Weekly Traffic & Sales"]
                .replace(/ /g, "-")
                .replace(/[^a-zA-Z0-9-]/g, "")
                .replace(/-+/g, "-")
                .toLowerCase()
                .replace(/\b\w/g, char => char.toUpperCase())
            },
            {
              label: customMappings["Product Pricing"],
              value: customMappings["Product Pricing"]
                .replace(/ /g, "-")
                .replace(/[^a-zA-Z0-9-]/g, "")
                .replace(/-+/g, "-")
                .toLowerCase()
                .replace(/\b\w/g, char => char.toUpperCase())
            }
          ];
        }

        return {
          label: item.title,
          value: item.title
            .replace(/ /g, "-")
            .replace(/[^a-zA-Z0-9-]/g, "")
            .replace(/-+/g, "-")
            .toLowerCase()
            .replace(/\b\w/g, char => char.toUpperCase())
        };
      });

      setDataTypeOption(transformedData);
    } else {
      const transformedData = [
        { value: 'New-Home-Traffic-Sales', label: 'New Home Traffic & Sales' },
        { value: 'New-Home-Prices', label: 'New Home Prices' },
        { value: 'New-Home-Closings', label: 'New Home Closings' },
        { value: 'New-Home-Permits', label: 'New Home Permits' },
        { value: 'landsales', label: 'Land Sales' }
      ];
      setDataTypeOption(transformedData);
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      getchartList(type, startDate, endDate); // Call getchartList with startDate and endDate
    } else {
      navigate("/");
    }
  }, [type, startDate, endDate]);

  return (
    <Fragment>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <div className="row mb-3">
              <div className="col-md-3">
                <label className="form-label">Data Type:</label>
                <select className="default-select form-control" onChange={handleChange}>
                  <option value="">Select Data Type</option>
                  {dataTypeOption?.map((data) => (
                    <option value={data.value}>{data.label}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label htmlFor="start_date">From:</label>
                <DatePicker
                  name="from"
                  className="form-control"
                  selected={parseDate(startDate)}
                  onChange={handleFilterDateFrom}
                  dateFormat="MM/dd/yyyy"
                  placeholderText="mm/dd/yyyy"
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="end_date">To:</label>
                <DatePicker
                  name="to"
                  className="form-control"
                  selected={parseDate(endDate)}
                  onChange={handleFilterDateTo}
                  dateFormat="MM/dd/yyyy"
                  placeholderText="mm/dd/yyyy"
                />
              </div>
            </div>
          </Box>
          <Row>
            <Col xl={6} lg={6}>
              {" "}
              <Card>
                <Card.Header>
                  <h4 className="card-title">{graph1Title}</h4>
                  <div className="d-flex justify-content-center me-5">
                  </div>
                </Card.Header>
                <Card.Body>
                  <BarChart1
                    data={BuyerTrafficData}
                    options={BuyerTrafficOption}
                  />
                </Card.Body>
              </Card>
            </Col>
            <Col xl={6} lg={6}>
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
          </Row>
          <Row>
            <Col xl={6} lg={6}>
              {" "}
              <Card>
                <Card.Header>
                  <h4 className="card-title">{graph3Title}</h4>
                </Card.Header>
                <Card.Body>
                  <BarChart1
                    data={CancellationData}
                    options={CancellationOption}
                  />
                </Card.Body>
              </Card>
            </Col>
            <Col xl={6} lg={6}>
              {" "}
              <Card>
                <Card.Header>
                  <h4 className="card-title">{graph4Title}</h4>
                </Card.Header>
                <Card.Body>
                  {graph4Title === 'Median Closing Price By Area' || graph4Title === 'New Home Closings By Area' || graph4Title === 'New Home Permits By Area' ? (
                    <BarChart1 data={StandingData} options={StandingOption} />
                  ) : (
                    <LineChart1 data={StandingData} options={StandingOption} />
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl={6} lg={6}>
              {" "}
              <Card>
                <Card.Header>
                  <h4 className="card-title">{graph5Title}</h4>
                </Card.Header>
                <Card.Body>
                  <BarChart1
                    data={NetSaleSubWisData}
                    options={NetSaleSubWisOption}
                  />
                </Card.Body>
              </Card>
            </Col>
            <Col xl={6} lg={6}>
              {" "}
              <Card>
                <Card.Header>
                  <h4 className="card-title">{graph6Title}</h4>
                </Card.Header>
                <Card.Body>
                  {graph6Title === 'Average Base Asking Price By Area' ? (
                    <BarChart1 data={ActiveSubData} options={ActiveSubOption} />
                  ) : (
                    <LineChart1
                      data={ActiveSubData}
                      options={ActiveSubOption}
                    />
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </TabContext>
      </Box>
    </Fragment>
  );
}

export default RechartJs;
