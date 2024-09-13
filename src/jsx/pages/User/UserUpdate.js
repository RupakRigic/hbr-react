import React, { Fragment, useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import AdminBuilderService from "../../../API/Services/AdminService/AdminBuilderService";
import AdminUserRoleService from "../../../API/Services/AdminService/AdminUserRoleService";
import swal from "sweetalert";

const UserUpdate = () => {
  const [Error, setError] = useState("");
  const [BuilderCode, setBuilderCode] = useState("");
  const [BuilderList, setBuilderList] = useState([]);
  const [RoleCode, setRoleCode] = useState("");
  const [RoleList, setRoleList] = useState([]);
  const [UserList, SetUserList] = useState([]);
  const params = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    GetRoleList();
    GetBuilderList();
  }, []);

  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      GetUserList(params.id);
    } else {
      navigate("/");
    }
  }, []);

  const GetUserList = async (id) => {
    try {
      let responseData1 = await AdminUserRoleService.show(id).json();
      SetUserList(responseData1);
      setBuilderCode(responseData1.builder_id);
      setRoleCode(responseData1.roles[0].id);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };

  const GetRoleList = async () => {
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

  const GetBuilderList = async () => {
    try {
      const response = await AdminBuilderService.all_builder_list();
      const responseData = await response.json();
      setBuilderList(responseData);
    } catch (error) {
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };

  const roleOptions = RoleList.map(element => ({
    value: element.id,
    label: element.name
  }));

  const options = BuilderList
  .sort((a, b) => a.name.localeCompare(b.name))
  .map(element => ({
    value: element.id,
    label: element.name
  }));

  const handleBuilderCode = (code) => {
    setBuilderCode(code.value);
  };

  const handleRoleCode = (code) => {
    setRoleCode(code.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      var userData = {
        builder_id: BuilderCode,
        name: event.target.name.value,
        email: event.target.email.value,
        role_id: RoleCode,
      };

      const data = await AdminUserRoleService.update(params.id,userData).json();
      if (data.status === true) {
        swal("Product Update Succesfully").then((willDelete) => {
          if (willDelete) {
            navigate("/userlist");
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
    <Fragment>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">Edit User</h4>
              </div>
              <div className="card-body">
                <div className="form-validation">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-xl-6 mb-3">
                        <label htmlFor="exampleFormControlInput3" className="form-label">{" "}Name <span className="text-danger">*</span></label>
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
                        <label htmlFor="exampleFormControlInput4" className="form-label">Email <span className="text-danger"></span></label>
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
                        <label className="form-label">Role<span className="text-danger">*</span></label>
                        <Select
                          options={roleOptions}
                          value={roleOptions.find(option => option.value === RoleCode)}
                          onChange={(selectedOption) => handleRoleCode(selectedOption)}
                          placeholder="Select Role"
                          styles={{
                            container: (provided) => ({
                              ...provided,
                              width: '100%',
                            }),
                            menu: (provided) => ({
                              ...provided,
                              width: '100%',
                            }),
                          }}
                        />
                      </div>

                      <div className="col-xl-6 mb-3">
                        <label className="form-label">Builder<span className="text-danger">*</span></label>
                        <Select
                          options={options}
                          value={options.find(option => option.value === BuilderCode)}
                          onChange={(selectedOption) => handleBuilderCode(selectedOption)}
                          placeholder="Select Builder"
                          styles={{
                            container: (provided) => ({
                              ...provided,
                              width: '100%',
                            }),
                            menu: (provided) => ({
                              ...provided,
                              width: '100%',
                            }),
                          }}
                        />
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
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default UserUpdate;
