import React, { useState, forwardRef, useImperativeHandle, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Offcanvas } from 'react-bootstrap';
import AdminUserRoleService from "../../../API/Services/AdminService/AdminUserRoleService";
import swal from "sweetalert";
import Select from 'react-select';
import { MultiSelect } from 'react-multi-select-component';
import Modal from "react-bootstrap/Modal";
import { Button } from 'react-bootstrap';
import { FiRefreshCcw, FiCopy, FiEye, FiEyeOff } from "react-icons/fi";

const UserOffcanvas = forwardRef((props, ref) => {
    const [Error, setError] = useState('');
    const [addUser, setAddUser] = useState(false);
    const [BuilderCode, setBuilderCode] = useState([]);
    const [RoleCode, setRoleCode] = useState([]);
    const [standardRoleCode, setStandardRoleCode] = useState([]);
    const [RoleList, setRoleList] = useState([]);
    const [subRoleList, setSubRoleList] = useState([]);
    const [StandardUser, setStandardUser] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [saveBtn, setSaveBtn] = useState(false);
    const handlePopupClose = () => setShowPopup(false);
    const [message, setMessage] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [notes, setNotes] = useState("");
    const userRole = JSON.parse(localStorage.getItem("user")).role;
    const userId = JSON.parse(localStorage.getItem("user")).localId;
    const [companies, setCompanies] = useState(['']);
    const [newPassword, setNewPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [copyToClipboardbtn, setCopyToClipboardbtn] = useState(false);
    const [userDetail, SetUserDetail] = useState([]);

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

    const GetUserList = async (id) => {
        try {
            let responseData1 = await AdminUserRoleService.show(id).json();
            SetUserDetail(responseData1);
            setBuilderCode(responseData1.builder_id);
        } catch (error) {
            if (error.name === "HTTPError") {
                const errorJson = await error.response.json();
                setError(errorJson.message);
            }
        }
    };

    useEffect(() => {
        GetRoleList();
        if (userRole == 'Account Admin') {
            GetUserList(userId)
            setCompanies(userDetail.company);
        }
    }, []);

    const GetRoleList = async () => {
        try {
            let responseData = await AdminUserRoleService.roles().json()
            setRoleList(responseData.main_role);
            setSubRoleList(responseData.sub_role);
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

        if (!selectedValues.includes(9)) {
            setStandardRoleCode([]);
        }
        setRoleCode(selectedValues);
    };

    const handleStandardUser = (code) => {
        const selectedValues = code.map(item => item.value);
        setStandardRoleCode(selectedValues);
        setStandardUser(code);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (userRole == 'Account Admin') {
            setCompanies(userDetail.company);
        }
        try {
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
                    setMessage(data.message);
                    setSaveBtn(true);
                    setShowPopup(true);
                } else {
                    console.log(data.message);
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
                const data = await AdminUserRoleService.store(userData).json();
                if (data.status === true) {
                    swal("User Created Succesfully").then((willDelete) => {
                        if (willDelete) {
                            setAddUser(false);
                            setRoleCode([]);
                            setStandardUser([]);
                            setCompanies(['']);
                            props.parentCallback();
                        }
                    })
                } else {
                    setError(data.message);
                }
            }
        }
        catch (error) {
            if (error.name === 'HTTPError') {
                const errorJson = await error.response.json();
                console.log(errorJson);
                setError(errorJson.message.substr(0, errorJson.message.lastIndexOf(".")));
            }
        }
    };

    const handlePopupSave = async (event) => {
        event.preventDefault();
        try {
            var userData = {
                "builder_id": BuilderCode,
                "role_id": standardRoleCode?.length > 0 ? standardRoleCode : RoleCode,
                "name": firstName,
                "last_name": lastName,
                "email": email,
                "notes": notes,
                "company": companies,
                "password": newPassword
            }
            const data = await AdminUserRoleService.store(userData).json();
            if (data.status === true) {
                setShowPopup(false);
                setSaveBtn(false);
                setRoleCode([]);
                setStandardUser([]);
                swal("User Created Succesfully").then((willDelete) => {
                    if (willDelete) {
                        setAddUser(false);
                        setCompanies(['']);
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

    const HandlePopupDetailClick = (e) => {
        setShowPopup(true);
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
            <Offcanvas show={addUser} onHide={setAddUser} className="offcanvas-end customeoff" placement='end'>
                <div className="offcanvas-header">
                    <h5 className="modal-title" id="#gridSystemModal">{props.Title}</h5>
                    <button type="button" className="btn-close"
                        onClick={() => { setAddUser(false); setRoleCode(); setStandardUser([]); setCompanies(['']); }}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div className="offcanvas-body">
                    <div className="container-fluid">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput2" className="form-label">First Name <span className="text-danger">*</span></label>
                                    <input type="text" name='firstname' required className="form-control" id="exampleFormControlInput2" placeholder="" onChange={(e) => setFirstName(e.target.value)} />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput3" className="form-label">Last Name <span className="text-danger">*</span></label>
                                    <input type="text" name='lastname' required className="form-control" id="exampleFormControlInput3" placeholder="" onChange={(e) => setLastName(e.target.value)} />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput4" className="form-label">Email <span className="text-danger">*</span></label>
                                    <input type="email" name='email' required className="form-control" id="exampleFormControlInput4" placeholder="" onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div className="col-xl-6 mb-3">
                                    <label htmlFor="exampleFormControlInput5" className="form-label">Password <span className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            name="password"
                                            value={newPassword}
                                            className="form-control"
                                            id="exampleFormControlInput7"
                                            placeholder=""
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
                                    <label htmlFor="exampleFormControlInput6" className="form-label">Notes</label>
                                    <input type="text" name='notes' className="form-control" id="exampleFormControlInput6" placeholder="" onChange={(e) => setNotes(e.target.value)} />
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

                                {RoleCode == 9 && userRole != 'Account Admin' && <div className="col-xl-6 mb-3">
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
                                </div>}

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
                                <p className='text-danger fs-12'>{Error}</p>
                            </div>
                            <div>
                                <button type="submit" className="btn btn-primary me-1">Submit</button>
                                <Link to={"#"} onClick={() => { setAddUser(false); setRoleCode(); setStandardUser([]); setCompanies(['']); }} className="btn btn-danger light ms-1">Cancel</Link>
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

export default UserOffcanvas;