import React, { Fragment, useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import AdminUserRoleService from "../../../API/Services/AdminService/AdminUserRoleService";
import swal from "sweetalert";
import { MultiSelect } from 'react-multi-select-component';
import ClipLoader from "react-spinners/ClipLoader";
import Modal from "react-bootstrap/Modal";
import { Button } from 'react-bootstrap';

const UserUpdate = () => {
  const [Error, setError] = useState("");
  const [BuilderCode, setBuilderCode] = useState("");
  const [RoleCode, setRoleCode] = useState([]);
  const [standardRoleCode, setStandardRoleCode] = useState([]);
  const [RoleList, setRoleList] = useState([]);
  const [subRoleList, setSubRoleList] = useState([]);
  const [UserList, SetUserList] = useState([]);
  const [StandardUser, setStandardUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const handlePopupClose = () => setShowPopup(false);
  const [showPopup, setShowPopup] = useState(false);
  const [saveBtn, setSaveBtn] = useState(false);
  const [message, setMessage] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [company, setCompany] = useState("");

  useEffect(() => {
    GetRoleList();
  }, []);

  useEffect(() => {
    if (localStorage.getItem("usertoken")) {
      GetUserList(params.id);
    } else {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (UserList.id) {
      setFirstName(UserList.name);
      setLastName(UserList.last_name);
      setEmail(UserList.email);
      setNotes(UserList.notes);
      setCompany(UserList.company);
    }
  }, [UserList]);

  const GetUserList = async (id) => {
    setIsLoading(true);
    try {
      let responseData1 = await AdminUserRoleService.show(id).json();
      setIsLoading(false);
      SetUserList(responseData1);
      setBuilderCode(responseData1.builder_id);

      let roleIds = responseData1.roles.map(role => role.id);

      if (roleIds.includes(10) || roleIds.includes(11)) {
        const StandardUserOptions = responseData1.roles.map(role => ({
          value: role.id,
          label: role.name
        }));
        setRoleCode(9);
        setStandardRoleCode(responseData1.roles.map(role => role.id));
        setStandardUser(StandardUserOptions);
      } else {
        setRoleCode(responseData1.roles[0].id);
      }
    } catch (error) {
      setIsLoading(false);
      if (error.name === "HTTPError") {
        const errorJson = await error.response.json();
        setError(errorJson.message);
      }
    }
  };

  const GetRoleList = async () => {
    try {
      let responseData = await AdminUserRoleService.roles().json();
      setRoleList(responseData.main_role);
      setSubRoleList(responseData.sub_role);
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

  const StandardUserOptions = subRoleList.map(element => ({
    value: element.id,
    label: element.name
  }));

  const handleRoleCode = (code) => {
    const formattedRoles = [{
      value: code.value,
      label: code.label
    }];
    const selectedValues = formattedRoles.map(item => item.value);
    setRoleCode(selectedValues);
  };

  const handleStandardUser = (code) => {
    const selectedValues = code.map(item => item.value);
    setStandardRoleCode(selectedValues);
    setStandardUser(code);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const FilterRoleCode = RoleCode == 9 && standardRoleCode.filter((id) => id === 11);
      if (FilterRoleCode == 11) {
        var userData = {
          "name": firstName,
          "company": company,
          "last_name": lastName,
        }
        const data = await AdminUserRoleService.checkBuilderForCompany(userData).json();
        if (data.status === true) {
          setBuilderCode(data.builder_id);
          setMessage(data.message);
          setSaveBtn(true);
          setShowPopup(true);
        } else {
          setMessage(data.message);
          setShowPopup(true);
        }
      } else {
        var userData = {
          "role_id": RoleCode == 9 ? standardRoleCode : RoleCode,
          "name": firstName,
          "last_name": lastName,
          "email": email,
          "notes": notes,
          "company": company
        }
        const data = await AdminUserRoleService.update(params.id, userData).json();
        if (data.status === true) {
          swal("User Update Succesfully").then((willDelete) => {
            if (willDelete) {
              setRoleCode([]);
              setStandardUser([]);
              navigate("/userlist");
            }
          })
        }
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

  const handlePopupSave = async (event) => {
    event.preventDefault();
    try {
      var userData = {
        "builder_id": BuilderCode,
        "role_id": RoleCode == 9 ? standardRoleCode : RoleCode,
        "name": firstName,
        "last_name": lastName,
        "email": email,
        "notes": notes,
        "company": company
      }
      const data = await AdminUserRoleService.update(params.id, userData).json();
      if (data.status === true) {
        setShowPopup(false);
        setSaveBtn(false);
        setRoleCode([]);
        setStandardUser([]);
        swal("User Update Succesfully").then((willDelete) => {
          if (willDelete) {
            navigate("/userlist");
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

  const HandlePopupDetailClick = (e) => {
    setShowPopup(true);
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
              {isLoading ? (
                <div className="d-flex justify-content-center align-items-center mb-5" style={{ marginTop: "20%" }}>
                  <ClipLoader color="#4474fc" />
                </div>
              ) : (
                <div className="card-body">
                  <div className="form-validation">
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-xl-6 mb-3">
                          <label htmlFor="exampleFormControlInput2" className="form-label">First Name <span className="text-danger">*</span></label>
                          <input
                            type="text"
                            name="firstname"
                            defaultValue={firstName}
                            className="form-control"
                            id="exampleFormControlInput2"
                            placeholder=""
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                        </div>

                        <div className="col-xl-6 mb-3">
                          <label htmlFor="exampleFormControlInput3" className="form-label">Last Name <span className="text-danger">*</span></label>
                          <input
                            type="text"
                            name="lastname"
                            defaultValue={lastName}
                            className="form-control"
                            id="exampleFormControlInput3"
                            placeholder=""
                            onChange={(e) => setLastName(e.target.value)}
                          />
                        </div>

                        <div className="col-xl-6 mb-3">
                          <label htmlFor="exampleFormControlInput4" className="form-label">Email <span className="text-danger">*</span></label>
                          <input
                            type="email"
                            name="email"
                            defaultValue={email}
                            className="form-control"
                            id="exampleFormControlInput4"
                            placeholder=""
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>

                        <div className="col-xl-6 mb-3">
                          <label htmlFor="exampleFormControlInput5" className="form-label">Notes</label>
                          <input
                            type="text"
                            name="notes"
                            defaultValue={notes}
                            className="form-control"
                            id="exampleFormControlInput5"
                            placeholder=""
                            onChange={(e) => setNotes(e.target.value)}
                          />
                        </div>

                        <div className="col-xl-6 mb-3">
                          <label htmlFor="exampleFormControlInput6" className="form-label">Company <span className="text-danger">*</span></label>
                          <input
                            type="text"
                            name="company"
                            defaultValue={company}
                            className="form-control"
                            id="exampleFormControlInput6"
                            placeholder=""
                            onChange={(e) => setCompany(e.target.value)}
                          />
                        </div>

                        <div className="col-xl-6 mb-3">
                          <label className="form-label">Role</label>
                          <Select
                            options={roleOptions}
                            value={roleOptions.find(option => option.value === RoleCode)}
                            // value={RoleCode}
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

                        {RoleCode == 9 && <div className="col-xl-6 mb-3">
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
                </div>)}
            </div>
          </div>
        </div>
      </div>

      {/* Popup */}
      <Modal show={showPopup} onHide={HandlePopupDetailClick}>
        <Modal.Header handlePopupClose>
          <Modal.Title>Confirmation</Modal.Title>
          <button
            className="btn-close"
            aria-label="Close"
            onClick={() => handlePopupClose()}
          ></button>
        </Modal.Header>
        <Modal.Body style={{ color: "black" }}>
          {message}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handlePopupClose}>
            Close
          </Button>
          {saveBtn && <Button variant="primary" onClick={(e) => handlePopupSave(e)}>
            Okay
          </Button>}
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default UserUpdate;
