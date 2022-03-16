import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, FormGroup, FormControl, FormControlFeedback } from 'react-bootstrap';

import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';

import Auth from '../utils/auth';

const SignUpForm = () => {

    const [userFormData, setUserFormData] = useState ({
        username: '',
        email: '',
        password: '',
    });

    const [validated] = useState(false);

    const [showAlert, setShowAlert] = useState (false);

    const [addUser, { error }] = useMutation(ADD_USER);

    useEffect(() => {
        if (error) {
            setShowAlert(true);
        } else {
            setShowAlert(false);
        }
    }, [error]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserFormData({ ...userFormData, [name]: value});
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        try {
            const { data } = await addUser({
                variables: { ...userFormData },
            });
            console.log(data);
            Auth.login(data.addUser.token);
        } catch (err) {
            console.error(err);
        }

        setUserFormData({
            username: '',
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
                    Please Try to sign-up again.
                </Alert>

                <FormGroup>
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <FormControl
                        type="text"
                        placeholder="Your username"
                        name="username"
                        onChange={handleInputChange}
                        value={userFormData.username}
                        required
                    />
                    <FormControlFeedback type="invalid">
                        Please enter your username!
                    </FormControlFeedback>
                </FormGroup>

                <FormGroup>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl
                        type="email"
                        placeholder="Your email address"
                        name="email"
                        onChange={handleInputChange}
                        value={userFormData.email}
                        required
                    />
                    <FormControlFeedback type="invalid">
                        Please enter your email address!
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
                        Please enter your password!
                    </FormControlFeedback>
                </FormGroup>
                <Button
                    disabled={
                        !(
                            userFormData.username &&
                            userFormData.email &&
                            userFormData.password
                        )
                    }
                    type="submit"
                    variant="success"
                    >
                        Submit
                    </Button>
        </Form>
        </>
    );
};

export default SignUpForm;