import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, FormControlFeedback } from 'react-bootstrap';

import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';

import Auth from '../utils/auth';
import { ifError } from 'assert';

const LoginForm = () => {
    const [UserData, setUserData] = useState({ email: '', password: '' });
    const [validated] = useState(false);
    const [TriggerAlert, setTriggerAlert] = useState(false);

    const [login, { error }] = useMutation(LOGIN_USER);

    useEffect(() => {
        if (error) {
            setTriggerAlert(true);
        } else {
            setTriggerAlert(false);
        }
    }, [error]);

    const handleNewInput = (event) => {
        const { name, value } = event.target;
        setUserData({ ...UserData, [name]: value });
    };

    const handleNewForm = async (event) => {
        event.preventDefault();

        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        try {
            const { data } = await login({
                variables: { ...UserData },
            });

            console.log(data);
            Auth.login(data.login.token);
        } catch (e) {
            console.error(e);
        }

        setUserData({
            email: '',
            password: '',
        });
    };

    return (
        <>
            <Form noValidate validated={validated} onSubmit={handleNewForm}>
                <Alert
                    dismissible
                    onClose={() => setTriggerAlert(false)}
                    show={TriggerAlert}
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
                        onChange={handleNewInput}
                        value={UserData.email}
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
                        onChange={handleNewInput}
                        value={UserData.password}
                        required
                    />
                    <FormControlFeedback type="invalid">
                        Please enter a password!
                    </FormControlFeedback>
                </FormGroup>
                <Button
                    disabled={!(UserData.email && UserData.password)}
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