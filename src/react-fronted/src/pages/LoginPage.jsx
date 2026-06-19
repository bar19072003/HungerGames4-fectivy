import React, { useState } from 'react';
import { login as loginApi } from '../services/authService';
import { useLocation , useNavigate } from 'react-router-dom';

// Import the ready-made components from react-bootstrap
import { Form, Button, Container, Alert, Card } from 'react-bootstrap';
import '../WoltTheme.css'; // Import the global Wolt theme
import './LoginPage.css';

/**
 * Login Page Component.
 * Styled beautifully with React-Bootstrap.
 */
const LoginPage = () => {
    //Set states for the form inputs, error message, and validation status
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [validated, setValidated] = useState(false);


   //React Router's navigation hook to programmatically navigate to different routes.
   const navigate = useNavigate();
   const location = useLocation();

   const targetPath = location.state?.from || '/homePage'; // Default to home page if no specific target path is provided

    /**
     * Handles the form submission event.
     * @param {Event} e - The default form submission event.
     */
    const handleLogin = async (e) => {
        // Prevent the default form submission behavior (page reload)
        e.preventDefault(); 
        
        const form = e.currentTarget;
        // Check if the user has filled both fields. If not, show validation errors.
        if (form.checkValidity() === false) {
            e.stopPropagation(); 
            setValidated(true);  
            return; 
        }

        setError(''); 
        

        try {
            const data = await loginApi(username, password);
            localStorage.setItem('jwt_token', data.authorization);
            console.log("Login successful!");
            navigate(targetPath, { replace: true }); // Navigate to the target path after successful login
        } catch (err) {
            setError("password or username is incorrect, please try again.");
        }
    };
    return (
        // The main wrapper now handles the background color directly
        <div className="page-wrapper-loginAndRegister">
            <Container className="d-flex flex-column justify-content-center align-items-center login-form-width">
                
                {/* Main Title matching the Wolt design */}
                <h1 className="text-white text-center mb-4 fw-bold">Wolt</h1>
                <h4 className="text-white text-center mb-4 fw-bold">Login to your wolt account</h4>
                
                {error && <Alert variant="danger" className="w-100 text-center ">
                    {error}
                    </Alert>
                    }
                
                <Form noValidate validated={validated} onSubmit={handleLogin} className="w-100 login-form-width">
                    
                    {/* Username Input */}
                    <Form.Group className="mb-4" controlId="formUsername">
                        {/* Label is styled to be white and right-aligned if needed */}
                        <Form.Label className="text-white">Username</Form.Label>
                        <Form.Control 
                            type="text" 
                            className="login-dark-input"
                            placeholder="Enter username" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                        />
                        <Form.Control.Feedback type="invalid">
                            please enter a user name
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Password Input */}
                    <Form.Group className="mb-4" controlId="formPassword">
                        <Form.Label className="text-white">Password</Form.Label>
                        <Form.Control 
                            type="password" 
                            className="login-dark-input"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                        <Form.Control.Feedback type="invalid">
                            please enter a password
                        </Form.Control.Feedback>
                    </Form.Group>
                    
                    <Button type="submit" className="w-100 primary-btn">
                       Login
                    </Button>

                    <Button type="button" className="w-100 mt-3 secondary-btn"
                    onClick={() => navigate('/register', { state: { from: targetPath } })}>
                       Create Account
                    </Button>
                </Form>
            </Container>
        </div>
    );
};

export default LoginPage;