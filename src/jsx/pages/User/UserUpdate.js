import React, { Fragment, useState, useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import Select from "react-select";
import AdminUserRoleService from "../../../API/Services/AdminService/AdminUserRoleService";
import swal from "sweetalert";
import { MultiSelect } from 'react-multi-select-component';
import ClipLoader from "react-spinners/ClipLoader";
import Modal from "react-bootstrap/Modal";
import { Button } from 'react-bootstrap';
import { FiRefreshCcw, FiCopy, FiEye, FiEyeOff } from "react-icons/fi";
import MainPagetitle from "../../layouts/MainPagetitle";

const UserUpdate = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const page = queryParams.get("page");

  const [Error, setError] = useState("");
  const [BuilderCode, setBuilderCode] = useState([]);
  const [RoleCode, setRoleCode] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [copyToClipboardbtn, setCopyToClipboardbtn] = useState(false);
  const [companies, setCompanies] = useState(['']);

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
    if (UserList?.roles && RoleList?.length > 0) {
      let roleIds = UserList?.roles?.map(role => role.id);

      if (roleIds.includes(10) || roleIds.includes(11)) {
        const StandardUserOptions = UserList?.roles?.map(role => ({
          value: role.id,
          label: role.name
        }));
        const filter = RoleList?.filter(data => data.id == 9)
        const formattedRoles = [{
          value: filter[0]?.id,
          label: filter[0]?.name
        }];
        handleRoleCode(formattedRoles[0]);
        setStandardRoleCode(UserList?.roles?.map(role => role.id));
        setStandardUser(StandardUserOptions);
      } else if (roleIds.includes(15) || roleIds.includes(16)) {
        const StandardUserOptions = UserList?.roles?.map(role => ({
          value: role.id,
          label: role.name
        }));
        const filter = RoleList?.filter(data => data.id == 14)
        const formattedRoles = [{
          value: filter[0]?.id,
          label: filter[0]?.name
        }];
        handleRoleCode(formattedRoles[0]);
        setStandardRoleCode(UserList?.roles?.map(role => role.id));
        setStandardUser(StandardUserOptions);
      } else {
        const filter = RoleList?.filter(data => data.id == UserList?.roles[0]?.id)
        const formattedRoles = [{
          value: filter[0]?.id,
          label: filter[0]?.name
        }];
        handleRoleCode(formattedRoles[0]);
      }
    }
  }, [UserList, RoleList]);

  useEffect(() => {
    if (UserList?.id) {
      setFirstName(UserList?.name);
      setLastName(UserList?.last_name);
      setEmail(UserList?.email);
      setNotes(UserList?.notes);
      // const companyArray = UserList?.company
      //   ? UserList?.company.split(',').map(c => c.trim())
      //   : [''];
      const companyArray = Array.isArray(UserList.company) ? UserList.company : [];
      setCompanies(companyArray);
    }
  }, [UserList]);

  const GetUserList = async (id) => {
    setIsLoading(true);
    try {
      let responseData1 = await AdminUserRoleService.show(id).json();
      setIsLoading(false);
      SetUserList(responseData1.data);
      setBuilderCode(responseData1.builder_id);
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

  const roleOptions = RoleList?.map(element => ({
    value: element?.id,
    label: element?.name
  }));

  const StandardUserOptions = subRoleList
    ?.filter((data) => data.id != 15 && data.id != 16)
    .map(element => ({
      value: element.id,
      label: element.name
    }));

  const TesterUserOptions = subRoleList
    ?.filter((data) => data.id != 10 && data.id != 11)
    .map(element => ({
      value: element.id,
      label: element.name
    }));

  const handleRoleCode = (code) => {
    const formattedRoles = [{
      value: code?.value,
      label: code?.label
    }];
    const selectedValues = formattedRoles?.map(item => item.value);

    if (!selectedValues.includes(9) || !selectedValues.includes(14)) {
      setStandardRoleCode([]);
    }
    setRoleCode(selectedValues);
  };

  const handleStandardUser = (code) => {
    const selectedValues = code?.map(item => item.value);
    setStandardRoleCode(selectedValues);
    setStandardUser(code);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const FilterRoleCode = RoleCode.includes(9) ? standardRoleCode.filter((id) => id === 11 || id === 10) : RoleCode.includes(14) ? standardRoleCode.filter((id) => id === 15 || id === 16) : [];
      if (FilterRoleCode.includes(10) || FilterRoleCode.includes(11) || FilterRoleCode.includes(15) || FilterRoleCode.includes(16) || RoleCode.includes(9) || RoleCode.includes(14)) {
        var userData = {
          "name": firstName,
          "company": companies,
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
          "role_id": standardRoleCode?.length > 0 ? standardRoleCode : RoleCode,
          "name": firstName,
          "last_name": lastName,
          "email": email,
          "notes": notes,
          "company": companies,
          "password": newPassword
        }
        const data = await AdminUserRoleService.update(params.id, userData).json();
        if (data.status === true) {
          swal("Record Updated Successfully").then((willDelete) => {
            if (willDelete) {
              setRoleCode([]);
              setStandardUser([]);
              navigate(`/userlist?page=${page}`);
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
        "builder_ids": BuilderCode,
        "role_id": standardRoleCode?.length > 0 ? standardRoleCode : RoleCode,
        "name": firstName,
        "last_name": lastName,
        "email": email,
        "notes": notes,
        "company": companies,
        "password": newPassword
      }
      const data = await AdminUserRoleService.update(params.id, userData).json();
      if (data.status === true) {
        setShowPopup(false);
        setSaveBtn(false);
        setRoleCode([]);
        setStandardUser([]);
        swal("Record Updated Successfully").then((willDelete) => {
          if (willDelete) {
            navigate(`/userlist?page=${page}`);
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

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    const passwordLength = 8;
    let password = "";
    for (let i = 0; i < passwordLength; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCopyToClipboardbtn(true);
    return password;
  };

  const copyToClipboard = () => {
    if (newPassword) {
      const textArea = document.createElement("textarea");
      textArea.value = newPassword; // Set the text to copy
      textArea.style.position = "fixed"; // Avoid scrolling to the bottom of the page
      textArea.style.left = "-9999px"; // Move it off-screen
      document.body.appendChild(textArea);

      textArea.focus();
      textArea.select();

      try {
        const successful = document.execCommand("copy"); // Copy the text to clipboard
        if (successful) {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 3000);
        } else {
          console.error("Failed to copy text using execCommand.");
        }
      } catch (err) {
        console.error("Error copying text: ", err);
      } finally {
        document.body.removeChild(textArea); // Remove the temporary textarea
      }
    } else {
      console.error("No text to copy.");
    }
  };

  const handleCompanyChange = (index, value) => {
    const newCompanies = [...companies];
    newCompanies[index] = value;
    setCompanies(newCompanies);
  };

  const addCompanyField = () => {
    setCompanies([...companies, '']);
  };

  const removeCompanyField = (index) => {
    const newCompanies = [...companies];
    newCompanies.splice(index, 1);
    setCompanies(newCompanies);
  };

  const getFieldName = (index) => {
    return index === 0 ? 'company' : `company${index + 1}`;
  };

  return (
    <Fragment>
      <MainPagetitle mainTitle="Edit User" pageTitle="Edit User" parentTitle="Users" link={`/userlist?page=${page}`} />
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
                            value={email}
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

                        <div className="col-xl-6 mb-3 position-relative">
                          <label htmlFor="exampleFormControlInput7" className="form-label">
                            Password
                          </label>
                          <div className="input-group">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              name="password"
                              value={newPassword}
                              className="form-control"
                              id="exampleFormControlInput7"
                              placeholder=""
                              autoComplete="new-password"
                              readOnly
                              onFocus={(e) => e.target.removeAttribute('readOnly')}
                              onChange={(e) => setNewPassword(e.target.value)}
                            />

                            <button
                              className="btn btn-outline-light"
                              type="button"
                              onClick={() => setNewPassword(generatePassword())}
                              style={{ borderColor: "#cccccc" }}
                            >
                              <FiRefreshCcw />
                            </button>
                            {copyToClipboardbtn && <button
                              className="btn btn-outline-light"
                              type="button"
                              onClick={copyToClipboard}
                              style={{ borderColor: "#cccccc" }}
                            >
                              <FiCopy />
                            </button>}
                            <button
                              className="btn btn-outline-light"
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              style={{ borderColor: "#cccccc" }}
                            >
                              {showNewPassword ? <FiEye /> : <FiEyeOff />}
                            </button>
                          </div>
                          {copySuccess && (
                            <div style={{ color: 'green', marginTop: '5px' }}>
                              Password copied to clipboard!
                            </div>
                          )}
                        </div>

                        <div className="col-xl-6 mb-3">
                          <label className="form-label">Role</label>
                          <Select
                            options={roleOptions}
                            value={roleOptions.find(option => option.value === RoleCode[0])}
                            isSearchable={isMenuOpen}
                            onMenuOpen={() => setIsMenuOpen(true)}
                            onMenuClose={() => setIsMenuOpen(false)}
                            inputId="react-select-role"
                            name="react-select-role"
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

                        {(RoleCode == 9 || RoleCode == 14) &&
                          <div className="col-xl-6 mb-3">
                            <label className="form-label">{RoleCode.includes(9) ? "Standard User" : RoleCode.includes(14) ? "Tester User" : ""}</label>
                            <MultiSelect
                              options={RoleCode.includes(9) ? StandardUserOptions : RoleCode.includes(14) ? TesterUserOptions : []}
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
                          </div>
                        }

                        {companies?.map((company, index) => (
                          <>
                            <div className="col-xl-6 mb-3" key={index}>
                              <label htmlFor={getFieldName(index)} className="form-label">
                                {index === 0 ? 'Company' : `Company ${index + 1}`} <span className="text-danger">*</span>
                              </label>

                              <div className="d-flex align-items-start gap-2">
                                <input
                                  type="text"
                                  name={getFieldName(index)}
                                  required
                                  className="form-control"
                                  id={getFieldName(index)}
                                  value={company}
                                  onChange={(e) => handleCompanyChange(index, e.target.value)}
                                />

                                <div className="d-flex flex-column align-items-end">
                                  {companies.length > 1 && (
                                    <button
                                      type="button"
                                      className="btn btn-danger mb-1"
                                      onClick={() => removeCompanyField(index)}
                                    >
                                      Remove
                                    </button>
                                  )}
                                </div>
                              </div>
                              {index === companies.length - 1 && (
                                <div className="mt-3">
                                  <button
                                    type="button"
                                    className="btn btn-link p-0"
                                    style={{ fontSize: '14px' }}
                                    onClick={addCompanyField}
                                  >
                                    + Add Company
                                  </button>
                                </div>
                              )}
                            </div>
                          </>
                        ))}

                        <p className="text-danger fs-12">{Error}</p>
                      </div>
                      <div>
                        <button type="submit" className="btn btn-primary me-1">
                          Submit
                        </button>
                        <Link to={`/userlist?page=${page}`} className="btn btn-danger light ms-1">
                          Cancel
                        </Link>
                      </div>
                    </form>
                  </div>
                </div>
              )}
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
          />
        </Modal.Header>
        <Modal.Body style={{ color: "black" }}>
          {message}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handlePopupClose}>
            Close
          </Button>
          {saveBtn &&
            <Button variant="primary" onClick={(e) => handlePopupSave(e)}>
              Okay
            </Button>
          }
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default UserUpdate;
