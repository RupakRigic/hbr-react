import React, { Fragment, useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import AdminBuilderService from '../../../API/Services/AdminService/AdminBuilderService';
import swal from "sweetalert";
import Select from "react-select";
import MainPagetitle from "../../layouts/MainPagetitle";
const BuilderUpdate = () => {
    const [file, setFile] = useState('');
    const [isActive, setIsActive] = useState('');
    const [company_type, setCompany_type] = useState('');
    const [Error, setError] = useState('');
    const [Builder, SetBuilder] = useState([]);
    const params = useParams();
    const navigate = useNavigate()
    const isActiveData = [
        { value: '0', label: 'true' },
        { value: '1', label: 'false' }

    ]
    const CompanyData = [
        { value: 'public', label: 'Public' },
        { value: 'private', label: 'Private' }

    ]
    const GetBanner = async (id) => {
        try {
            let responseData = await AdminBuilderService.show(id).json()
            SetBuilder(responseData);

            let Isactivedata = isActiveData.filter(function (item) {

                return item.value === responseData.is_active.toString();

            });

            setIsActive(Isactivedata)
            let Companydata = CompanyData.filter(function (item) {

                return item.value === responseData.company_type;

            });

            setCompany_type(Companydata)

        } catch (error) {
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();

                setError(errorJson.message)
            }
        }
    }
    useEffect(() => {
        if (localStorage.getItem('usertoken')) {

            GetBanner(params.id);
        }
        else {
            navigate('/');
        }

    }, [])
    const handleActive = e => {

        setIsActive(e);

    }
    const handleCompanyType = e => {

        setCompany_type(e);

    }
    function handleChangeImage(e) {
        const fileReader = new FileReader()
        fileReader.readAsDataURL(e.target.files[0])

        fileReader.onload = () => {
            var image = fileReader.result
            setFile(image)

        }

    }
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {

            var userData = {
                "builder_code": event.target.code.value,
                "name": event.target.name.value,
                "website": event.target.website.value,
                "phone": event.target.phone.value,
                "fax": event.target.fax.value,
                "officeaddress1": event.target.officeaddress1.value,
                "officeaddress2": event.target.officeaddress2.value,
                "city": event.target.city.value,
                "zipcode": event.target.zipcode.value,
                "is_active": isActive.value ? isActive.value : Builder.is_active,
                "company_type": company_type.value ? company_type.value : Builder.company_type,
                "stock_market": event.target.stock_market.value,
                "current_division_president": event.target.current_division_president.value,
                "stock_symbol": event.target.stock_symbol.value,
                "current_land_aquisitions": event.target.current_land_aquisitions.value,
                "coporate_officeaddress_1": event.target.coporate_officeaddress_1.value,
                "coporate_officeaddress_2": event.target.coporate_officeaddress_2.value,
                "coporate_officeaddress_city": event.target.coporate_officeaddress_city.value,
                "coporate_officeaddress_zipcode": event.target.coporate_officeaddress_zipcode.value,
                // "logo": "",
                "logo": file ? file.split(',')[1] : Builder.logo,
                "coporate_officeaddress_lat": event.target.coporate_officeaddress_lat.value,
                "coporate_officeaddress_lng": event.target.coporate_officeaddress_lng.value,
            }
            const data = await AdminBuilderService.update(params.id, userData).json();
            if (data.status === true) {

                swal("Builder Update Succesfully").then((willDelete) => {
                    if (willDelete) {
                        localStorage.setItem("UpdateBuilderName",JSON.stringify(event.target.name.value));
                        localStorage.setItem("UpdateID", params.id);
                        navigate('/builderList');
                    }
                })

            }
        }
        catch (error) {
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();

                setError(errorJson.message.substr(0, errorJson.message.lastIndexOf(".")))
            }
        }


    }
    return (
        <Fragment>
            <MainPagetitle mainTitle="Edit Builder" pageTitle="Edit Builder" parentTitle="Builders" link="/builderList" />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Edit Builder</h4>
                            </div>
                            <div className="card-body">
                                <div className="form-validation">
                                    <form onSubmit={handleSubmit}>
                                        <div className="row">
                                            <div className="col-xl-6 mb-3">
                                                <label htmlFor="exampleFormControlInput1" className="form-label">Builder Code <span className="text-danger">*</span></label>
                                                <input type="text" name="code"

                                                    defaultValue={Builder.builder_code}

                                                    className="form-control" id="exampleFormControlInput1" placeholder="" />
                                            </div>
                                            <div className="col-xl-6 mb-3">
                                                <label htmlFor="exampleFormControlInput2" className="form-label"> Name <span className="text-danger">*</span></label>
                                                <input type="text" name='name' defaultValue={Builder.name} className="form-control" id="exampleFormControlInput2" placeholder="" />
                                            </div>
                                            <div className="col-xl-6 mb-3">
                                                <label htmlFor="exampleFormControlInput3" className="form-label"> Website </label>
                                                <input type="text" name='website' defaultValue={Builder.website} className="form-control" id="exampleFormControlInput3" placeholder="" />
                                            </div>
                                            <div className="col-xl-6 mb-3">
                                                <label htmlFor="exampleFormControlInput4" className="form-label">Mobile </label>
                                                <input
                                                  type="tel"
                                                  defaultValue={Builder.phone}
                                                  name="phone"
                                                  className="form-control"
                                                  id="exampleFormControlInput7"
                                                  placeholder=""
                                                  maxLength="12"
                                                  onInput={(e) => {
                                                    let input = e.target.value.replace(/\D/g, '');
                                                    if (input.length > 0) {
                                                      input = input.substring(0, 10);
                                                      if (input.length > 3 && input.length <= 6) {
                                                        input = `${input.substring(0, 3)}-${input.substring(3, 6)}`;
                                                      } else if (input.length > 6) {
                                                        input = `${input.substring(0, 3)}-${input.substring(3, 6)}-${input.substring(6, 10)}`;
                                                      } else {
                                                        input = input;
                                                      }
                                                    }
                                                    e.target.value = input;
                                                  }}
                                                />
                                            </div>
                                            <div className="col-xl-6 mb-3">
                                                <label htmlFor="exampleFormControlInput5" className="form-label"> Fax </label>
                                                <input type="text" name='fax' defaultValue={Builder.fax} className="form-control" id="exampleFormControlInput5" placeholder="" />
                                            </div>

                                            <div className="col-xl-6 mb-3">
                                                <label className="form-label">Is Active </label>

                                                <Select
                                                    options={isActiveData}
                                                    className=" react-select-container"
                                                    classNamePrefix="react-select"
                                                    value={isActive}
                                                    onChange={handleActive}
                                                />
                                            </div>

                                            <div className="col-xl-12 mb-3">
                                                <label className="form-label">Office Address 1 </label>
                                                <textarea rows="2" name='officeaddress1' defaultValue={Builder.officeaddress1} className="form-control"></textarea>
                                            </div>
                                            <div className="col-xl-12 mb-3">
                                                <label className="form-label">Office Address 2 </label>
                                                <textarea rows="2" name='officeaddress2' defaultValue={Builder.officeaddress2} className="form-control"></textarea>
                                            </div>
                                            <div className="col-xl-6 mb-3">
                                                <label htmlFor="exampleFormControlInput6" className="form-label"> City </label>
                                                <input type="text" name='city' defaultValue={Builder.city} className="form-control" id="exampleFormControlInput6" placeholder="" />
                                            </div>
                                            <div className="col-xl-6 mb-3">
                                                <label htmlFor="exampleFormControlInput7" className="form-label"> Zipcode </label>
                                                <input type="text" name='zipcode' defaultValue={Builder.zipcode} className="form-control" id="exampleFormControlInput7" placeholder="" />
                                            </div>


                                            <div className="col-xl-6 mb-3">
                                                <label className="form-label">Company Type <span className="text-danger">*</span></label>
                                                {/* <select className="default-select form-control" onChange={handleCompanyType} >

                                                    <option value="public">Public</option>
                                                    <option value="private">Private</option>

                                                </select> */}
                                                <Select
                                                    options={CompanyData}
                                                    className=" react-select-container"
                                                    classNamePrefix="react-select"
                                                    value={company_type}
                                                    onChange={handleCompanyType}
                                                />

                                            </div>

                                            <div className="col-xl-6 mb-3">
                                                <label htmlFor="exampleFormControlInput10" className="form-label">Stock Market</label>
                                                <input type="text" name='stock_market' defaultValue={Builder.stock_market} className="form-control" id="exampleFormControlInput10" placeholder="" />
                                            </div>
                                            <div className="col-xl-6 mb-3">
                                                <label htmlFor="exampleFormControlInput11" className="form-label">Current Division President</label>
                                                <input type="text" name='current_division_president' defaultValue={Builder.current_division_president} className="form-control" id="exampleFormControlInput11" placeholder="" />
                                            </div>
                                            <div className="col-xl-6 mb-3">
                                                <label htmlFor="exampleFormControlInput12" className="form-label">Stock Symbol</label>
                                                <input type="text" name='stock_symbol' defaultValue={Builder.stock_symbol} className="form-control" id="exampleFormControlInput12" placeholder="" />
                                            </div>

                                            <div className="col-xl-6 mb-3">
                                                <label htmlFor="exampleFormControlInput16" className="form-label">Coporate Officeaddress City</label>
                                                <input type="text" name='coporate_officeaddress_city' defaultValue={Builder.coporate_officeaddress_city} className="form-control" id="exampleFormControlInput16" placeholder="" />
                                            </div>
                                            <div className="col-xl-6 mb-3">
                                                <label htmlFor="exampleFormControlInput17" className="form-label">Coporate Officeaddress Zipcode</label>
                                                <input type="text" name='coporate_officeaddress_zipcode' defaultValue={Builder.coporate_officeaddress_zipcode} className="form-control" id="exampleFormControlInput17" placeholder="" />
                                            </div>

                                            <div className="col-xl-12 mb-3">
                                                <label className="form-label">Current Land Aquisitions </label>
                                                <textarea rows="2" name='current_land_aquisitions' defaultValue={Builder.current_land_aquisitions} className="form-control"></textarea>
                                            </div>
                                            <div className="col-xl-12 mb-3">
                                                <label className="form-label">Coporate Officeaddress  1 </label>
                                                <textarea rows="2" name='coporate_officeaddress_1' defaultValue={Builder.coporate_officeaddress_1} className="form-control"></textarea>
                                            </div>
                                            <div className="col-xl-12 mb-3">
                                                <label className="form-label">Coporate Officeaddress  2 </label>
                                                <textarea rows="2" name='coporate_officeaddress_2' defaultValue={Builder.coporate_officeaddress_2} className="form-control"></textarea>
                                            </div>
                                            <div className="col-xl-12 mb-3">
                                                <label className="form-label">coporate_officeaddress_lat</label>
                                                <textarea rows="2" name='coporate_officeaddress_lat' defaultValue={Builder.coporate_officeaddress_lat} className="form-control"></textarea>
                                            </div>
                                            <div className="col-xl-12 mb-3">
                                                <label className="form-label">coporate_officeaddress_lng</label>
                                                <textarea rows="2" name='coporate_officeaddress_lng' defaultValue={Builder.coporate_officeaddress_lng} className="form-control"></textarea>
                                            </div>
                                            <p className='text-danger fs-12'>{Error}</p>
                                            <div>
                                                <svg width="41" height="40" viewBox="0 0 41 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M27.1666 26.6667L20.4999 20L13.8333 26.6667" stroke="#DADADA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M20.5 20V35" stroke="#DADADA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M34.4833 30.6501C36.1088 29.7638 37.393 28.3615 38.1331 26.6644C38.8731 24.9673 39.027 23.0721 38.5703 21.2779C38.1136 19.4836 37.0724 17.8926 35.6111 16.7558C34.1497 15.619 32.3514 15.0013 30.4999 15.0001H28.3999C27.8955 13.0488 26.9552 11.2373 25.6498 9.70171C24.3445 8.16614 22.708 6.94647 20.8634 6.1344C19.0189 5.32233 17.0142 4.93899 15.0001 5.01319C12.9861 5.0874 11.015 5.61722 9.23523 6.56283C7.45541 7.50844 5.91312 8.84523 4.7243 10.4727C3.53549 12.1002 2.73108 13.9759 2.37157 15.959C2.01205 17.9421 2.10678 19.9809 2.64862 21.9222C3.19047 23.8634 4.16534 25.6565 5.49994 27.1667" stroke="#DADADA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M27.1666 26.6667L20.4999 20L13.8333 26.6667" stroke="#DADADA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <div className="col-xl-12 mb-3">
                                                    <input name="logo" type="file" multiple onChange={handleChangeImage} />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <button type="submit" className="btn btn-primary me-1">Submit</button>
                                            <Link to={"/builderList"} type="reset" className="btn btn-danger light ms-1">Cancel</Link>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </Fragment>
    );
};

export default BuilderUpdate;
