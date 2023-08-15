import { useState } from 'react'
import axios from 'axios'
import Layout from '../components/Layout';
import Router from "next/router";
import React from 'react';
import Cookies from 'js-cookie';
import { setup } from '../lib/csrf';

type Credentials = {
    username: string;
    password: string;
}

export const getServerSideProps = setup(async () => {
    return { props: {} }
});


const login = async (credentials: Credentials) => {
    const response = await axios.post('/api/auth/login', credentials)
    return response.data
}

export default function loginForm() {
    const [user, setUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleErrorWithTimeout: (err: string, timeout: number) => void = (err, timout) => {
        setErrorMessage(err)
        setTimeout(() => {
            setErrorMessage('')
        }, timout)
    }
    const handleLogin = async (event: React.SyntheticEvent) => {
        event.preventDefault()

        await login({
            username, password,
        }).then((user) => {
            Cookies.set(
                'BlogAppUserToken', JSON.stringify(user), { expires: 1 }
            )
            setUser(user)
            setUsername('')
            setPassword('')
            Router.push('/')
        }).catch((err) => {
            handleErrorWithTimeout(err.response.data.error, 5000);
        })
    }

    const handleSignUp = () => {
        Router.push('/signup');
    };


    return (
        <Layout>
            <div className='body'>
                <form onSubmit={handleLogin}>
                    <div className='login'>
                        <h1>Log In</h1>
                        <div className='form-group'>
                            <div className='error-container'>
                                {errorMessage === '' ? <></> : <p className='error-message'>{errorMessage}</p>}
                            </div>
                        </div>
                        <div className='form-group'>
                            <label htmlFor='username'><b>Username: </b></label>
                            <div className="input-wrapper">
                                <input
                                    id='Uname'
                                    className='input-field'
                                    placeholder='Username'
                                    type='text'
                                    value={username}
                                    name='Username'
                                    onChange={({ target }) => setUsername(target.value)} />
                            </div>
                        </div>
                        <div className='form-group'>
                            <label htmlFor='password'><b>Password: </b></label>
                            <div className="input-wrapper">
                                <input
                                    id='Pass'
                                    className='input-field'
                                    placeholder='Password'
                                    type='password'
                                    value={password}
                                    name='Password'
                                    onChange={({ target }) => setPassword(target.value)} />
                            </div>
                        </div>
                        <div className='form-group'>
                            <input
                                id='log'
                                className='input-field'
                                type='submit'
                                value='Log In' />
                        </div>
                        <div className='signup centered'>
                            Don't have an account?&nbsp; <a onClick={handleSignUp} className='signup-link'>Sign up</a>
                        </div>
                    </div>
                </form>
            </div>
            <style jsx>{`
    .body {
        margin: 0;
        padding: 0;
        font-family: 'Arial';
        display: flex;
        align-items: flex-start;
        justify-content: center;
        height: 100vh;
    }

    .login {
      width: 600px;
      overflow: hidden;
      padding: 80px;
      border-radius: 15px;
      background-color: white;
    }

    .form-group {
        margin-bottom: 20px;
        padding-left: 70px; 
    }

    .error-container {
        height: 30px;
    }
      
    .error-message {
        color: red;
    }

    h1 {
        text-align: center;
    }

    .signup-link {
        color: blue;
        text-decoration: underline;
    }

    .centered {
        display: flex;
        justify-content: center;
    }

    .signup {
        
        display: flex;
        justify-content: center;
    }
  
      .input-field {
        width: 300px;
        height: 30px;
        border: 1px solid #ccc;
        border-radius: 3px;
        padding-left: 8px;
        color: black;
      }

    label {
      font-size: 17px;
    }

    #Uname,
    #Pass,
    #log {
      width: 300px;
      height: 30px;
      border: 1px solid #ccc;
      border-radius: 3px;
      padding-left: 8px;
      color: black;
    }
  `}</style>
        </Layout>
    );
}
