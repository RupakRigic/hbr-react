import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import AdminBuilderService from "../../../API/Services/AdminService/AdminBuilderService";
import MainPagetitle from "../../layouts/MainPagetitle";
import "./Report.css";
import AdminWeeklyDataService from "../../../API/Services/AdminService/AdminWeeklyDataService";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import AdminReportService from "../../../API/Services/AdminService/AdminReportService";
import moment from "moment";
import axios from "axios";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ClipLoader from "react-spinners/ClipLoader";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';

const BuilderTable = () => {

  const [Error, setError] = useState("");
  var imageUrl = process.env.REACT_APP_Builder_IMAGE_URL;
  const [weekEndDates, setWeekEndDates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [reportList, setReportList] = useState([]);
  const [weekEndingDateList, setWeekEndingDateList] = useState([]);
  const recordsPage = 10;
  const lastIndex = currentPage * recordsPage;
  const firstIndex = lastIndex - recordsPage;
  const records = reportList.slice(firstIndex, lastIndex);
  const npage = Math.ceil(reportList.length / recordsPage);
  const number = [...Array(npage + 1).keys()].slice(1);
  const [isLoading, setIsLoading] = useState(false);
  const [BuilderList, setBuilderList] = useState([]);
  const [SubdivisionList, setSubdivisionList] = useState([]);
  const [BuilderCode, setBuilderCode] = useState('');
  const [SubdivisionCode, setSubdivisionCode] = useState('');
  function prePage() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }
  function changeCPage(id) {
    setCurrentPage(id);
  }
  function nextPage() {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  }
  const [show, setShow] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [weekEndingDate, setWeekEndingDate] = useState("");
  const [reportType, setReportType] = useState("List of Active New Home Builders");

  useEffect(() => {
    const currentDate = new Date(); // Today's date
    const currentYear = currentDate.getFullYear(); // Current year
    const firstDayOfYear = new Date(currentYear, 0, 1); // First day of the current year

    const formatDate = (date) => {
      const padToTwoDigits = (num) => num.toString().padStart(2, '0');
      return `${padToTwoDigits(date.getMonth() + 1)}/${padToTwoDigits(date.getDate())}/${date.getFullYear()}`;
    };

    setStartDate(formatDate(firstDayOfYear));
    setEndDate(formatDate(currentDate)); // Set endDate to current date
  }, [reportType]);

  const handleFilterDateFrom = (date) => {
    if (date) {
      const formattedDate = date.toLocaleDateString('en-US'); // Formats date to "MM/DD/YYYY"

      setStartDate(formattedDate)

    } else {
      setStartDate('')

    }
  };

  const handleFilterDateTo = (date) => {
    if (date) {
      const formattedDate = date.toLocaleDateString('en-US');
      setEndDate(formattedDate)

    } else {

      setEndDate('')
    }
  };

  const parseDate = (dateString) => {
    if (!dateString) return null;

    const [month, day, year] = dateString.split('/');
    const parsedDate = new Date(year, month - 1, day);

    // Check if parsedDate is a valid Date object
    if (isNaN(parsedDate.getTime())) {
      return null; // Return null if parsedDate is invalid
    }

    return parsedDate;
  };

  const [message, setMessage] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alert, setAlert] = useState(false);
  const [selectYear, setSelectYear] = useState("");
  const [selectQuarter, setSelectQuarter] = useState("");
  const [uploadReportType, setUploadReportType] = useState("List of Active New Home Builders");
  const [pdfData, setPdfData] = useState();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [pdfUrl, setPdfUrl] = useState("");
  const [value, setValue] = React.useState("1");
  const navigate = useNavigate();
  const [selectedEndDate, setSelectedEndDate] = useState();
  const [selectedFile, setSelectedFile] = useState('');
  const [selectedFileError, setSelectedFileError] = useState("");
  const [reportOption, setReportOption] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isSavingReport, setIsSavingReport] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      getWeekEndDate();
    } else {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("subscription_data_types") != "undefined") {
      const subscription_data_types = JSON.parse(localStorage.getItem("subscription_data_types"));
      const subscription_plan = JSON.parse(localStorage.getItem("subscription_plan"));
      const reports = subscription_data_types?.reports;
  
      if (Array.isArray(reports)) {
        const formattedReports = reports.reduce((acc, reportObject) => {
          Object.values(reportObject).forEach(report => {
            acc.push({
              value: report.title,
              label: report.title
            });
          });
          return acc;
        }, []);
  
        if (subscription_plan === "Enterprise") {
          formattedReports.push({
            value: "Subdivision Analysis Report",
            label: "Subdivision Analysis Report"
          });
        }
  
        const desiredOrder = [
          'List of Active New Home Builders',
          'Active Adult Activity Report',
          'Annual Report',
          'Area Summaries Report',
          'Closing Report(PDF)',
          'Closing Report(XLS)',
          'LV Quartley Traffic and Sales Summary',
          'Market Share Analysis Report',
          'Permits Rankings Report',
          'Subdivision Analysis Report',
          'The Las vegas land Report',
          'Weekly Traffic and Sales Watch(PDF)',
          'Weekly Traffic and Sales Watch(XLS)'
        ];

        const filteredReports = desiredOrder.map(title => 
          formattedReports.find(report => report.value === title)
        ).filter(report => report !== undefined);

        setReportOption(filteredReports);
      }
    } else {
      const desiredOrder = [
        { value: 'List of Active New Home Builders', label: 'List of Active New Home Builders' },
        { value: 'Active Adult Activity Report', label: 'Active Adult Activity Report' },
        { value: 'Annual Report', label: 'Annual Report' },
        { value: 'Area Summaries Report', label: 'Area Summaries Report' },
        { value: 'Closing Report(PDF)', label: 'Closing Report(PDF)' },
        { value: 'Closing Report(XLS)', label: 'Closing Report(XLS)' },
        { value: 'LV Quartley Traffic and Sales Summary', label: 'LV Quartley Traffic and Sales Summary' },
        { value: 'Market Share Analysis Report', label: 'Market Share Analysis Report' },
        { value: 'Permits Rankings Report', label: 'Permits Rankings Report' },
        { value: 'Subdivision Analysis Report', label: 'Subdivision Analysis Report' },
        { value: 'The Las vegas land Report', label: 'The Las vegas land Report' },
        { value: 'Weekly Traffic and Sales Watch(PDF)', label: 'Weekly Traffic and Sales Watch(PDF)' },
        { value: 'Weekly Traffic and Sales Watch(XLS)', label: 'Weekly Traffic and Sales Watch(XLS)' },
      ];
      setReportOption(desiredOrder);
    }
  }, []);  


  const handleSelectChange = (event) => {
    setSelectedEndDate(event.target.value);
    localStorage.setItem("enddate", event.target.value);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleModalClick = () => {
    navigate("/report-list");
  };
  const getWeekEndDate = async () => {
    try {
      let responseData = await AdminWeeklyDataService.getdate().json();
      setWeekEndDates(responseData.dates);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      } else {
        setError("Something went wrong");
      }
    }
  };

  const getreportlist = async () => {
    try {
      const response = await AdminReportService.reportList();
      const responseData = await response.json();
      setReportList(responseData);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      } else {
        setError("Something went wrong");
      }
    }
  };

  const GetWeekEndingDateList = async () => {
    try {
      const response = await AdminReportService.weekending_date_list();
      const responseData = await response.json();
      setWeekEndingDateList(responseData);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      } else {
        setError("Something went wrong");
      }
    }
  };

  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      getreportlist();
      GetWeekEndingDateList();
    } else {
      navigate("/");
    }
  }, []);

  const handlePreview = async (e) => {
    setIsButtonDisabled(true);
    if (reportType == "Closing Report(PDF)" || reportType == "Market Share Analysis Report") {
      let start_Date = moment(startDate);
      let end_Date = moment(endDate);
      let days = end_Date.diff(start_Date, 'days', true);
      let totaldays = Math.ceil(days) + 1;
      if (totaldays < 367) {
        setAlert(false);
        setIsLoading(true);
        localStorage.setItem("start_date", startDate);
        localStorage.setItem("end_date", endDate);
        localStorage.setItem("report_type", reportType);


        const reportdata = {
          type: reportType,
          start_date: startDate,
          end_date: endDate,
        };
        const bearerToken = JSON.parse(localStorage.getItem("usertoken"));
        try {
          const response = await axios.post(
            // "https://hbrapi.rigicgspl.com/api/admin/report/export-reports",
            `${process.env.REACT_APP_IMAGE_URL}api/admin/report/export-reports`,

            reportdata,
            {
              responseType: "arraybuffer",
              headers: {
                Accept: "application/pdf", // Set Accept header to indicate that we expect a PDF response
                Authorization: `Bearer ${bearerToken}`,
              },
            }
          );
          setIsLoading(false);
          handlePdfResponse(response);
          let responseData = await AdminReportService.pdfSave(reportdata).json();
          if (responseData.status) {
            swal("Report Saved Succesfully").then((willDelete) => {
              if (willDelete) {
                setIsSavingReport(false);
                getreportlist();
                navigate("/report");
              }
            });
          }
        } catch (error) {
          setIsLoading(false);
          if (error.name === "HTTPError") {
            const errorJson = await error.response.json();
            setError(errorJson.message);
          }
          setError("Something went wrong");
          setIsButtonDisabled(false);
          setIsSavingReport(false);
        }
      } else {
        setAlert(true);
        setIsButtonDisabled(false);
        setIsSavingReport(false);
        setAlertMessage("Please select 12 month Period for your report.");
        return;
      }
    } else if (reportType == "Closing Report(XLS)") {
      let start_Date = moment(startDate);
      let end_Date = moment(endDate);
      let days = end_Date.diff(start_Date, 'days', true);
      let totaldays = Math.ceil(days) + 1;

      if (totaldays < 367) {
        setAlert(false);
        setIsLoading(true);
        localStorage.setItem("start_date", startDate);
        localStorage.setItem("end_date", endDate);
        localStorage.setItem("report_type", reportType);

        const reportdata = {
          type: reportType,
          start_date: startDate,
          end_date: endDate,
        };

        const bearerToken = JSON.parse(localStorage.getItem("usertoken"));

        try {
          const response = await axios.post(
            `${process.env.REACT_APP_IMAGE_URL}api/admin/report/export-reports`,
            reportdata,
            {
              responseType: "arraybuffer",
              headers: {
                Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                Authorization: `Bearer ${bearerToken}`,
              },
            }
          );

          setIsLoading(false);
          setIsButtonDisabled(false);
          // Create a new Blob for XLS file
          const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

          // Create a link to download the file
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = `Closing ${startDate} to ${endDate}.xlsx`; // Save the file with .xlsx extension
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (error) {
          setIsLoading(false);
          if (error.name === "HTTPError") {
            const errorJson = await error.response.json();
            setError(errorJson.message);
          }
          setError("Something went wrong");
          setIsButtonDisabled(false);
          setIsSavingReport(false);
        }
      } else {
        setAlert(true);
        setIsButtonDisabled(false);
        setIsSavingReport(false);
        setAlertMessage("Please select 12 month Period for your report.");
        return;
      }
    } else if (reportType == "Weekly Traffic and Sales Watch(PDF)") {
      if (weekEndingDate == "") {
        setAlert(true);
        setIsButtonDisabled(false);
        setIsSavingReport(false);
        setAlertMessage("Please select week ending date");
        return;
      }
      setAlert(false);
      setIsLoading(true);
      localStorage.setItem("start_date", startDate);
      localStorage.setItem("end_date", endDate);
      localStorage.setItem("report_type", reportType);

      const date = new Date(weekEndingDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}${month}${day}`;

      const reportdata = {
        type: reportType,
        end_date: weekEndingDate,
      };
      const bearerToken = JSON.parse(localStorage.getItem("usertoken"));
      try {
        const response = await axios.post(
          // "https://hbrapi.rigicgspl.com/api/admin/report/export-reports",
          `${process.env.REACT_APP_IMAGE_URL}api/admin/report/export-reports`,

          reportdata,
          {
            responseType: "arraybuffer",
            headers: {
              Accept: "application/pdf", // Set Accept header to indicate that we expect a PDF response
              Authorization: `Bearer ${bearerToken}`,
            },
          }
        );
        setIsLoading(false);
        handlePdfResponse(response);
        let responseData = await AdminReportService.pdfSave(reportdata).json();
        if (responseData.status) {
          swal("Report Saved Succesfully").then((willDelete) => {
            if (willDelete) {
              setIsSavingReport(false);
              getreportlist();
              navigate("/report");
            }
          });
        }
      } catch (error) {
        setIsLoading(false);
        if (error.name === "HTTPError") {
          const errorJson = await error.response.json();
          setError(errorJson.message);
        }
        setError("Something went wrong");
        setIsButtonDisabled(false);
        setIsSavingReport(false);
      }
    } else if (reportType == "Weekly Traffic and Sales Watch(XLS)") {
      if (weekEndingDate == "") {
        setAlert(true);
        setIsButtonDisabled(false);
        setIsSavingReport(false);
        setAlertMessage("Please select week ending date");
        return;
      }
      setAlert(false);
      setIsLoading(true);
      localStorage.setItem("start_date", startDate);
      localStorage.setItem("end_date", endDate);
      localStorage.setItem("report_type", reportType);

      const date = new Date(weekEndingDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}${month}${day}`; // Format as YYYYMMDD

      const reportdata = {
        type: reportType,
        end_date: weekEndingDate,
      };
      const bearerToken = JSON.parse(localStorage.getItem("usertoken"));
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_IMAGE_URL}api/admin/report/export-reports`,
          reportdata,
          {
            responseType: "arraybuffer",
            headers: {
              Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              Authorization: `Bearer ${bearerToken}`,
            },
          }
        );

        setIsLoading(false);
        setIsButtonDisabled(false);
        // Create a new Blob for XLS file
        const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

        // Create a link to download the file
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `WTSW ${formattedDate}.xlsx`; // Save the file with .xlsx extension
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        setIsLoading(false);
        if (error.name === "HTTPError") {
          const errorJson = await error.response.json();
          setError(errorJson.message);
        }
        setError("Something went wrong");
        setIsButtonDisabled(false);
        setIsSavingReport(false);
      }
    } else if (reportType == "LV Quartley Traffic and Sales Summary") {
      if (selectYear == "" || selectQuarter == "") {
        setAlert(true);
        setIsButtonDisabled(false);
        setIsSavingReport(false);
        setAlertMessage("Please select year and quarter");
        return;
      }
      setAlert(false);
      setIsLoading(true);
      localStorage.setItem("start_date", startDate);
      localStorage.setItem("end_date", endDate);
      localStorage.setItem("report_type", reportType);

      const reportdata = {
        type: reportType,
        year: selectYear,
        quarter: selectQuarter,
      };
      const bearerToken = JSON.parse(localStorage.getItem("usertoken"));
      try {
        const response = await axios.post(
          // "https://hbrapi.rigicgspl.com/api/admin/report/export-reports",
          `${process.env.REACT_APP_IMAGE_URL}api/admin/report/export-reports`,

          reportdata,
          {
            responseType: "arraybuffer",
            headers: {
              Accept: "application/pdf", // Set Accept header to indicate that we expect a PDF response
              Authorization: `Bearer ${bearerToken}`,
            },
          }
        );
        setIsLoading(false);
        handlePdfResponse(response);
        let responseData = await AdminReportService.pdfSave(reportdata).json();
        if (responseData.status) {
          swal("Report Saved Succesfully").then((willDelete) => {
            if (willDelete) {
              setIsSavingReport(false);
              getreportlist();
              navigate("/report");
            }
          });
        }
      } catch (error) {
        setIsLoading(false);
        if (error.name === "HTTPError") {
          const errorJson = await error.response.json();
          setError(errorJson.message);
        }
        setError("Something went wrong");
        setIsButtonDisabled(false);
        setIsSavingReport(false);
      }
    } else if (reportType == "Subdivision Analysis Report") {
      if (BuilderCode == "" || SubdivisionCode == "") {
        setAlert(true);
        setIsButtonDisabled(false);
        setIsSavingReport(false);
        setAlertMessage("Please select builder and subdivision both.");
        return;
      }
      setIsLoading(true);
      const today = new Date();
      const formattedToday = today.toISOString().split('T')[0];
      localStorage.setItem("start_date", startDate);
      localStorage.setItem("end_date", endDate);
      localStorage.setItem("report_type", reportType);

      const reportdata = {
        type: reportType,
        start_date: formattedToday,
        end_date: formattedToday,
        id: SubdivisionCode
      };

      const bearerToken = JSON.parse(localStorage.getItem("usertoken"));

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_IMAGE_URL}api/admin/report/export-reports`,
          reportdata,
          {
            responseType: "arraybuffer",
            headers: {
              Accept: "application/pdf",
              Authorization: `Bearer ${bearerToken}`,
            },
          }
        );
        setIsLoading(false);
        handlePdfResponse(response);
        let responseData = await AdminReportService.pdfSave(reportdata).json();
        if (responseData.status) {
          swal("Report Saved Succesfully").then((willDelete) => {
            if (willDelete) {
              setIsSavingReport(false);
              getreportlist();
              navigate("/report");
            }
          });
        }
      } catch (error) {
        setIsLoading(false);
        if (error.name === "HTTPError") {
          const errorJson = await error.response.json();
          setError(errorJson.message);
        }
        setError("Something went wrong");
        setIsButtonDisabled(false);
        setIsSavingReport(false);
      }
    } else {
      setIsLoading(true);
      localStorage.setItem("start_date", startDate);
      localStorage.setItem("end_date", endDate);
      localStorage.setItem("report_type", reportType);

      const reportdata = {
        type: reportType,
        start_date: startDate,
        end_date: endDate,
      };

      const bearerToken = JSON.parse(localStorage.getItem("usertoken"));

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_IMAGE_URL}api/admin/report/export-reports`,
          reportdata,
          {
            responseType: "arraybuffer",
            headers: {
              Accept: "application/pdf",
              Authorization: `Bearer ${bearerToken}`,
            },
          }
        );
        setIsLoading(false);
        handlePdfResponse(response);
        let responseData = await AdminReportService.pdfSave(reportdata).json();
        if (responseData.status) {
          swal("Report Saved Succesfully").then((willDelete) => {
            if (willDelete) {
              setIsSavingReport(false);
              getreportlist();
              navigate("/report");
            }
          });
        }
      } catch (error) {
        setIsLoading(false);
        if (error.name === "HTTPError") {
          const errorJson = await error.response.json();
          setError(errorJson.message);
        }
        setError("Something went wrong");
        setIsButtonDisabled(false);
        setIsSavingReport(false);
      }
    }
  };

  const handlePdfResponse = (response) => {
    setIsButtonDisabled(false);
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    //  window.open(url);
    setPdfUrl(url);
    setIsSavingReport(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleString();
    return formattedDate;
  };

  const handleDelete = async (e) => {
    try {
      let responseData = await AdminReportService.destroyReport(e).json();
      if (responseData.status === true) {
        getreportlist();
      }
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      } else {
        setError("Something went wrong");
      }
    }
  };

  const handleReportPreview = (content) => {
    const blob = base64toBlob(content);
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
  };

  const base64toBlob = (base64Data) => {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: "application/pdf" });
    return blob;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file && file.type === "application/pdf") {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)

      fileReader.onload = () => {
        var image = fileReader.result
        setSelectedFile(image);
      }

      setSelectedFileError("");
      setError("");
    } else {
      setSelectedFile('');
      setSelectedFileError("Please select a PDF file.");
    }
  };

  const handleUploadClick = () => {
    document.getElementById("fileInput").click();
  };
  const handleUploadFile = async () => {

    if (!selectedFile) {
      setSelectedFileError('Please select Report file.')

      return false;
    }
    const inputData = {
      pdf_file: selectedFile ? selectedFile.split(',')[1] : "",
      type: uploadReportType
    };
    try {
      let responseData = await AdminReportService.uploadReport(inputData).json();
      swal("Report Saved Succesfully").then((willDelete) => {
        if (willDelete) {
          setIsSavingReport(false);
          navigate("/report");
        }
      });
      getreportlist();
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = error.response.json();
        setError(errorJson.message);
      } else {
        setError("Something went wrong");
      }
    }

  }

  const handleReportType = (e) => {
    setReportType(e.target.value);
    setAlert(false);
    if (e.target.value == "Closing Report(PDF)" || e.target.value == "Closing Report(XLS)" || e.target.value == "Market Share Analysis Report") {
      setMessage("Choose a 12 month Period for your report.");
    }
  }

  const options = weekEndingDateList.map((date) => ({
    label: date,
    value: date
  }));

  const handleWeekEndingDate = (date) => {
    setWeekEndingDate(date.value);
  };

  const GetBuilderlist = async () => {
    setIsLoading(true);
    try {
      const response = await AdminBuilderService.all_builder_list();
      const responseData = await response.json();
      setIsLoading(false);
      setBuilderList(responseData);

    } catch (error) {
      setIsLoading(false);
      if (error.name === 'HTTPError') {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      } else {
        setError("Something went wrong");
      }
    }
    setIsLoading(false);
  };

  const GetSubdivisionList = async (builderId) => {
    try {
      const response = await AdminReportService.Subdivisionbybuilderid(builderId);
      const responseData = await response.json();
      const formattedData = responseData.data
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((subdivision) => ({
          label: subdivision.name,
          value: subdivision.id,
        }));
      setSubdivisionList(formattedData);
      setIsLoading(false);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      } else {
        setError("Something went wrong");
      }
    }
  };

  const BuilderOptions = BuilderList
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(element => ({
      value: element.id,
      label: element.name
    }));

  const handleBuilderCode = (code) => {
    setBuilderCode(code.value);
    GetSubdivisionList(code.value);
  };

  const handleSubdivisionCode = (code) => {
    setSubdivisionCode(code.value);
  };

  useEffect(() => {
    GetBuilderlist();
  }, []);

  return (
    <>
      <MainPagetitle mainTitle="Report" pageTitle="Report" parentTitle="Home" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-6">
            <Box sx={{ width: "100%", typography: "body1" }}>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                  >
                    <Tab label="Report List" value="1" />
                    <Tab label="Add/Generate Report" value="2" />
                  </TabList>
                </Box>
                <TabPanel value="1" className="p-0">
                  <div className="card">
                    <div className="card-body p-0">
                      <div
                        id="employee-tbl_wrapper report-table"
                        className="dataTables_wrapper no-footer table-responsive active-projects style-1 ItemsCheckboxSec shorting"
                      >
                        <table
                          id="empoloyees-tblwrapper"
                          className="table ItemsCheckboxSec dataTable no-footer mb-0 report-table"
                        >
                          <thead>
                            <tr style={{ textAlign: "center" }}>
                              <th>
                                <strong>Name</strong>
                              </th>
                              <th>
                                <strong>Report</strong>
                              </th>
                              <th>
                                <strong>Saved at</strong>
                              </th>

                              <th>Action</th>
                            </tr>
                          </thead>

                          <tbody style={{ textAlign: "center" }}>
                            {records.map((element, index) => {
                              return (
                                <tr style={{ textAlign: "center" }}>
                                  <td>
                                    <a
                                      href="#"
                                      onClick={(e) =>
                                        handleReportPreview(element.content)
                                      }
                                      className="text-decoration-none"
                                    >
                                      {element.name}
                                    </a>
                                  </td>

                                  <td>
                                    <a
                                      href="#"
                                      onClick={(e) =>
                                        handleReportPreview(element.content)
                                      }
                                      className="text-decoration-none"
                                    >
                                      {element.report_type.length > 20
                                        ? element.report_type.substring(0, 20) +
                                        "...   "
                                        : element.report_type}
                                    </a>
                                  </td>
                                  <td>
                                    <a
                                      href="#"
                                      onClick={(e) =>
                                        handleReportPreview(element.content)
                                      }
                                      className="text-decoration-none"
                                    >
                                      {formatDate(element.created_at)}
                                    </a>
                                  </td>
                                  <td>
                                    <div className="d-flex justify-content-center">
                                      <Link
                                        onClick={() =>
                                          swal({
                                            title: "Are you sure?",

                                            icon: "warning",
                                            buttons: true,
                                            dangerMode: true,
                                          }).then((willDelete) => {
                                            if (willDelete) {
                                              handleDelete(element.id);
                                            }
                                          })
                                        }
                                        className="btn btn-danger shadow btn-xs sharp"
                                      >
                                        <i className="fa fa-trash"></i>
                                      </Link>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>

                        </table>
                        <div className="d-sm-flex text-center justify-content-end align-items-center">
                          <div
                            className="dataTables_paginate paging_simple_numbers justify-content-center"
                            id="example2_paginate"
                          >
                            <Link
                              className="paginate_button previous disabled"
                              to="#"
                              onClick={prePage}
                            >
                              <i className="fa-solid fa-angle-left" />
                            </Link>
                            <span>
                              {number.map((n, i) => {
                                if (
                                  n === 1 ||
                                  n === npage ||
                                  n === currentPage ||
                                  n === currentPage - 1 ||
                                  n === currentPage + 1
                                ) {
                                  return (
                                    <Link
                                      className={`paginate_button ${currentPage === n ? "current" : ""
                                        } `}
                                      key={i}
                                      onClick={() => changeCPage(n)}
                                    >
                                      {n}
                                    </Link>
                                  );
                                }

                                if (
                                  (n === currentPage - 2 && currentPage > 4) ||
                                  (n === currentPage + 2 && currentPage < npage - 3)
                                ) {
                                  return (
                                    <span key={i} className="paginate_button disabled">
                                      ...
                                    </span>
                                  );
                                }
                                return null;
                              })}
                            </span>
                            <Link
                              className="paginate_button next"
                              to="#"
                              onClick={nextPage}
                            >
                              <i className="fa-solid fa-angle-right" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel value="2" className="p-0">
                  <div className="card">
                    <div className="card-body p-0">
                      <div className="active-projects style-1 ItemsCheckboxSec shorting border-bottom">
                        <div className="tbl-caption d-flex text-wrap">
                          <h3 className="mb-0">Add Existing Report</h3>
                        </div>
                        <div className="dataTables_wrapper no-footer">
                          <div className="row mb-3">
                            <div className="d-flex align-items-center d-flex  align-items-center flex-column-mobile">
                              <div className="col-md-3">
                                <div className="ms-4">Select Report</div>
                              </div>
                              <div className="col-md-6">
                                <select
                                  onChange={(e) =>
                                    setUploadReportType(e.target.value)
                                  }
                                  value={uploadReportType}
                                  className="form-control-select"
                                >
                                  {reportOption?.map((data) => (
                                    <option>{data.label}</option>
                                  ))}
                                  {/* <option>List of Active New Home Builders</option>
                                  <option>Active Adult Activity Report</option>
                                  <option>Annual Report</option>
                                  <option>Area Summaries Report</option>
                                  <option>Closing Report(PDF)</option>
                                  <option>Closing Report(XLS)</option>
                                  <option>LV Quartley Traffic and Sales Summary</option>
                                  <option>Market Share Analysis Report</option>
                                  <option>Permits Rankings Report</option>
                                  <option>Subdivision Analysis Report</option>
                                  <option>The Las vegas land Report</option>
                                  <option>Weekly Traffic and Sales Watch(PDF)</option>
                                  <option>Weekly Traffic and Sales Watch(XLS)</option> */}
                                </select>
                              </div>
                              <div className="col-md-3 ms-4 sm-m-0">
                                <Button
                                  className="btn-sm"
                                  onClick={handleUploadClick}
                                  variant="primary"
                                >
                                  Select FIle
                                </Button>
                                <input
                                  type="file"
                                  id="fileInput"
                                  style={{ display: "none" }}
                                  onChange={handleFileChange}
                                />
                              </div>
                            </div>
                            {/* <div className="row mb-3 d-flex justify-content-center"> */}
                            <div
                              className="
                                d-flex justify-content-center align-item-center text-danger"
                            >
                              <p>{selectedFileError || Error}</p>
                            </div>
                            <div
                              className="
                                d-flex justify-content-center align-item-center text-success"
                            >
                              <p>{selectedFile != '' ? selectedFile.name : ''}</p>
                            </div>
                            <div
                              className="
                                d-flex justify-content-center align-item-center mt-3"
                            >
                              <div>
                                <Button
                                  className="btn-sm"
                                  variant="primary"
                                  onClick={handleUploadFile}
                                >
                                  Upload File
                                </Button>
                              </div>
                            </div>
                            {/* </div> */}
                          </div>
                        </div>
                      </div>
                      <div className="active-projects style-1 ItemsCheckboxSec shorting">
                        <div className="tbl-caption d-flex text-wrap">
                          <h3 className="mb-0">Generate New Report</h3>
                        </div>
                        <div className="dataTables_wrapper no-footer">
                          <div className="row">
                            <div className="mb-2 col-md-7 d-flex align-items-center flex-column-mobile">
                              <span className="col-md-6">
                                <div className="ms-4">Select Report</div>
                              </span>

                              <select
                                onChange={(e) => handleReportType(e)}
                                value={reportType}
                                className="form-control-select"
                              >
                                {reportOption?.map((data) => (
                                  <option>{data.label}</option>
                                ))}
                                {/* <option>List of Active New Home Builders</option>
                                <option>Annual Report</option>
                                <option>Active Adult Activity Report</option>
                                <option>Area Summaries Report</option>
                                <option>Closing Report(PDF)</option>
                                <option>Closing Report(XLS)</option>
                                <option>LV Quartley Traffic and Sales Summary</option>
                                <option>Market Share Analysis Report</option>
                                <option>Permits Rankings Report</option>
                                <option>Subdivision Analysis Report</option>
                                <option>The Las vegas land Report</option>
                                <option>Weekly Traffic and Sales Watch(PDF)</option>
                                <option>Weekly Traffic and Sales Watch(XLS)</option> */}
                              </select>
                            </div>

                            <div className="col-md-12" style={{ marginTop: "10px" }}>
                              <div className="d-flex">
                                <p className="text-center ms-4">
                                  {(reportType == "Closing Report(PDF)" || reportType == "Closing Report(XLS)" || reportType == "Market Share Analysis Report") ? message : reportType == "LV Quartley Traffic and Sales Summary" ? "Select Year and Quarter" : reportType == "Subdivision Analysis Report" ? "Select builder and subdivision" : reportType == "List of Active New Home Builders" ? "" : "Select week ending date and click save"}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-7 d-flex align-items-center flex-column-mobile">
                              <div className="col-md-5">
                                {reportType == "Subdivision Analysis Report" ?
                                  <div className="ms-4 sm-m-0">Select Builder & Subdivision</div>
                                  :
                                  (reportType == "List of Active New Home Builders" ?
                                    <div className="ms-4 sm-m-0"></div>
                                    :
                                    <div className="ms-4 sm-m-0">Select Period</div>)
                                }
                              </div>
                              {(reportType != "Weekly Traffic and Sales Watch(PDF)" && reportType != "Weekly Traffic and Sales Watch(XLS)" && reportType != "LV Quartley Traffic and Sales Summary" && reportType != "Subdivision Analysis Report" && reportType != "List of Active New Home Builders") && <div className="me-2 mb-2">
                                {/* <input
                                  type="date"
                                  className="form-control"
                                  onChange={(e) => setStartDate(e.target.value)}
                                  value={startDate}
                                /> */}

                                <DatePicker
                                  name="from"
                                  className="form-control"
                                  selected={parseDate(startDate)}
                                  onChange={handleFilterDateFrom}
                                  dateFormat="MM/dd/yyyy"
                                  placeholderText="mm/dd/yyyy"
                                />

                              </div>}

                              {(reportType != "Weekly Traffic and Sales Watch(PDF)" && reportType != "Weekly Traffic and Sales Watch(XLS)" && reportType != "LV Quartley Traffic and Sales Summary" && reportType != "Subdivision Analysis Report" && reportType != "List of Active New Home Builders") && <div className="mb-2">
                                {/* <input
                                  type="date"
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
                              </div>}

                              {(reportType == "Weekly Traffic and Sales Watch(PDF)" || reportType == "Weekly Traffic and Sales Watch(XLS)") && <div className="mb-2 col-md-7 d-flex align-items-center flex-column-mobile">
                                <Select
                                  options={options}
                                  onChange={(selectedOption) => handleWeekEndingDate(selectedOption)}
                                  placeholder="Select Date"
                                  styles={{
                                    container: (provided) => ({
                                      ...provided,
                                      width: '100%',
                                      color: 'black'
                                    }),
                                    menu: (provided) => ({
                                      ...provided,
                                      width: '180px',
                                      color: 'black'
                                    }),
                                  }}
                                />
                              </div>}

                              {reportType === "LV Quartley Traffic and Sales Summary" && (
                                <div className="d-flex align-items-center">
                                  <div className="me-2 mb-2" style={{ width: "100px" }}>
                                    <select id="yearSelect" className="form-select" style={{ backgroundColor: "white", height: "35px", color: "black" }} onChange={(e) => setSelectYear(e.target.value)}>
                                      <option value="">Select Year</option>
                                      {Array.from({ length: 15 }, (_, i) => {
                                        const year = new Date().getFullYear() - i;
                                        return (
                                          <option key={year} value={year} style={{ width: "0px", color: "black" }}>
                                            {year}
                                          </option>
                                        );
                                      })}
                                    </select>
                                  </div>
                                  <div className="mb-2" style={{ width: "150px", marginLeft: "10px" }}>
                                    <select id="quarterSelect" className="form-select" style={{ backgroundColor: "white", height: "35px", color: "black" }} onChange={(e) => setSelectQuarter(e.target.value)}>
                                      <option value="">Select Quarter</option>
                                      <option value="Q1">Q1 - Jan to Mar</option>
                                      <option value="Q2">Q2 - Apr to Jun</option>
                                      <option value="Q3">Q3 - Jul to Sep</option>
                                      <option value="Q4">Q4 - Oct to Dec</option>
                                    </select>
                                  </div>
                                </div>
                              )}

                              {reportType == "Subdivision Analysis Report" && (
                                <div div className="d-flex justify-content-center">
                                  <div style={{ width: "155px", marginLeft: "20px" }}>
                                    <Select
                                      options={BuilderOptions}
                                      onChange={(selectedOption) => handleBuilderCode(selectedOption)}
                                      placeholder="Select Builder"
                                      styles={{
                                        container: (provided) => ({
                                          ...provided,
                                          width: '100%',
                                          color: 'black'
                                        }),
                                        menu: (provided) => ({
                                          ...provided,
                                          width: '100%',
                                          color: 'black'
                                        }),
                                      }}
                                    />
                                  </div>

                                  <div style={{ width: "200px", marginLeft: "10px" }}>
                                    <Select
                                      options={SubdivisionList}
                                      onChange={(selectedOption) => handleSubdivisionCode(selectedOption)}
                                      placeholder="Select Subdivision"
                                      styles={{
                                        container: (provided) => ({
                                          ...provided,
                                          width: '100%',
                                          color: 'black'
                                        }),
                                        menu: (provided) => ({
                                          ...provided,
                                          width: '100%',
                                          color: 'black'
                                        }),
                                      }}
                                    />
                                  </div>
                                </div>
                              )}

                            </div>
                            {alert && (reportType == "Closing Report(PDF)" || reportType == "Closing Report(XLS)" || reportType == "Market Share Analysis Report" || reportType == "LV Quartley Traffic and Sales Summary" || reportType == "Weekly Traffic and Sales Watch(PDF)" || reportType == "Weekly Traffic and Sales Watch(XLS)" || reportType == "Subdivision Analysis Report") && <div className="col-md-12" style={{ marginTop: "10px", color: "red" }}>
                              <div className="d-flex">
                                <p className="text-center ms-4">
                                  {alertMessage}
                                </p>
                              </div>
                            </div>}

                          </div>
                          <div className="col-md-7 d-flex justify-content-center" style={{ marginLeft: isButtonDisabled ? "300px" : isSavingReport ? "310px" : "320px", marginTop: "20px" }}>
                            <div className="ms-4 mb-4">
                              <a
                                onClick={handlePreview}
                                className={`btn btn-primary ${isButtonDisabled || isSavingReport ? "disabled" : ""}`}
                                style={{ pointerEvents: isButtonDisabled || isSavingReport ? "none" : "auto", opacity: isButtonDisabled || isSavingReport ? 0.5 : 1 }}
                              >
                                {isButtonDisabled ? "Processing..." : isSavingReport ? "Saving..." : "Save"}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabPanel>
              </TabContext>
            </Box>
          </div>
          <div className="col-xl-6 mt-5">
            {isLoading ? (
              <div className="d-flex justify-content-center align-items-center mb-5" style={{ marginTop: "35%" }}>
                <ClipLoader color="#4474fc" />
              </div>
            ) : (Error != "" && pdfUrl == "" ? (
              <div style={{ textAlign: "center", marginTop: "30%", fontSize: "60px", color: "black" }}>
                <i className="bi bi-exclamation-octagon" />
              </div>
            ) : (
              <embed
                src={pdfUrl}
                type="application/pdf"
                width="600"
                height="470"
              />
            ))}
          </div>
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>The Report's Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>Please enter the name for this report</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            cancel
          </Button>
          <Button variant="primary" onClick={handleModalClick}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BuilderTable;
