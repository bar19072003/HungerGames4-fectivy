import React, { useState, useEffect, useContext } from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, updateUserProfile } from '../services/profileService';
import '../WoltTheme.css';
import './LoginPage.css'; // Reusing standard core styles
import './ProfilePage.css'; // Specific styles for profile view/edit

/**
 * ProfilePage Component.
 * Allows users to view and update their profile details (name, phone, coordinates, and avatar).
 * Employs a state machine (View/Edit modes), form validation, and dirty checking before submission.
 */
const ProfilePage = () => {
    const { currentUser, updateUserSession } = useContext(AuthContext);
    const navigate = useNavigate();

    // UI and Form States
    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [validated, setValidated] = useState(false);

    // Form inputs and original data for dirty checking
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        addressX: '',
        addressY: ''
    });
    const [originalData, setOriginalData] = useState({
        name: '',
        phone: '',
        addressX: '',
        addressY: '',
        picture: ''
    });

    // Profile picture states (physical File object and preview URL/Base64 string)
    const [newPictureFile, setNewPictureFile] = useState(null);
    const [picturePreview, setPicturePreview] = useState('');

    // Redirect to login if user is not authenticated
    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
        }
    }, [currentUser, navigate]);

    // Fetch initial user data from the profile service
    useEffect(() => {
        const fetchUserData = async () => {
            if (!currentUser) return;
            try {
                const userData = await getUserProfile(currentUser.id, currentUser.token);
                
                const profileInfo = {
                    name: userData.name || '',
                    phone: userData.phone || '',
                    addressX: userData.addressX !== undefined ? userData.addressX.toString() : '',
                    addressY: userData.addressY !== undefined ? userData.addressY.toString() : '',
                    picture: userData.picture || ''
                };

                setFormData({
                    name: profileInfo.name,
                    phone: profileInfo.phone,
                    addressX: profileInfo.addressX,
                    addressY: profileInfo.addressY
                });

                setOriginalData(profileInfo);
                setPicturePreview(profileInfo.picture);
                setLoading(false);
            } catch (err) {
                setError(err.message || 'Error loading profile details.');
                setLoading(false);
            }
        };

        fetchUserData();
    }, [currentUser]);

    /**
     * Converts a File object to a Base64 string.
     * @param {File} file - The file to convert.
     * @returns {Promise<string>} The Base64 encoded string.
     */
    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (err) => reject(err);
        });
    };

    /**
     * Handles file selection for profile picture.
     */
    const handlePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewPictureFile(file);
            setPicturePreview(URL.createObjectURL(file));
        }
    };

    /**
     * Toggles the page into Edit Mode.
     */
    const handleEditToggle = () => {
        setIsEditMode(true);
        setError('');
        setSuccess('');
    };

    /**
     * Cancels edit mode and resets the form inputs to the original values.
     */
    const handleCancel = () => {
        setFormData({
            name: originalData.name,
            phone: originalData.phone,
            addressX: originalData.addressX,
            addressY: originalData.addressY
        });
        setPicturePreview(originalData.picture);
        setNewPictureFile(null);
        setIsEditMode(false);
        setValidated(false);
        setError('');
        setSuccess('');
    };

    /**
     * Validates if the phone number consists only of digits.
     */
    const isPhoneValid = (phoneNum) => {
        const phoneRegex = /^[0-9]+$/;
        return phoneRegex.test(phoneNum);
    };

    /**
     * Saves user profile changes using dirty checking.
     */
    const handleSave = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const form = e.currentTarget;
        setValidated(true);

        // Basic HTML5 validation checks
        if (form.checkValidity() === false) {
            e.stopPropagation();
            return;
        }

        // Custom Validation: Phone must contain only digits
        if (!isPhoneValid(formData.phone)) {
            setError('Phone number must contain only digits.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        try {
            // Build the partial update payload using dirty checking
            const payload = {};

            if (formData.name !== originalData.name) {
                payload.name = formData.name;
            }

            if (formData.phone !== originalData.phone) {
                payload.phone = formData.phone;
            }

            const parsedX = parseFloat(formData.addressX);
            const originalX = parseFloat(originalData.addressX);
            if (parsedX !== originalX) {
                payload.addressX = parsedX;
            }

            const parsedY = parseFloat(formData.addressY);
            const originalY = parseFloat(originalData.addressY);
            if (parsedY !== originalY) {
                payload.addressY = parsedY;
            }

            // Convert and add new profile picture if modified
            if (newPictureFile) {
                const base64Picture = await convertFileToBase64(newPictureFile);
                if (base64Picture !== originalData.picture) {
                    payload.picture = base64Picture;
                }
            }

            // If no fields were modified, simply revert to view mode
            if (Object.keys(payload).length === 0) {
                setIsEditMode(false);
                setValidated(false);
                setSuccess('No changes detected.');
                return;
            }

            // Execute update via profile service
            const updatedUser = await updateUserProfile(payload, currentUser.token);

            // Sync original data
            const updatedProfileInfo = {
                name: updatedUser.name || '',
                phone: updatedUser.phone || '',
                addressX: updatedUser.addressX !== undefined ? updatedUser.addressX.toString() : '',
                addressY: updatedUser.addressY !== undefined ? updatedUser.addressY.toString() : '',
                picture: updatedUser.picture || ''
            };

            setOriginalData(updatedProfileInfo);
            setFormData({
                name: updatedProfileInfo.name,
                phone: updatedProfileInfo.phone,
                addressX: updatedProfileInfo.addressX,
                addressY: updatedProfileInfo.addressY
            });
            setPicturePreview(updatedProfileInfo.picture);
            setNewPictureFile(null);

            // Update global AuthContext state & localStorage
            updateUserSession({
                name: updatedProfileInfo.name,
                picture: updatedProfileInfo.picture
            });

            setIsEditMode(false);
            setValidated(false);
            setSuccess('Profile updated successfully!');
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (err) {
            setError(err.message || 'Error occurred while updating profile.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (loading) {
        return (
            <div className="text-white text-center mt-5 pt-5">
                <h4>Loading user details...</h4>
            </div>
        );
    }

    return (
        <Container className="d-flex flex-column justify-content-center align-items-center mt-5 pt-5">
            <h1 className="text-white text-center mb-4 fw-bold">HungerGames</h1>
            <h3 className="text-white text-center mb-4 fw-bold">
                User Details: {originalData.name}
            </h3>

            <div className="profile-form-width">
                {error && <Alert variant="danger" className="text-center">{error}</Alert>}
                {success && <Alert variant="success" className="text-center">{success}</Alert>}

                <Form noValidate validated={validated} onSubmit={handleSave}>
                    
                    {/* Profile Picture Avatar View/Edit */}
                    <Form.Group className="mb-4 text-center" controlId="formPicture">
                        <Form.Label className="text-white d-block mb-3">Profile Picture</Form.Label>
                        
                        <label 
                            htmlFor={isEditMode ? "formPictureInput" : undefined} 
                            className={`profile-avatar-label ${isEditMode ? 'editable' : 'readonly'}`}
                        >
                            {picturePreview ? (
                                <img 
                                    src={picturePreview} 
                                    alt="Profile Avatar" 
                                    className="profile-avatar-image"
                                />
                            ) : (
                                <div className="profile-avatar-placeholder">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="profile-default-icon">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                    </svg>
                                </div>
                            )}

                            {/* Render small pencil icon overlay button ONLY in Edit Mode */}
                            {isEditMode && (
                                <div className="profile-edit-badge">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="pencil-svg-icon">
                                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                                    </svg>
                                </div>
                            )}
                        </label>

                        {/* Hidden File Input */}
                        <Form.Control 
                            id="formPictureInput"
                            type="file" 
                            accept="image/*"
                            className="d-none" 
                            onChange={handlePictureChange} 
                            disabled={!isEditMode}
                        />
                    </Form.Group>

                    {/* Name Input */}
                    <Form.Group className="mb-3" controlId="formName">
                        <Form.Label className="text-white">Full Name</Form.Label>
                        <Form.Control 
                            type="text"
                            className="login-dark-input" 
                            value={formData.name} 
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                            disabled={!isEditMode}
                            required 
                        />
                        <Form.Control.Feedback type="invalid">Full Name is required</Form.Control.Feedback>
                    </Form.Group>

                    {/* Phone Input */}
                    <Form.Group className="mb-3" controlId="formPhone">
                        <Form.Label className="text-white">Phone</Form.Label>
                        <Form.Control 
                            type="tel"
                            className="login-dark-input" 
                            value={formData.phone} 
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                            disabled={!isEditMode}
                            required 
                        />
                        <Form.Control.Feedback type="invalid">Phone is required</Form.Control.Feedback>
                    </Form.Group>

                    {/* Coordinate Inputs (X/Y Side-by-Side) */}
                    <Row className="mb-4">
                        <Col md={6}>
                            <Form.Group controlId="formAddressX">
                                <Form.Label className="text-white">Address X</Form.Label>
                                <Form.Control 
                                    type="number"
                                    step="any"
                                    className="login-dark-input" 
                                    value={formData.addressX} 
                                    onChange={(e) => setFormData({ ...formData, addressX: e.target.value })} 
                                    disabled={!isEditMode}
                                    required 
                                />
                                <Form.Control.Feedback type="invalid">Address X is required</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="formAddressY">
                                <Form.Label className="text-white">Address Y</Form.Label>
                                <Form.Control 
                                    type="number"
                                    step="any"
                                    className="login-dark-input" 
                                    value={formData.addressY} 
                                    onChange={(e) => setFormData({ ...formData, addressY: e.target.value })} 
                                    disabled={!isEditMode}
                                    required 
                                />
                                <Form.Control.Feedback type="invalid">Address Y is required</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Action Buttons depending on Mode */}
                    {!isEditMode ? (
                        <Button 
                            type="button" 
                            className="w-100 primary-btn rounded-pill mt-2 mb-5"
                            onClick={handleEditToggle}
                        >
                            Edit Profile
                        </Button>
                    ) : (
                        <div className="d-flex gap-3 mb-5 mt-2">
                            <Button 
                                type="submit" 
                                className="w-100 primary-btn rounded-pill"
                            >
                                Save Changes
                            </Button>
                            <Button 
                                type="button" 
                                className="w-100 cancel-btn rounded-pill"
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                        </div>
                    )}
                </Form>
            </div>
        </Container>
    );
};

export default ProfilePage;
