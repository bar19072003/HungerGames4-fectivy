import React, { useState } from 'react';
import { useLocation , useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert, OverlayTrigger, Popover, Row, Col } from 'react-bootstrap';
import { registerUser } from '../services/createUserService';
import '../WoltTheme.css';
import './LoginPage.css'; // Reusing the same core styles
import './RegisterPage.css'; // Specific tweaks for register

/**
 * Registration Page Component.
 * Handles user sign-up with strict password and form validations.
 */
const RegisterPage = () => {
    const navigate = useNavigate();
    const location = useLocation();


    // Form states
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [addressX, setAddressX] = useState('');
    const [addressY, setAddressY] = useState('');
    const [role, setRole] = useState('user');
    const [picture, setPicture] = useState(null);

    // UI and Validation states
    const [error, setError] = useState('');
    const [validated, setValidated] = useState(false);


    /**
     * Validates if the password meets the complexity requirements.
     * @param {string} pass - The password to check.
     * @returns {boolean} True if valid, false otherwise.
     */
    const isPasswordComplex = (pass) => {
        // Regex: At least 8 chars, contains at least one letter and one number
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return passwordRegex.test(pass);
    };

    const isPhoneValid = (phone) => {
        // Simple regex to check if phone contains only digits (you can enhance this as needed)
        const phoneRegex = /^[0-9]+$/;
        return phoneRegex.test(phone);
    };


    /**
     * Handles the form submission event.
     * @param {Event} e - The DOM event triggered by the form.
     */
    const handleRegister = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        setValidated(true);

        // 1. Basic HTML5 validation check (empty fields)
        if (form.checkValidity() === false) {
            e.stopPropagation();
            return;
        }

        // 2. Custom Validation: Password Complexity
        if (!isPasswordComplex(password)) {
            setError('Password must be at least 8 characters long and contain both letters and numbers.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // 3. Custom Validation: Passwords Match
        if (password !== verifyPassword) {
            setError('Passwords do not match.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        if(!isPhoneValid(phone)) {
            setError('Phone number must contain only digits.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // 4. Custom Validation: Picture uploaded
        if (!picture) {
            setError('Please select a profile picture.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setError('');

        try {
            // Build the user data object
            const userData = { username, password, name, phone, addressX, addressY, role };
            
            // Call the service
            await registerUser(userData, picture);
            
            console.log("Registration successful!");
            // Redirect to login page upon successful registration and forward state
            navigate('/login', { state: location.state });
        } catch (err) {
            // Displays server errors (like duplicate username) to the user
            setError(err.message);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    /**
     * Popover component to display password requirements elegantly.
     * Styled to match the dark theme of the application.
     */
    const passwordRequirementsPopover = (
        <Popover id="popover-password-requirements">
            <Popover.Header as="h6" className="bg-dark text-warning border-secondary mb-0">
                Password must include:
            </Popover.Header>
            <Popover.Body className="bg-dark text-white">
                <ul className="list-unstyled mb-0 small">
                    <li>• At least 8 characters</li>
                    <li>• One uppercase letter</li>
                    <li>• One lowercase letter</li>
                    <li>• One number</li>
                </ul>
            </Popover.Body>
        </Popover>
    );

    return (
        <Container className="d-flex flex-column justify-content-center align-items-center ">
            
            <h1 className="text-white text-center mb-4 fw-bold mt-4">HungerGames</h1>
            
            <div className="register-header-container">
                <button 
                    type="button" 
                    className="back-to-login-btn position-absolute start-0"
                    onClick={() => navigate('/login', { state: location.state })}
                    aria-label="Back to login"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <h3 className="text-white text-center mb-0 fw-bold">Register To HungerGames!</h3>
            </div>
            
            <div className="register-form-width">
                {error && <Alert variant="danger" className="text-center">{error}</Alert>}
                
                <Form noValidate validated={validated} onSubmit={handleRegister}>
                    

                    <Form.Group className="mb-3" controlId="formUsername">
                        <Form.Label className="text-white">Username</Form.Label>
                        <Form.Control 
                                    type="text"
                                    className="login-dark-input" 
                                    value={username} onChange={(e) => setUsername(e.target.value)} 
                                    required />
                        <Form.Control.Feedback type="invalid">Username is required</Form.Control.Feedback>
                    </Form.Group>


                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label className="text-white">Password</Form.Label>
                        <OverlayTrigger
                            trigger="focus"
                            placement="right" 
                            overlay={passwordRequirementsPopover}
                            >
                            <Form.Control 
                                type="password"
                                className="login-dark-input" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required />
                        </OverlayTrigger>
                        <Form.Control.Feedback type="invalid">Password is required</Form.Control.Feedback>
                       
                    </Form.Group>
                    
                    


                    <Form.Group className="mb-3" controlId="formVerifyPassword">
                        <Form.Label className="text-white">Verify Password</Form.Label>
                        <Form.Control 
                                    type="password"
                                    className="login-dark-input" 
                                    value={verifyPassword} onChange={(e) => setVerifyPassword(e.target.value)} 
                                    required />
                        <Form.Control.Feedback type="invalid">Passwords do not match</Form.Control.Feedback>
                    </Form.Group>


                    <Form.Group className="mb-3" controlId="formName">
                        <Form.Label className="text-white">Full Name</Form.Label>
                        <Form.Control 
                                    type="text"
                                    className="login-dark-input" 
                                    value={name} onChange={(e) => setName(e.target.value)} 
                                    required />
                        <Form.Control.Feedback type="invalid">Full Name is required</Form.Control.Feedback>
                    </Form.Group>


                    <Form.Group className="mb-3" controlId="formPhone">
                        <Form.Label className="text-white">Phone</Form.Label>
                        <Form.Control 
                                    type="tel"
                                    className="login-dark-input" 
                                    value={phone} onChange={(e) => setPhone(e.target.value)} 
                                    required />
                        <Form.Control.Feedback type="invalid">Phone is required</Form.Control.Feedback>
                    </Form.Group>


                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="formAddressX">
                                <Form.Label className="text-white">Address X</Form.Label>
                                <Form.Control 
                                            type="number"
                                            step="any"
                                            className="login-dark-input" 
                                            value={addressX} onChange={(e) => setAddressX(e.target.value)} 
                                            required />
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
                                            value={addressY} onChange={(e) => setAddressY(e.target.value)} 
                                            required />
                                <Form.Control.Feedback type="invalid">Address Y is required</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3" controlId="formRole">
                        <Form.Label className="text-white">Account Type</Form.Label>
                        <Form.Select 
                            className="login-dark-input text-white" 
                            style={{ backgroundColor: '#1e1e1e', borderColor: '#333' }}
                            value={role} 
                            onChange={(e) => setRole(e.target.value)} 
                            required>
                            <option value="user">Regular User</option>
                            <option value="restaurant_owner">Restaurant Owner</option>
                        </Form.Select>
                    </Form.Group>


                   {/* Profile Picture Avatar Upload */}
                    <Form.Group className="mb-4 text-center" controlId="formPicture">
                        <Form.Label className="text-white d-block mb-3">Profile Picture</Form.Label>
                        
                        {/* The label acts as the clickable avatar. Linked to the input via htmlFor */}
                        <label htmlFor="formPictureInput" className="avatar-upload-label">
                            {picture ? (
                                // Render the selected image
                                <img 
                                    src={URL.createObjectURL(picture)} 
                                    alt="Profile Preview" 
                                    className="avatar-image"
                                />
                            ) : (
                                // Render the default placeholder with an upload badge
                                <div className="avatar-placeholder">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="default-user-icon">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                    </svg>
                                    <div className="upload-badge">+</div>
                                </div>
                            )}
                        </label>

                        {/* The actual file input is hidden using Bootstrap's d-none class */}
                        <Form.Control 
                            id="formPictureInput"
                            type="file" 
                            accept="image/*"
                            className="d-none" 
                            onChange={(e) => setPicture(e.target.files[0])} 
                            required 
                        />
                        
                        {/* Manual validation feedback since the input itself is hidden */}
                        {!picture && validated && (
                            <div className="text-danger mt-2 small">Please select an image</div>
                        )}
                    </Form.Group>
                    
                    <Button type="submit" className="w-100 primary-btn rounded-pill mt-2 mb-4">
                        Create User
                    </Button>
                </Form>
            </div>
        </Container>
    );
};

export default RegisterPage;