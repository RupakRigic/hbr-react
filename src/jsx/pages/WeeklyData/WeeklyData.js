import React, { useState, useEffect, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminBuilderService from '../../../API/Services/AdminService/AdminBuilderService';
import MainPagetitle from '../../layouts/MainPagetitle';
import './WeeklyData.css'
import AdminWeeklyDataService from "../../../API/Services/AdminService/AdminWeeklyDataService";
import ClipLoader from "react-spinners/ClipLoader";
import Select from 'react-select';

const BuilderTable = () => {
    const navigate = useNavigate();

    const [Error, setError] = useState('');
    const [weekEndDates, setWeekEndDates] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [BuilderList, setBuilderList] = useState([]);
    const [BuilderCode, setBuilderCode] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);
    const [errorMessage, setErrorMessage] = useState(false);
    const recordsPage = 5;
    const lastIndex = currentPage * recordsPage;
    const firstIndex = lastIndex - recordsPage;

    useEffect(() => {
        if (localStorage.getItem('usertoken')) {
            localStorage.removeItem('enddate');
            localStorage.removeItem('builderId');
            getWeekEndDate();
            GetBuilderlist();
        }
        else {
            navigate('/');
        }
    }, []);

    const handleSelectChange = (event) => {
        setSelectedEndDate(event.target.value);
        localStorage.setItem('enddate', event.target.value);
    };

    const getWeekEndDate = async () => {
        try {
            let responseData = await AdminWeeklyDataService.getdate().json();
            let datesArray = responseData.dates.map(date => new Date(date));
            let today = new Date();
            let nearestDate = datesArray.reduce((prev, curr) => 
                Math.abs(curr - today) < Math.abs(prev - today) ? curr : prev
            );
            let nearestDateString = nearestDate.toISOString().split('T')[0];
            setWeekEndDates(responseData.dates);
            setSelectedEndDate(nearestDateString);
            localStorage.setItem('enddate', nearestDateString);
        } catch (error) {
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();
                setError(errorJson.message);
            }
        }
    };

    const handleBuilderCode = (code) => {
        setBuilderCode(code.value);
        localStorage.setItem('builderId', code.value);
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
            }
        }
        setIsLoading(false);
    };

    const options = BuilderList
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(element => ({
            value: element.id,
            label: element.name
        }));

    return (
        <Fragment>
            <MainPagetitle mainTitle="Data Reporting" pageTitle="Data Reporting" parentTitle="Home" />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xl-6">
                        <div className="card weekly-card">
                            <div className="card-body p-0">
                                <div className="table-responsive active-projects style-1 ItemsCheckboxSec shorting">
                                    <div className="tbl-caption d-flex justify-content-center text-wrap align-items-center">
                                        <h4 className="heading mb-0" style={{ backgroundColor: "#4974b9" }}>Enter Data Reporting</h4>
                                    </div>
                                    {isLoading ? (
                                        <div className="d-flex justify-content-center align-items-center mb-5">
                                            <ClipLoader color="#4474fc" />
                                        </div>
                                    ) : (
                                        <div className='dataTables_wrapper no-footer'>
                                            <p className='text-center' style={{color: errorMessage && "red"}}>Select the Week ending date and builder, and click continue.</p>
                                            <div className="d-flex justify-content-center mb-5">
                                                <select onChange={handleSelectChange} value={selectedEndDate}>
                                                    {weekEndDates && weekEndDates.map((item) =>
                                                        <option>{item}</option>
                                                    )}
                                                </select>
                                            </div>

                                            <div className="d-flex justify-content-center">
                                                <Select
                                                    options={options}
                                                    onChange={(selectedOption) => handleBuilderCode(selectedOption)}
                                                    placeholder="Search and select a builder..."
                                                    styles={{
                                                        container: (provided) => ({
                                                            ...provided,
                                                            width: '50%',
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
                                            <Link 
                                                className='mt-4'
                                                to={selectedEndDate && BuilderCode ? "/weekly-data-index" : "#"} 
                                                onClick={(e) => {
                                                    if (!selectedEndDate || !BuilderCode) {
                                                      e.preventDefault(); // Prevents navigation if conditions are not met
                                                      setErrorMessage(true);
                                                    } else {
                                                      setErrorMessage(false);
                                                    }
                                                }}
                                            >
                                                Continue
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default BuilderTable;
