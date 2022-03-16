import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, FormGroup, FormControl, FormControlFeedback } from 'react-bootstrap';

import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';

import Auth from '../utils/auth';

const LoginForm = () => {

    const [UserData, setUserData] = useState ({
        username: '',
        email: '',
        password: '',
    });

    const [validated] = useState(false);

    const [TriggerAlert, setTriggerAlert] = useState (false);

    const [addUser, { error }] = useMutation(ADD_USER);

    useEffect(() => {
        if (error) {
            setTriggerAlert(true);
        } else {
            setTriggerAlert(false);
        }
    }, [error]);

    const handleNewInput = (event) => {
        const { name, value } = event.target;
        setUserData({ ...UserData, [name]: value});
    };

    const handleNewForm = async (event) => {
        event.preventDefault();

        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        try {
            const { data } = await addUser({
                variables: { ...UserData },
            });
            console.log(data);
            Auth.login(data.addUser.token);
        } catch (err) {
            console.error(err);
        }

        setUserData({
            username: '',
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
                    Please Try to sign-up again.
                </Alert>

                <FormGroup>
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <FormControl
                        type="text"
                        placeholder="Your username"
                        name="username"
                        onChange={handleNewInput}
                        value={UserData.username}
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
                        onChange={handleNewInput}
                        value={UserData.email}
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
                        onChange={handleNewInput}
                        value={UserData.password}
                        required
                    />
                    <FormControlFeedback type="invalid">
                        Please enter your password!
                    </FormControlFeedback>
                </FormGroup>
                <Button
                    disabled={
                        !(
                            UserData.username &&
                            UserData.email &&
                            UserData.password
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

export default LoginForm;