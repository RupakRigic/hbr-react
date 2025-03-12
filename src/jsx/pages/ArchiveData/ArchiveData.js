import React, { Fragment, useEffect, useState } from 'react';
import MainPagetitle from '../../layouts/MainPagetitle';
import { Link } from "react-router-dom";
import ClipLoader from 'react-spinners/ClipLoader';
import { Button } from 'react-bootstrap';
import Modal from "react-bootstrap/Modal";
import Select from 'react-select';
import DatePicker from "react-datepicker";
import AdminBuilderService from '../../../API/Services/AdminService/AdminBuilderService';
import { MultiSelect } from 'react-multi-select-component';
import { Form } from "react-bootstrap";
import swal from "sweetalert";

const ArchiveData = () => {
    const SyestemUserRole = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).role : "";
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPage = 100;
    const lastIndex = currentPage * recordsPage;
    const [npage, setNpage] = useState(0);
    const number = [...Array(npage + 1).keys()].slice(1);
    const [showPopup, setShowPopup] = useState(false);
    const [fieldList, setFieldList] = useState([]);
    const [selectedFields, setSelectedFields] = useState([]);
    const [archiveList, setArchiveList] = useState([]);
    const [archiveListCount, setArchiveListCount] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [selectFromDate, setSelectFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [selectToDate, setSelectToDate] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [message, setMessage] = useState("");

    const prePage = () => {
        if (currentPage !== 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const changeCPage = (id) => {
        setCurrentPage(id);
    };

    const nextPage = () => {
        if (currentPage !== npage) {
            setCurrentPage(currentPage + 1);
        }
    };

    const HandlePopupDetailClick = (e) => {
        setShowPopup(true);
    };

    const HandlePopupClose = () =>{
        setShowPopup(false)
        setFromDate("");
        setToDate("");
        setSelectedFields([]);
    } ;

    useEffect(() => {
        GetArchieveList();
    }, []);

    const GetArchieveList = async () => {
        setIsLoading(true);
        try {
            const response = await AdminBuilderService.getArchiveList();
            const responseData = await response.json();
            setArchiveList(responseData);
            setNpage(Math.ceil(responseData.length / recordsPage));
            setArchiveListCount(responseData.length);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            if (error.name === "HTTPError") {
                console.log(error.name);
            }
        }
    };

    const HandlePopupSave = async () => {
        if(selectedType == "" || selectFromDate == "" || selectToDate == "" || selectedFields.length == 0) {
            setMessage("Please selecet required fields.");
            return;
        }
        setShowPopup(false);
        setIsLoading(true);
        try {
            let selectedValues = selectedFields.map(item => item.value);
            let selectedValueString = selectedValues.join(', ');
            let selectedValuesArray = selectedValueString.split(', ').map(item => item.trim());
            var userData = {
                "type": selectedType,
                "start_date": selectFromDate,
                "end_date": selectToDate,
                "fields": selectedValuesArray
            }
            const response = await AdminBuilderService.archiveDownloadData(userData);
            const responseData = await response.json();
            if (responseData.status == true) {
                swal(responseData.message).then((willDelete) => {
                    if (willDelete) {
                        GetArchieveList();
                    }
                });
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            if (error.name === "HTTPError") {
                console.log(error.name);
            }
        }
    };

    const handleDownload = async (e, filepath) => {
        e.preventDefault();
        try {
            const fileUrl = `${process.env.REACT_APP_IMAGE_URL}/${filepath}`;
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = filepath;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    const handleDelete = async (e) => {
        console.log(e);
        try {
            let responseData = await AdminBuilderService.destroyArchive(e).json();
            if (responseData.status === true) {
                swal(responseData.message).then((willDelete) => {
                    if (willDelete) {
                        GetArchieveList();
                    }
                });
            }
        } catch (error) {
            if (error.name === "HTTPError") {
                const errorJson = await error.response.json();
                console.log(errorJson);
            }
        }
    };

    const HandleTable = async (tableName) => {
        setMessage("");
        setSelectedType(tableName.value);
        try {
            const response = await AdminBuilderService.getArchiveFieldList(tableName.value);
            const responseData = await response.json();
            setFieldList(responseData);
        } catch (error) {
            console.log(error);
            if (error.name === "HTTPError") {
                console.log(error.name);
            }
        }
    };

    const handleFilterDateFrom = (date) => {
        setMessage("");
        if (date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            setSelectFromDate(formattedDate);
            const formattedDateShow = date.toLocaleDateString('en-US');
            setFromDate(formattedDateShow);
        }
    };

    const handleFilterDateTo = (date) => {
        setMessage("");
        if (date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            setSelectToDate(formattedDate);
            const formattedDateShow = date.toLocaleDateString('en-US');
            setToDate(formattedDateShow);
        }
    };

    const parseDate = (dateString) => {
        const [month, day, year] = dateString.split('/');
        return new Date(year, month - 1, day);
    };

    const HandleFiels = (selectedItems) => {
        setMessage("");
        const selectedValue = selectedItems.map(item => item.value);
        setSelectedFields(selectedItems);
    };

    const typeOptions = [
        { value: 'permits', label: 'Permits' },
        { value: 'traffic_sales', label: 'Weekly Traffic & Sales' },
        { value: 'product_prices', label: 'Base Prices' },
        { value: 'closings', label: 'Closings' },
        { value: 'landsales', label: 'Land Sales' }
    ];

    const fieldsOptions = fieldList.map(element => ({
        value: element,
        label: element
    }));
    function snakeToFirstUpperCase(str) {
        return str
          .split('_') // Split the string by underscores
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word
          .join(' '); // Join the words with spaces
      }

    return (
        <Fragment>
            <MainPagetitle mainTitle="Archive Data" pageTitle="Archive Data" parentTitle="Home" />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xl-12">
                        <div className="card">
                            <div className="card-body p-0">
                                <div className="table-responsive active-projects style-1 ItemsCheckboxSec shorting">
                                    <div className="tbl-caption d-flex justify-content-between text-wrap align-items-center pb-0">
                                        <div className="d-flex text-nowrap justify-content-between align-items-center">
                                            <h4 className="heading mb-0">Archive Data List</h4>
                                        </div>
                                        {SyestemUserRole == "Data Uploader" || SyestemUserRole == "User" || SyestemUserRole == "Standard User" ? ("") : (
                                            <div className="d-flex justify-content-between">
                                                <div>
                                                    <Button
                                                        className="btn-sm me-2"
                                                        variant="primary"
                                                        onClick={() => setShowPopup(true)}
                                                    >
                                                        <i class="bi bi-plus"></i> Add Download Request
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="d-sm-flex text-center justify-content-between align-items-center dataTables_wrapper no-footer">
                                        <div className="dataTables_info">
                                            Showing {lastIndex - recordsPage + 1} to {lastIndex} of{" "}
                                            {archiveListCount} entries
                                        </div>
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
                                                    if (number.length > 4) {
                                                        if (
                                                            i === 0 ||
                                                            i === number.length - 1 ||
                                                            Math.abs(currentPage - n) <= 1 ||
                                                            (i === 1 && n === 2) ||
                                                            (i === number.length - 2 &&
                                                                n === number.length - 1)
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
                                                        } else if (i === 1 || i === number.length - 2) {
                                                            return <span key={i}>...</span>;
                                                        } else {
                                                            return null;
                                                        }
                                                    } else {
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
                                    <div
                                        id="employee-tbl_wrapper"
                                        className="dataTables_wrapper no-footer"
                                    >
                                        {isLoading ? (
                                            <div className="d-flex justify-content-center align-items-center mb-5">
                                                <ClipLoader color="#4474fc" />
                                            </div>
                                        ) : (
                                            <table
                                                id="empoloyees-tblwrapper"
                                                className="table ItemsCheckboxSec dataTable no-footer mb-0"
                                            >
                                                <thead>
                                                    <tr style={{ textAlign: "center" }}>
                                                        <th>No.</th>
                                                        <th>Type</th>
                                                        <th>Start Date</th>
                                                        <th>End Date</th>
                                                        <th>File Name</th>
                                                        <th>Download</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {archiveList !== null && archiveList.length > 0 ? (
                                                        archiveList.map((element, index) => (
                                                            <tr style={{ textAlign: "center" }}>
                                                                <td>{index + 1}</td>
                                                                <td>{snakeToFirstUpperCase(element.type)}</td>
                                                                <td>{element.start_date}</td>
                                                                <td>{element.end_date}</td>
                                                                <td style={{ textAlign: "center" }}>{element.filename}</td>
                                                                <td key={element.id} style={{ textAlign: "center" }}>
                                                                    <div className="d-flex justify-content-center">
                                                                        <Link
                                                                            onClick={(e) => {
                                                                                if(element.download_status == 1) {
                                                                                    swal({
                                                                                        title: "Are you sure to download?",
                                                                                        buttons: true,
                                                                                        dangerMode: false,
                                                                                    }).then((willDelete) => {
                                                                                        if (willDelete) {
                                                                                            handleDownload(e, element.filepath);
                                                                                        }
                                                                                    })
                                                                                } else {
                                                                                    return;
                                                                                }}
                                                                            }
                                                                            className={"btn btn-primary shadow btn-xs sharp"}
                                                                            style={element.download_status == 1 ? {cursor: "Pointer"} : {cursor: "not-allowed"}}
                                                                        >
                                                                            {element.download_status == 1 ? <i className="fa fa-download"></i>
                                                                             :
                                                                             <i className="fa fa-download" style={{cursor: "not-allowed"}}></i>
                                                                            }
                                                                        </Link>
                                                                    </div>
                                                                </td>
                                                                <td key={element.id} style={{ textAlign: "center" }}>
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
                                                        ))) : (
                                                        <tr>
                                                            <td colSpan="7" style={{ textAlign: "center" }}>
                                                                No data found
                                                            </td>
                                                        </tr>)}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                    <div className="d-sm-flex text-center justify-content-between align-items-center dataTables_wrapper no-footer">
                                            <div className="dataTables_info">
                                                Showing {lastIndex - recordsPage + 1} to {lastIndex} of{" "}
                                                {archiveListCount} entries
                                            </div>
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
                                                        if (number.length > 4) {
                                                            if (
                                                                i === 0 ||
                                                                i === number.length - 1 ||
                                                                Math.abs(currentPage - n) <= 1 ||
                                                                (i === 1 && n === 2) ||
                                                                (i === number.length - 2 &&
                                                                    n === number.length - 1)
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
                                                            } else if (i === 1 || i === number.length - 2) {
                                                                return <span key={i}>...</span>;
                                                            } else {
                                                                return null;
                                                            }
                                                        } else {
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
                    </div>
                </div>
            </div>

            {/* Popup */}
            <Modal show={showPopup} onHide={HandlePopupDetailClick}>
                <Modal.Header HandlePopupClose>
                    <Modal.Title>Download Request</Modal.Title>
                    <button
                        className="btn-close"
                        aria-label="Close"
                        onClick={() => HandlePopupClose()}
                    ></button>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-3 mt-3" style={{ width: "200px" }}>
                            <label className="form-label">Data Type:{" "}<span className="text-danger">*</span></label>
                            <Select
                                options={typeOptions}
                                onChange={(selectedOption) => HandleTable(selectedOption)}
                                placeholder="Select a Data Type..."
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

                        <div className="col-md-3 mt-3">
                            <label className="form-label">From:{" "}<span className="text-danger">*</span></label>
                            <DatePicker
                                name="from"
                                className="form-control"
                                selected={fromDate ? parseDate(fromDate) : null}
                                onChange={handleFilterDateFrom}
                                dateFormat="MM/dd/yyyy"
                                placeholderText="mm/dd/yyyy"
                            />
                        </div>

                        <div className="col-md-3 mt-3">
                            <label className="form-label">To:{" "}<span className="text-danger">*</span></label>
                            <DatePicker
                                name="to"
                                className="form-control"
                                selected={toDate ? parseDate(toDate) : null}
                                onChange={handleFilterDateTo}
                                dateFormat="MM/dd/yyyy"
                                placeholderText="mm/dd/yyyy"
                            />
                        </div>

                        <div className="col-md-3 mt-3">
                            <div style={{ width: "180px" }}>
                                <label className="form-label">Fields:{" "}<span className="text-danger">*</span></label>
                                <Form.Group controlId="tournamentList">
                                    <MultiSelect
                                        options={fieldsOptions}
                                        value={selectedFields}
                                        onChange={(selectedOption) => HandleFiels(selectedOption)}
                                        placeholder="Search and select a fields..."
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
                                </Form.Group>
                            </div>
                        </div>
                        <div className="text-danger" style={{marginTop: "10px", fontSize: "13px"}}>
                            {message}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => HandlePopupSave()}>
                        Apply
                    </Button>
                    <Button variant="primary" onClick={HandlePopupClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    )
}

export default ArchiveData;
