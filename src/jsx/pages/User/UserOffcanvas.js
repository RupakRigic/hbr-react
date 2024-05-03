import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Offcanvas, Form } from 'react-bootstrap';

import AdminBuilderService from "../../../API/Services/AdminService/AdminBuilderService";
import AdminUserRoleService from "../../../API/Services/AdminService/AdminUserRoleService";
import swal from "sweetalert";
const UserOffcanvas = forwardRef((props, ref) => {


    const [Error, setError] = useState('');
    const [addUser, setAddUser] = useState(false);
    const [BuilderCode, setBuilderCode] = useState('');
    const [BuilderList, setBuilderList] = useState([]);
    const [RoleCode, setRoleCode] = useState('');
    const [RoleList, setRoleList] = useState([]);


    const getrolelist = async () => {
        try {

            let responseData = await AdminUserRoleService.roles().json()
            setRoleList(responseData.data)
        } catch (error) {
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();

                setError(errorJson.message)
            }
        }
    }
    useEffect(() => {
        getrolelist();
    }, [])


    const getbuilderlist = async () => {

        try {

            let response = await AdminBuilderService.index()
            let responseData = await response.json()

            setBuilderList(responseData.data)

        } catch (error) {
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();

                setError(errorJson.message)
            }
        }
    }
    useEffect(() => {
        getbuilderlist();
    }, [])

    useImperativeHandle(ref, () => ({
        showEmployeModal() {
            setAddUser(true)
        }
    }));

    const navigate = useNavigate()
    
    const handleBuilderCode = code => {

        setBuilderCode(code.target.value);
    }

    const handleRoleCode = code => {

        setRoleCode(code.target.value);
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
    
        try {
            var userData = {
                "builder_id": BuilderCode,
                "role_id": RoleCode,
                "name": event.target.name.value,
                "email": event.target.email.value,
                "password": event.target.password.value
            }
            const data = await AdminUserRoleService.store(userData).json();
            if (data.status === true) {

                swal("User Create Succesfully").then((willDelete) => {
                    if (willDelete) {
                        setAddUser(false)
                        props.parentCallback();

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
        <>
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
                                    <label htmlFor="exampleFormControlInput3" className="form-label"> Name <span className="text-danger">*</span></label>
                                    <input type="text" name='name' className="form-control" id="exampleFormControlInput3" placeholder="" />
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
                                    <label className="form-label">Role<span className="text-danger">*</span></label>
                                    <Form.Group controlId="tournamentList">

                                        <Form.Select
                                            onChange={handleRoleCode}
                                            value={RoleCode}
                                            className="default-select form-control"
                                        >
                                            <option value=''>Select Role</option>
                                            {
                                                RoleList.map((element) => (
                                                    <option value={element.id}>{element.name}</option>
                                                ))
                                            }
                                        </Form.Select>
                                    </Form.Group>

                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label className="form-label">Builder<span className="text-danger">*</span></label>
                                    <Form.Group controlId="tournamentList">

                                        <Form.Select
                                            onChange={handleBuilderCode}
                                            value={BuilderCode}
                                            className="default-select form-control"
                                        >
                                            <option value=''>Select Builder</option>
                                            {
                                                BuilderList.map((element) => (
                                                    <option value={element.id}>{element.name}</option>
                                                ))
                                            }
                                        </Form.Select>
                                    </Form.Group>

                                </div>
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
        </>
    );
});

export default UserOffcanvas;