import React, { useState, forwardRef, useImperativeHandle, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Offcanvas } from 'react-bootstrap';
import AdminUserRoleService from "../../../API/Services/AdminService/AdminUserRoleService";
import swal from "sweetalert";
import Select from "react-select";
import { MultiSelect } from 'react-multi-select-component';
import Modal from "react-bootstrap/Modal";
import { Button } from 'react-bootstrap';

const BulkUserUpdateOffcanvas = forwardRef((props, ref) => {
  const { userSelectedUsers } = props;
  
  const [Error, setError] = useState("");
  const [BuilderCode, setBuilderCode] = useState([]);
  const [RoleCode, setRoleCode] = useState([]);
  const [standardRoleCode, setStandardRoleCode] = useState([]);
  const [RoleList, setRoleList] = useState([]);
  const [subRoleList, setSubRoleList] = useState([]);
  const [StandardUser, setStandardUser] = useState([]);
  const [addUser, setAddUser] = useState(false);
  const handlePopupClose = () => setShowPopup(false);
  const [showPopup, setShowPopup] = useState(false);
  const [saveBtn, setSaveBtn] = useState(false);
  const [message, setMessage] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [companies, setCompanies] = useState(['']);

  useEffect(() => {
    GetRoleList();
  }, []);

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

  useImperativeHandle(ref, () => ({
    showEmployeModal() {
      setAddUser(true);
    }
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
    if (userSelectedUsers.length === 0) {
      setError('No selected records'); return false
    }
    swal({
      title: "Are you sure?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          if (!companies && RoleCode == 9) {
            setShowPopup(true);
            setMessage("Please enter valid company.");
            return;
          }

          const FilterRoleCode = RoleCode.includes(9) ? standardRoleCode.filter((id) => id === 11 || id === 10) : [];

          if (FilterRoleCode.includes(10) || FilterRoleCode.includes(11) || RoleCode.includes(9)) {
            var userData = {
              "name": firstName,
              "company": companies,
              "last_name": lastName,
            }

            const data = await AdminUserRoleService.checkBuilderForCompany(userData).json();

            if (data.status === true) {
              setBuilderCode(data.builder_id);
              setMessage("Selected users are the Data Uploader for " + data.builder_name + ".");
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
              "company": companies
            }

            const data = await AdminUserRoleService.bulkupdate(userSelectedUsers, userData).json();

            if (data.status === true) {
              swal("Records Updated Successfully").then((willDelete) => {
                if (willDelete) {
                  HandleUpdateCanvasClose();
                  setRoleCode();
                  setFirstName("");
                  setLastName("");
                  setEmail("");
                  setNotes("");
                  setStandardUser([]);
                  props.parentCallback();
                }
              });
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
      }
    })
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
        "company": companies
      }
      const data = await AdminUserRoleService.bulkupdate(userSelectedUsers, userData).json();
      if (data.status === true) {
        setShowPopup(false);
        setSaveBtn(false);
        setRoleCode([]);
        setStandardUser([]);
        swal("Records Updated Successfully").then((willDelete) => {
          if (willDelete) {
            HandleUpdateCanvasClose();
            setFirstName("");
            setLastName("");
            setEmail("");
            setNotes("");
            props.parentCallback();
          }
        });
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

  const HandleUpdateCanvasClose = () => {
    setAddUser(false); 
    setError('');
    setRoleCode([]); 
    setBuilderCode("");  
    setStandardUser([]);
    setCompanies(['']);
    setError("");
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
      <Offcanvas show={addUser} onHide={() => HandleUpdateCanvasClose()} className="offcanvas-end customeoff" placement='end'>
        <div className="offcanvas-header">
          <h5 className="modal-title" id="#gridSystemModal">{props.Title}</h5>
          <button type="button" className="btn-close"
            onClick={() => HandleUpdateCanvasClose()}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="offcanvas-body">
          <div className="container-fluid">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-xl-6 mb-3">
                  <label htmlFor="exampleFormControlInput2" className="form-label">First Name</label>
                  <input
                    type="text"
                    name="firstname"
                    className="form-control"
                    id="exampleFormControlInput2"
                    placeholder=""
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div className="col-xl-6 mb-3">
                  <label htmlFor="exampleFormControlInput3" className="form-label">Last Name</label>
                  <input
                    type="text"
                    name="lastname"
                    className="form-control"
                    id="exampleFormControlInput3"
                    placeholder=""
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                <div className="col-xl-6 mb-3">
                  <label htmlFor="exampleFormControlInput4" className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    id="exampleFormControlInput4"
                    placeholder=""
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="col-xl-6 mb-3">
                  <label htmlFor="exampleFormControlInput4" className="form-label">Notes</label>
                  <input
                    type="text"
                    name="notes"
                    className="form-control"
                    id="exampleFormControlInput4"
                    placeholder=""
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                

                <div className="col-xl-6 mb-3">
                  <label className="form-label">Role</label>
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

                {RoleCode == 9 &&
                  <div className="col-xl-6 mb-3">
                    <label className="form-label">Standard User</label>
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
                  </div>
                }

                {/* <div className="col-xl-6 mb-3">
                  <label htmlFor="exampleFormControlInput5" className="form-label">Company</label>
                  <input
                    type="text"
                    name="company"
                    className="form-control"
                    id="exampleFormControlInput5"
                    placeholder=""
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div> */}

                {companies.map((company, index) => (
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
                <Link to={"#"} onClick={() => HandleUpdateCanvasClose()} className="btn btn-danger light ms-1">
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </Offcanvas>

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
});

export default BulkUserUpdateOffcanvas;