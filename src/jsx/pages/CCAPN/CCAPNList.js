import React, { useEffect, useState } from 'react';
import MainPagetitle from '../../layouts/MainPagetitle';
import { Link, useNavigate } from 'react-router-dom';
import Button from "react-bootstrap/Button";
import ClipLoader from 'react-spinners/ClipLoader';
import swal from "sweetalert";
import AdminCCAPNService from '../../../API/Services/AdminService/AdminCCAPNService';
import AccessField from '../../components/AccssFieldComponent/AccessFiled';
import Modal from "react-bootstrap/Modal";
import axios from "axios";


const CCAPNList = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [Error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [fileListCount, setFileListCount] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPage = 100;
    const lastIndex = currentPage * recordsPage;
    const [npage, setNpage] = useState(0);
    const number = [...Array(npage + 1).keys()].slice(1);
    const navigate = useNavigate();
    const [ccapnList, setCCAPNList] = useState([]);
    const [AllBuilderListExport, setAllBuilderExport] = useState([]);
    const [excelLoading, setExcelLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState([]);
    const [show, setShow] = useState(false);
    const [selectedFile, setSelectedFile] = useState("");
    const [selectedFileError, setSelectedFileError] = useState("");

    const handleClose = () => {
        setShow(false);
        // GetCCAPNList();
    }
    const SyestemUserRole = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).role
    : "";

    const stringifySortConfig = (sortConfig) => {
        return sortConfig.map((sort) => `${sort.key}:${sort.direction}`).join(",");
    };

    const GetCCAPNList = async (pageNumber) => {
        setIsLoading(true);
        try {

            let sortConfigString = "";
            if (sortConfig !== null) {
                sortConfigString = "&sortConfig=" + stringifySortConfig(sortConfig);
            }

            const response = await AdminCCAPNService.index(
                pageNumber,
                searchQuery,
                sortConfigString
            );
            const responseData = await response.json();

            setIsLoading(false);
            setCCAPNList(responseData.data);
            setNpage(Math.ceil(responseData.total / recordsPage));
            setFileListCount(responseData.total);

        } catch (error) {
            console.log(error);
            setIsLoading(false);
            if (error.name === "HTTPError") {
                const errorJson = await error.response.json();

                setError(errorJson.message);
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (localStorage.getItem("usertoken")) {
            GetCCAPNList(currentPage, searchQuery);
            fetchAllPages(searchQuery, sortConfig)
        } else {
            navigate("/");
        }
    }, [currentPage]);

    const fetchAllPages = async (searchQuery, sortConfig) => {
        const response = await AdminCCAPNService.index(1, searchQuery, sortConfig ? `&sortConfig=${stringifySortConfig(sortConfig)}` : "");
        const responseData = await response.json();
        const totalPages = Math.ceil(responseData.total / recordsPage);
        let allData = responseData.data;

        for (let page = 2; page <= totalPages; page++) {
            const pageResponse = await AdminCCAPNService.index(page, searchQuery, sortConfig ? `&sortConfig=${stringifySortConfig(sortConfig)}` : "");
            const pageData = await pageResponse.json();
            allData = allData.concat(pageData.data);
        }
        setAllBuilderExport(allData);
        setExcelLoading(false);
    }

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

    useEffect(() => {
        if (localStorage.getItem("usertoken")) {
            GetCCAPNList(currentPage);
        } else {
            navigate("/");
        }
    }, [currentPage]);

    const handlBuilderClick = (e) => {
        setShow(true);
    };

    const handleFileChange = async (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const CHUNK_SIZE = 2 * 1024 * 1024;

    const handleUploadClick = async () => {
        const file = selectedFile;

        if (file && file.type === "text/csv") {
            setIsLoading(true);
            setSelectedFileError("");

            const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
            let currentChunk = 0;

            while (currentChunk < totalChunks) {
                const start = currentChunk * CHUNK_SIZE;
                const end = Math.min(file.size, start + CHUNK_SIZE);
                const fileChunk = file.slice(start, end);

                const formData = new FormData();
                formData.append("chunk", fileChunk);
                formData.append("chunkIndex", currentChunk);
                formData.append("totalChunks", totalChunks);
                formData.append("fileName", file.name);

                try {
                    const response = await axios.post(`${process.env.REACT_APP_IMAGE_URL}api/admin/ccapn/import`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${JSON.parse(localStorage.getItem("usertoken"))}`,
                        }
                    });
                    if (response.status !== 200) {
                        throw new Error('HTTPError');
                    }

                    currentChunk++;
                    console.log(`Chunk ${currentChunk}/${totalChunks} uploaded.`);
                    setSelectedFile("");
                    document.getElementById("fileInput").value = null;
                    setIsLoading(false);

                    if (response.data) {
                        console.log(response.data);
                        let message = response.data.message;
                        if (response.data.failed_records > 0) {
                            const problematicRows = response.failed_records_details.map(detail => detail.row).join(', ');
                            message += ' Problematic Record Rows: ' + problematicRows+'.';
                        }
                        message += '. Record Imported: ' + response.data.successful_records;
                        message += '. Failed Record Count: ' + response.data.failed_records;
                        message += '. Last Row: ' + response.data.last_processed_row;
                        swal(message).then((willDelete) => {
                            if (willDelete) {
                                navigate("/ccapn");
                                setShow(false);
                            }
                        });
                    } else {
                        swal('Error: ' + response.error).then((willDelete) => {
                            if (willDelete) {
                                navigate("/ccapn");
                                setShow(false);
                            }
                        });
                    }
                    GetCCAPNList();
                } catch (error) {
                    if (error.name === "HTTPError") {
                        const errorJson = error.response.json();
                        setSelectedFile("");
                        setError(errorJson.message);
                        document.getElementById("fileInput").value = null;
                        setIsLoading(false);
                    } else {
                        swal('Error: ' + error.name).then((willDelete) => {
                            if (willDelete) {
                                navigate("/ccapn");
                                setShow(false);
                            }
                        });
                    }
                }
            };
        } else {
            setSelectedFile("");
            setSelectedFileError("Please select a CSV file.");
        }
    };

    return (
        <>
            <MainPagetitle mainTitle="CCAPNs" pageTitle="CCAPNs" parentTitle="Home" />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xl-12">
                        <div className="card">
                            <div className="card-body p-0">
                                <div className="table-responsive active-projects style-1 ItemsCheckboxSec shorting">
                                    <div className="tbl-caption d-flex justify-content-between text-wrap align-items-center pb-0">
                                        <div className="d-flex text-nowrap justify-content-between align-items-center">
                                            <h4 className="heading mb-0">CCAPNs List</h4>
                                        </div>

                                        {SyestemUserRole == "Data Uploader" ||
                      SyestemUserRole == "User" ||  SyestemUserRole == "Standard User" ? (
                        ""
                      ) : (
                                        <div>
                                            <Button
                                                className="btn-sm me-1"
                                                variant="secondary"
                                                onClick={handlBuilderClick}
                                            >
                                                Import
                                            </Button>
                                        </div>
                      )}
                                    </div>
                                    <div className="d-sm-flex text-center justify-content-between align-items-center dataTables_wrapper no-footer">
                                        <div className="dataTables_info">
                                            Showing {lastIndex - recordsPage + 1} to {lastIndex} of{" "}
                                            {fileListCount} entries
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
                                                        <th><strong>No.</strong></th>
                                                        <th><strong>Parcel Number</strong></th>
                                                        <th><strong>Full Address</strong></th>
                                                        <th><strong>Latitude</strong></th>
                                                        <th><strong>Longitude</strong></th>
                                                        <th><strong>Sub ID</strong></th>
                                                        <th><strong>Subdivision</strong></th>
                                                        <th><strong>Builder</strong></th>
                                                        <th><strong>Permits</strong></th>
                                                        <th><strong>Closings</strong></th>
                                                        <th><strong>Modification Date</strong></th>
                                                    </tr>
                                                </thead>
                                                <tbody style={{ textAlign: "center" }}>
                                                    {ccapnList !== null && ccapnList.length > 0 ? (
                                                        ccapnList.map((element, index) => (
                                                            <tr style={{ textAlign: "center" }}>
                                                                <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                                <td style={{ textAlign: "center" }}>{element.parcel}</td>
                                                                <td style={{ textAlign: "center" }}>-</td>
                                                                <td style={{ textAlign: "center" }}>{element.ll_x}</td>
                                                                <td style={{ textAlign: "center" }}>{element.ll_y}</td>
                                                                <td style={{ textAlign: "center" }}>-</td>
                                                                <td style={{ textAlign: "center" }}>{element.subname}</td>
                                                                <td style={{ textAlign: "center" }}>-</td>
                                                                <td style={{ textAlign: "center" }}>-</td>
                                                                <td style={{ textAlign: "center" }}>-</td>
                                                                <td style={{ textAlign: "center" }}>-</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="11" style={{ textAlign: "left" }}>
                                                                No data found
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={show} >
                <Modal.Header closeButton onHide={handleClose}>
                    <Modal.Title>Import CCAPNs CSV Data</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mt-3">
                        <input type="file" id="fileInput" onChange={handleFileChange} />
                    </div>
                    <p className="text-danger d-flex justify-content-center align-item-center mt-1">
                        {selectedFileError}
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleUploadClick}
                        disabled={isLoading}
                    >
                        {isLoading ? "Loading..." : "Import"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default CCAPNList;
