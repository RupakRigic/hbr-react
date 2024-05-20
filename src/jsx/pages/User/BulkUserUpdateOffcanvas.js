import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Offcanvas, Form } from 'react-bootstrap';
import AdminBuilderService from "../../../API/Services/AdminService/AdminBuilderService";
import AdminUserRoleService from "../../../API/Services/AdminService/AdminUserRoleService";
import swal from "sweetalert";
import Select from "react-select";

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
    const [UserList, SetUserList] = useState([]);

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
        event.preventDefault();
        try {
            var userData = {
                builder_id: BuilderCode.id,
                name: event.target.name.value,
                email: event.target.email.value,
                role_id: RoleCode.id,
              };

            const data = await AdminUserRoleService.bulkupdate(
                userSelectedUsers,
                userData
            ).json();
            if (data.status === true) {
                swal("User Update Succesfully").then((willDelete) => {
                    if (willDelete) {
                        setAddUser(false);
                        navigate("/userlist");
                    }
                });
                props.parentCallback();
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
                        <label
                          htmlFor="exampleFormControlInput3"
                          className="form-label"
                        >
                          {" "}
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          defaultValue={UserList.name}
                          className="form-control"
                          id="exampleFormControlInput3"
                          placeholder=""
                        />
                      </div>
                      <div className="col-xl-6 mb-3">
                        <label
                          htmlFor="exampleFormControlInput4"
                          className="form-label"
                        >
                          Email <span className="text-danger"></span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          defaultValue={UserList.email}
                          className="form-control"
                          id="exampleFormControlInput4"
                          placeholder=""
                        />
                      </div>

                      <div className="col-xl-6 mb-3">
                        <label className="form-label">
                          Role
                        </label>
                        <Form.Group controlId="tournamentList">
                        <Select
                            options={RoleList}
                            onChange={handleRoleCode}
                            getOptionValue={(option) => option.name}
                            getOptionLabel={(option) => option.name}
                            value={RoleCode}
                          ></Select>
                        </Form.Group>
                      </div>
                      <div className="col-xl-6 mb-3">
                        <label className="form-label">
                          Builder
                        </label>
                        <Form.Group controlId="tournamentList">
                          <Select
                            options={BuilderList}
                            onChange={handleBuilderCode}
                            getOptionValue={(option) => option.name}
                            getOptionLabel={(option) => option.name}
                            value={BuilderCode}
                          ></Select>
                        </Form.Group>
                      </div>
                      <p className="text-danger fs-12">{Error}</p>
                    </div>
                    <div>
                      <button type="submit" className="btn btn-primary me-1">
                        Submit
                      </button>
                      <Link to={"/userlist"} className="btn btn-danger light ms-1">
                        Cancel
                      </Link>
                    </div>
                  </form>
                    </div>
                </div>
            </Offcanvas>
        </>
    );
});

export default BulkUserUpdateOffcanvas;