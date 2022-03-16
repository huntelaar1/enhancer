import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, FormControlFeedback } from 'react-bootstrap';

import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';

import Auth from '../utils/auth';
import { ifError } from 'assert';

const LoginForm = () => {
    const [userFormData, setUserFormData] = useState({ email: '', password: '' });
    const [validated] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const [login, { error }] = useMutation(LOGIN_USER);

    useEffect(() => {
        if(error) {
            setShowAlert(true);
        } else {
            setShowAlert(false);
        }
    }, [error]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserFormData({ ...userFormData, [name]: value });
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        try {
            const { data } = await login({
                variables: { ...userFormData },
            });

            console.log(data);
            Auth.login(data.login.token);
        } catch (e) {
            console.error(e);
        }

        setUserFormData({
            email: '',
            password: '',
        });
    };

    return (
        <>
            <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
                <Alert
                    dismissible
                    onClose={() => setShowAlert(false)}
                    show={showAlert}
                    variant="danger"
                    >
                        Please double-check that you entered your login credentials correctly!
                    </Alert>
                    <FormGroup>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <FormControl
                            type="text"
                            placeholder="Your email address"
                            name="email"
                            onChange={handleInputChange}
                            value={userFormData.email}
                            required
                            />
                            <FormControlFeedback type="invalid">
                                Please enter an email address!
                            </FormControlFeedback>
                    </FormGroup>

                    <FormGroup>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <FormControl
                            type="password"
                            placeholder="Your password"
                            name="password"
                            onChange={handleInputChange}
                            value={userFormData.password}
                            required
                            />
                            <FormControlFeedback type="invalid">
                                Please enter a password!
                            </FormControlFeedback>
                        </FormGroup>
                        <Button
                            disabled={!(userFormData.email && userFormData.password)}
                            type="submit"
                            variant="success"
                        >
                            Submit
                        </Button>
            </Form>
        </>
    );
};

export default LoginForm;