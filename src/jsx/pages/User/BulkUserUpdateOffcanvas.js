import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Offcanvas, Form } from 'react-bootstrap';
import AdminBuilderService from "../../../API/Services/AdminService/AdminBuilderService";
import AdminUserRoleService from "../../../API/Services/AdminService/AdminUserRoleService";
import swal from "sweetalert";

const BulkUserUpdateOffcanvas = forwardRef((props, ref) => {
    const { userSelectedUsers } = props;
    const [Error, setError] = useState("");
    const [BuilderCode, setBuilderCode] = useState("");
    const [BuilderList, setBuilderList] = useState([]);
    const [RoleCode, setRoleCode] = useState("");
    const [RoleList, setRoleList] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    console.log(selectedUsers);
    const [addUser, setAddUser] = useState(false);
    const params = useParams();
    const navigate = useNavigate();

    const getuserlist = async (id) => {
        try {
            let responseData1 = await AdminUserRoleService.show(id).json();
            setSelectedUsers(responseData1);
        } catch (error) {
            if (error.name === "HTTPError") {
                const errorJson = await error.response.json();
                setError(errorJson.message);
            }
        }
    };

    useEffect(() => {
        if (localStorage.getItem("usertoken")) {
            getuserlist(params.id);
        } else {
            navigate("/");
        }
    }, []);

    const getrolelist = async () => {
        try {
            let responseData = await AdminUserRoleService.roles().json();
            setRoleList(responseData.data);
        } catch (error) {
            if (error.name === "HTTPError") {
                const errorJson = await error.response.json();
                setError(errorJson.message);
            }
        }
    };

    useEffect(() => {
        getrolelist();
    }, []);

    const getbuilderlist = async () => {
        try {
            const response = await AdminBuilderService.index();
            const responseData = await response.json();
            setBuilderList(responseData.data);
        } catch (error) {
            if (error.name === "HTTPError") {
                const errorJson = await error.response.json();

                setError(errorJson.message);
            }
        }
    };

    useEffect(() => {
        getbuilderlist();
    }, []);

    useImperativeHandle(ref, () => ({
        showEmployeModal() {
            setAddUser(true);
        }
    }));

    const handleBuilderCode = (code) => {
        setBuilderCode(code);
    };

    const handleRoleCode = (code) => {
        setRoleCode(code);
    };

    const handleSubmit = async (event) => {
        debugger
        event.preventDefault();
        try {
            var userData = {
                builder_id: JSON.parse(BuilderCode),
                name: event.target.name.value,
                email: event.target.email.value,
                role_id: JSON.parse(RoleCode),
            };

            const data = await AdminUserRoleService.update(
                userSelectedUsers,
                userData
            ).json();
            if (data.status === true) {
                swal("Product Update Succesfully").then((willDelete) => {
                    if (willDelete) {
                        setAddUser(false);
                        navigate("/userlist");
                        window.location.reload();
                    }
                });
            }
        } catch (error) {
            if (error.name === "HTTPError") {
                const errorJson = await error.response.json();
                setError(
                    errorJson.message.substr(0, errorJson.message.lastIndexOf("."))
                );
            }
        }
    };

    return (
        <>
            <Offcanvas show={addUser} onHide={() => setAddUser(false)} className="offcanvas-end customeoff" placement='end'>
                <div className="offcanvas-header">
                    <h5 className="modal-title" id="#gridSystemModal">{props.Title}</h5>
                    <button type="button" className="btn-close"
                        onClick={() => {setAddUser(false);setRoleCode("");setBuilderCode("");}}
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
                                    <label className="form-label">Role<span className="text-danger">*</span></label>
                                    <Form.Group controlId="tournamentList">
                                        <Form.Select
                                            onChange={(e) => handleRoleCode(e.target.value)}
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
                                            onChange={(e) => handleBuilderCode(e.target.value)}
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
                                <Link to={"#"} onClick={() => {setAddUser(false);setRoleCode("");setBuilderCode("");}} className="btn btn-danger light ms-1">Cancel</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </Offcanvas>
        </>
    );
});

export default BulkUserUpdateOffcanvas;