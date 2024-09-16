import React, { useState, forwardRef, useImperativeHandle, useEffect, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Offcanvas, Form } from 'react-bootstrap';
import AdminBuilderService from "../../../API/Services/AdminService/AdminBuilderService";
import AdminUserRoleService from "../../../API/Services/AdminService/AdminUserRoleService";
import swal from "sweetalert";
import Select from 'react-select';
import { MultiSelect } from 'react-multi-select-component';

const UserOffcanvas = forwardRef((props, ref) => {
    const [Error, setError] = useState('');
    const [addUser, setAddUser] = useState(false);
    const [BuilderCode, setBuilderCode] = useState('');
    const [BuilderList, setBuilderList] = useState([]);
    const [RoleCode, setRoleCode] = useState('');
    const [standardRoleCode, setStandardRoleCode] = useState([]);
    const [RoleName, setRoleName] = useState('');
    const [RoleList, setRoleList] = useState([]);
    const [StandardUser, setStandardUser] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        GetRoleList();
        GetBuilderList();
    }, []);

    const GetRoleList = async () => {
        try {
            let responseData = await AdminUserRoleService.roles().json()
            setRoleList(responseData)
        } catch (error) {
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();
                setError(errorJson.message)
            }
        }
    };

    const GetBuilderList = async () => {
        try {
            let response = await AdminBuilderService.all_builder_list()
            let responseData = await response.json()
            setBuilderList(responseData)
        } catch (error) {
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();
                setError(errorJson.message)
            }
        }
    };

    const roleOptions = RoleList.map(element => ({
        value: element.id,
        label: element.name
    }));

    const StandardUserOptions = [
        { value: 10, label: "Account Admin" },
        { value: 11, label: "Data Uploader" },
    ];

    const options = BuilderList
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(element => ({
        value: element.id,
        label: element.name
    }));

    useImperativeHandle(ref, () => ({
        showEmployeModal() {
            setAddUser(true);
        }
    }));
    
    const handleBuilderCode = (code) => {
        setBuilderCode(code.value);
    };

    const handleRoleCode = (code) => {
        setRoleCode(code.value);
        setRoleName(code.label);
    };

    const handleStandardUser = (code) => {
        const selectedValues = code.map(item => item.value);
        setStandardRoleCode(selectedValues);
        setStandardUser(code);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            var userData = {
                "builder_id": BuilderCode,
                "role_id": RoleCode == 9 ? standardRoleCode : RoleCode,
                "name": event.target.firstname.value,
                "last_name": event.target.lastname.value,
                "email": event.target.email.value,
                "notes": event.target.notes.value,
                "company": event.target.company.value,
                "password": event.target.password.value
            }
            const data = await AdminUserRoleService.store(userData).json();
            if (data.status === true) {
                swal("User Create Succesfully").then((willDelete) => {
                    if (willDelete) {
                        setAddUser(false);
                        props.parentCallback();
                    }
                })
            }
        }
        catch (error) {
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();
                setError(errorJson.message.substr(0, errorJson.message.lastIndexOf(".")));
            }
        }
    };

    return (
        <Fragment>
            <Offcanvas show={addUser} onHide={setAddUser} className="offcanvas-end customeoff" placement='end'>
                <div className="offcanvas-header">
                    <h5 className="modal-title" id="#gridSystemModal">{props.Title}</h5>
                    <button type="button" className="btn-close"
                        onClick={() => setAddUser(false)}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div className="offcanvas-body">
                    <div className="container-fluid">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput2" className="form-label"> First Name <span className="text-danger">*</span></label>
                                    <input type="text" name='firstname' className="form-control" id="exampleFormControlInput2" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput3" className="form-label"> Last Name <span className="text-danger">*</span></label>
                                    <input type="text" name='lastname' className="form-control" id="exampleFormControlInput3" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput4" className="form-label">Email <span className="text-danger"></span></label>
                                    <input type="email" name='email' className="form-control" id="exampleFormControlInput4" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput5" className="form-label"> Password <span className="text-danger">*</span></label>
                                    <input type="password" name='password' className="form-control" id="exampleFormControlInput5" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput6" className="form-label"> Notes <span className="text-danger">*</span></label>
                                    <input type="text" name='notes' className="form-control" id="exampleFormControlInput6" placeholder="" />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput7" className="form-label"> Company <span className="text-danger">*</span></label>
                                    <input type="text" name='company' className="form-control" id="exampleFormControlInput7" placeholder="" />
                                </div>
          
                                <div className="col-xl-6 mb-3">
                                    <label className="form-label">Builder<span className="text-danger">*</span></label>
                                    <Select
                                        options={options}
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

                                <div className="col-xl-6 mb-3">
                                    <label className="form-label">Role<span className="text-danger">*</span></label>
                                    <Select
                                        options={roleOptions}
                                        onChange={(selectedOption) => handleRoleCode(selectedOption)}
                                        placeholder="Select Role"
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

                                {(RoleName == "Standard User" && RoleCode == 9) && <div className="col-xl-6 mb-3">
                                    <label className="form-label">Standard User<span className="text-danger">*</span></label>
                                    <MultiSelect
                                        options={StandardUserOptions}
                                        onChange={(selectedOption) => handleStandardUser(selectedOption)}
                                        value={StandardUser}
                                        placeholder="Select Role"
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
                                </div>}
                                <p className='text-danger fs-12'>{Error}</p>
                            </div>
                            <div>
                                <button type="submit" className="btn btn-primary me-1">Submit</button>
                                <Link to={"#"} onClick={() => setAddUser(false)} className="btn btn-danger light ms-1">Cancel</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </Offcanvas>
        </Fragment>
    );
});

export default UserOffcanvas;