import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import swal from "sweetalert";
import AdminBuilderService from '../../../API/Services/AdminService/AdminBuilderService';
import RechartJs from "../../components/charts/rechart";

const Statistics = () => {
    const [Error, setError] = useState('');
    var imageUrl = process.env.REACT_APP_Builder_IMAGE_URL
    const [BuilderList, setBuilderList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPage = 5;
    const lastIndex = currentPage * recordsPage;
    const firstIndex = lastIndex - recordsPage;
    const records = BuilderList.slice(firstIndex, lastIndex);
    const npage = Math.ceil(BuilderList.length / recordsPage)
    const number = [...Array(npage + 1).keys()].slice(1)
    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem('usertoken')) {
        }
        else {
            navigate('/');
        }

    }, [])
    
    return (
        <>
            <div className="container-fluid">
                <div className="row">
                <RechartJs />

                    {/* <div className="col-xl-12">
                        <div className="card">
                            <div className="card-body p-0">
                                <div className="table-responsive active-projects style-1 ItemsCheckboxSec shorting">
                                    <div className="tbl-caption d-flex justify-content-between text-wrap align-items-center">
                                        <div>
                                            <RechartJs />
                                        </div>
                                    </div>
                                   
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </>
    );
};

export default Statistics;
