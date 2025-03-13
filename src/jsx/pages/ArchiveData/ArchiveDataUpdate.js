import React, { Fragment, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminBuilderService from '../../../API/Services/AdminService/AdminBuilderService';
import MainPagetitle from '../../layouts/MainPagetitle';
import ClipLoader from 'react-spinners/ClipLoader';
import swal from "sweetalert";

const ArchiveDataUpdate = () => {
    const params = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [reset, setReset] = useState(false);
    const [archiveDataShow, setArchiveDataShow] = useState([]);
    const [archiveDataColumns, setArchiveDataColumns] = useState([]);
    const [formData, setFormData] = useState({});

    const [currentPage, setCurrentPage] = useState(1);
    const recordsPage = 100;
    const lastIndex = currentPage * recordsPage;
    const firstIndex = lastIndex - recordsPage;
    const records = archiveDataShow?.slice(firstIndex, lastIndex);
    const npage = Math.ceil(archiveDataShow?.length / recordsPage);
    const number = [...Array(npage + 1).keys()].slice(1);
    console.log(formData);


    useEffect(() => {
        if (params?.id) {
            ArchiveDataShow(params?.id, reset);
        }
    }, [params.id]);

    const prePage = () => {
        if (currentPage !== 1) {
            setCurrentPage(currentPage - 1);
            setFormData(formData);
        }
    };

    const changeCPage = (id) => {
        setCurrentPage(id);
        setFormData(formData);
    };

    const nextPage = () => {
        if (currentPage !== npage) {
            setCurrentPage(currentPage + 1);
            setFormData(formData);
        }
    };

    const ArchiveDataShow = async (id, reset) => {
        setIsLoading(true);
        try {
            const selectedYear = JSON.parse(localStorage.getItem("selectedYear"));
            const selectedMonth = JSON.parse(localStorage.getItem("selectedMonth"));
            var userData = {
                year: selectedYear?.value,
                month: selectedMonth?.value
            }
            const response = await AdminBuilderService.archive_data_show(id, userData).json();
            if (response.status) {
                setIsLoading(false);
                setReset(false);
                const data = response.data;
                setArchiveDataShow(data);
                if (reset) {
                    swal("Data reset successfully.");
                }

                if (Array.isArray(data) && data.length > 0) {
                    const columns = Object.keys(data[0]);
                    setArchiveDataColumns(columns);
                } else {
                    setArchiveDataColumns([]); // No data, empty columns
                }
            } else {
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

    const SaveAll = async (e) => {
        e.preventDefault();
        if (Object.keys(formData).length === 0) {
            swal("No changes are available.").then((willDelete) => {
                if (willDelete) {
                    return;
                }
            });
        } else {
            try {
                const data = await AdminBuilderService.archive_all_data_update(params.id, formData).json();
                if (data.status === true) {
                    swal("Data save successfully.").then((willDelete) => {
                        if (willDelete) {
                            ArchiveDataShow(params.id, reset);
                        }
                    });
                }
            } catch (error) {
                if (error.name === "HTTPError") {
                    const errorJson = await error.response.json();
                    console.log(errorJson);
                }
            }
        }
    };

    const handleChange = (event, id) => {
        setReset(false);
        const { name, value } = event.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: {
                ...prevState[id],
                [name]: value,
            },
        }));
    };

    const handleReset = () => {
        setReset(true);
        setFormData({});
        ArchiveDataShow(params.id, true);
    }

    return (
        <Fragment>
            <MainPagetitle
                mainTitle="Archive Data Update"
                pageTitle="Archive Data Update"
                parentTitle="Home"
            />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xl-12">
                        <div className="card">
                            <div className="card-body p-0">
                                <div className="table-responsive active-projects style-1 ItemsCheckboxSec shorting">
                                    <div className="tbl-caption d-flex justify-content-between text-wrap align-items-center">
                                        <h4 className="heading mb-0">Archive Data Update List</h4>
                                        <div className="d-flex">
                                            <button className="btn btn-primary btn-sm me-1"
                                                style={{ marginLeft: "5px" }}
                                                onClick={(e) => SaveAll(e)}
                                            >
                                                Save All
                                            </button>
                                            <button className="btn btn-primary btn-sm me-1"
                                                onClick={() => swal({
                                                    title: "Are you sure?",
                                                    text: "Reset the data that they've entered.",
                                                    icon: "warning",
                                                    buttons: {
                                                        cancel: "No",
                                                        confirm: "Yes"
                                                    },
                                                    dangerMode: false,
                                                }).then((willGenerate) => {
                                                    if (willGenerate) {
                                                        handleReset();
                                                    }
                                                })}
                                            >
                                                Cancel
                                            </button>

                                            <button className="btn btn-primary btn-sm me-1"
                                                onClick={() => {
                                                    navigate("/downloading-archive-data");
                                                    localStorage.removeItem("selectedYear");
                                                    localStorage.removeItem("selectedMonth");
                                                }}
                                            >
                                                Go Back
                                            </button>
                                        </div>
                                    </div>
                                    <div className="d-sm-flex text-center justify-content-between align-items-center dataTables_wrapper no-footer">
                                        <div className="dataTables_info">
                                            Showing {lastIndex - recordsPage + 1} to {lastIndex} of{" "}
                                            {archiveDataShow?.length} entries
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
                                            <div className="d-flex justify-content-center align-items-center mt-5 mb-5">
                                                <ClipLoader color="#4474fc" />
                                            </div>
                                        ) : (
                                            <table
                                                id="empoloyees-tblwrapper"
                                                className="table ItemsCheckboxSec dataTable no-footer mb-0 archivedata-update-table"
                                            >
                                                <thead>
                                                    <tr style={{ textAlign: "center" }}>
                                                        <th>No</th>
                                                        {archiveDataColumns?.filter((col) => col.toLowerCase() !== "id")?.map((col, index) => (
                                                            <th key={index}>{col}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {records?.map((row, idx) => {
                                                        const currentId = row.id;
                                                        return (
                                                            <tr key={currentId} style={{ textAlign: "center" }}>
                                                                <td>{(currentPage - 1) * 100 + (idx + 1)}</td>
                                                                {archiveDataColumns?.filter((col) => col.toLowerCase() !== "id")?.map((col, index) => (
                                                                    <td key={index}>
                                                                        <input
                                                                            type="text"
                                                                            defaultValue={row[col]}
                                                                            disabled={col === "subdivision_id"}
                                                                            value={formData[currentId]?.[col] ?? row[col] ?? ""}
                                                                            className="form-control"
                                                                            style={{ width: "auto", cursor: col === "subdivision_id" && "not-allowed", backgroundColor: col === "subdivision_id" && "#e9ecef" }}
                                                                            name={col}
                                                                            onChange={(event) => handleChange(event, currentId)}
                                                                        />
                                                                    </td>
                                                                ))}
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                    <div className="d-sm-flex text-center justify-content-between align-items-center dataTables_wrapper no-footer">
                                        <div className="dataTables_info">
                                            Showing {lastIndex - recordsPage + 1} to {lastIndex} of{" "}
                                            {archiveDataShow?.length} entries
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
        </Fragment>
    );
};

export default ArchiveDataUpdate;
