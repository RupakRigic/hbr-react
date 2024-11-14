import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import swal from "sweetalert";
import AdminUserService from '../../API/Services/AdminService/AdminUserService';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function ChangePasswordModal({ show, handleClose }) {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChangePassword = async () => {
        try {
            var userData = {
                new_password: newPassword,
                new_password_confirmation: confirmPassword
            };
            const data = await AdminUserService.change_password(userData).json();
            if (data.status === true) {
                swal(data.message).then((willDelete) => {
                    if (willDelete) {
                        handleClose();
                    }
                });
            }
        } catch (error) {
            if (error.name === "HTTPError") {
                const errorJson = await error.response.json();
                swal(errorJson.message).then((willDelete) => {
                    if (willDelete) {
                        handleClose();
                    }
                });
            }
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Change Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="newPassword">
                        <Form.Label>New Password</Form.Label>
                        <div className="input-group">
                            <Form.Control
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <Button
                                variant="btn btn-outline-light"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? <FaEye /> : <FaEyeSlash />}
                            </Button>
                        </div>
                    </Form.Group>

                    <Form.Group controlId="confirmPassword" style={{marginTop: "10px"}}>
                        <Form.Label>Confirm New Password</Form.Label>
                        <div className="input-group">
                            <Form.Control
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <Button
                                variant="btn btn-outline-light"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                            </Button>
                        </div>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                <Button variant="primary" onClick={handleChangePassword}>Save Changes</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ChangePasswordModal;