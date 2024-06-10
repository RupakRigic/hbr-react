import React, { useEffect, useState } from 'react';
import MainPagetitle from '../../layouts/MainPagetitle';
import { Link, useNavigate } from 'react-router-dom';
import Button from "react-bootstrap/Button";
import ClipLoader from 'react-spinners/ClipLoader';
import swal from "sweetalert";
import AdminCCAPNService from '../../../API/Services/AdminService/AdminCCAPNService';
import AccessField from '../../components/AccssFieldComponent/AccessFiled';
import Modal from "react-bootstrap/Modal";

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
    const handleClose = () => setShow(false);

    const stringifySortConfig = (sortConfig) => {
        return sortConfig.map((sort) => `${sort.key}:${sort.direction}`).join(",");
    };

    const GetCCAPNList = async (pageNumber) => {
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

            setCCAPNList(responseData.data);
            setNpage(Math.ceil(responseData.total / recordsPage));
            setFileListCount(responseData.total);
            setIsLoading(false);

        } catch (error) {
            console.log(error)
            if (error.name === "HTTPError") {
                const errorJson = await error.response.json();

                setError(errorJson.message);
            }
        }
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

    const handleUploadClick = async () => {
        const file = selectedFile;

        if (file && file.type === "text/csv") {
            setIsLoading(true);
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = async () => {
                var iFile = fileReader.result;
                setSelectedFile(iFile);
                console.log(iFile);
                const inputData = {
                    csv: iFile,
                };
                console.log(inputData);
                try {
                    let responseData = await AdminCCAPNService.import(inputData).json();
                    setSelectedFile("");
                    document.getElementById("fileInput").value = null;
                    setIsLoading(false);
                    console.log(responseData)
                    swal("Imported Sucessfully").then((willDelete) => {
                        if (willDelete) {
                            navigate("/ccapn");
                            setShow(false);
                        }
                    });
                    GetCCAPNList();
                } catch (error) {
                    if (error.name === "HTTPError") {
                        const errorJson = error.response.json();
                        setSelectedFile("");
                        setError(errorJson.message);
                        document.getElementById("fileInput").value = null;
                        setIsLoading(false);
                    }
                }
            };

            setSelectedFileError("");
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
                                        <div>
                                            <Button
                                                className="btn-sm me-1"
                                                variant="secondary"
                                                onClick={handlBuilderClick}
                                            >
                                                Import
                                            </Button>
                                        </div>
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
                                                        <th><strong>PARCEL</strong></th>
                                                        <th><strong>LOC_STRDIR</strong></th>
                                                        <th><strong>LOC_STRNO</strong></th>
                                                        <th><strong>LOC_STRNAME</strong></th>
                                                        <th><strong>LOC_STRTYPE</strong></th>
                                                        <th><strong>LOC_STRUNIT</strong></th>
                                                        <th><strong>LOC_CITY</strong></th>
                                                        <th><strong>LOC_STRFRAC</strong></th>
                                                        <th><strong>ADTYPE</strong></th>
                                                        <th><strong>ADFILE</strong></th>
                                                        <th><strong>ADPAGE</strong></th>
                                                        <th><strong>ADPART</strong></th>
                                                        <th><strong>ADBLKCD</strong></th>
                                                        <th><strong>ADBLK</strong></th>
                                                        <th><strong>ADLOTCD</strong></th>
                                                        <th><strong>ADLOT</strong></th>
                                                        <th><strong>SECTNO</strong></th>
                                                        <th><strong>TOWNSHIP</strong></th>
                                                        <th><strong>RANGE</strong></th>
                                                        <th><strong>SUBNAME</strong></th>
                                                        <th><strong>ll_x</strong></th>
                                                        <th><strong>ll_y</strong></th>

                                                    </tr>
                                                </thead>
                                                <tbody style={{ textAlign: "center" }}>
                                                    {ccapnList !== null && ccapnList.length > 0 ? (
                                                        ccapnList.map((element, index) => (
                                                            <tr style={{ textAlign: "center" }}>
                                                                <td style={{ textAlign: "center" }}>{index + 1}</td>
                                                                <td style={{ textAlign: "center" }}>{element.parcel}</td>
                                                                <td style={{ textAlign: "center" }}>{element.loc_strdir}</td>
                                                                <td style={{ textAlign: "center" }}>{element.loc_strno}</td>
                                                                <td style={{ textAlign: "center" }}>{element.loc_strname}</td>
                                                                <td style={{ textAlign: "center" }}>{element.loc_strtype}</td>
                                                                <td style={{ textAlign: "center" }}>{element.loc_strunit}</td>
                                                                <td style={{ textAlign: "center" }}>{element.loc_city}</td>
                                                                <td style={{ textAlign: "center" }}>{element.loc_strfrac}</td>
                                                                <td style={{ textAlign: "center" }}>{element.adtype}</td>
                                                                <td style={{ textAlign: "center" }}>{element.adfile}</td>
                                                                <td style={{ textAlign: "center" }}>{element.adpage}</td>
                                                                <td style={{ textAlign: "center" }}>{element.adpart}</td>
                                                                <td style={{ textAlign: "center" }}>{element.adblkcd}</td>
                                                                <td style={{ textAlign: "center" }}>{element.adblk}</td>
                                                                <td style={{ textAlign: "center" }}>{element.adlotcd}</td>
                                                                <td style={{ textAlign: "center" }}>{element.adlot}</td>
                                                                <td style={{ textAlign: "center" }}>{element.sectno}</td>
                                                                <td style={{ textAlign: "center" }}>{element.township}</td>
                                                                <td style={{ textAlign: "center" }}>{element.range}</td>
                                                                <td style={{ textAlign: "center" }}>{element.subname}</td>
                                                                <td style={{ textAlign: "center" }}>{element.ll_x}</td>
                                                                <td style={{ textAlign: "center" }}>{element.ll_y}</td>

                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="7" style={{ textAlign: "center" }}>
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

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
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
