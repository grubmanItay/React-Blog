import { useState } from 'react'
import axios from 'axios'
import Layout from '../components/Layout';
import Router from "next/router";
import React from 'react';

type SignUpInfo = {
    fullName: string;
    username: string;
    email: string;
    password: string;
}

export default function signUpForm() {
    const [errorMessage, setErrorMessage] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    async function signUp(info: SignUpInfo) {
        const response = await axios.post('/api/auth/signup', info)
        return response.data
    }

    const handleErrorWithTimeout: (err: string, timeout: number) => void = (err, timout) => {
        setErrorMessage(err)
        setTimeout(() => {
            setErrorMessage('')
        }, timout)
    }

    const handleSignUp = async (event: React.SyntheticEvent) => {
        event.preventDefault()

        await signUp({
            fullName,
            username,
            email,
            password
        }).then(() => {
            setFullName('')
            setEmail('')
            setUsername('')
            setPassword('')
            Router.push('/login')
        }).catch((err) => {
            handleErrorWithTimeout(err.response.data.error, 5000);
        })
    }


    return (
        <Layout>
            <div className='body'>
                <form onSubmit={handleSignUp}>
                    <div className='signup'>
                        <h1>Sign Up</h1>
                        <div className='form-group'>
                            <div className='error-container'>
                                {errorMessage === '' ? <></> : <p className='error-message'>{errorMessage}</p>}
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="full name"><b>Full Name: </b></label>
                            <div className="input-wrapper">
                                <input
                                    id='Name'
                                    className='input-field'
                                    placeholder='Full Name'
                                    type="text"
                                    value={fullName}
                                    name="fullName"
                                    onChange={({ target }) => setFullName(target.value)} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="username"><b>Username: </b></label>
                            <div className="input-wrapper">
                                <input
                                    id='Uname'
                                    className='input-field'
                                    placeholder='Username'
                                    type="text"
                                    value={username}
                                    name="Username"
                                    onChange={({ target }) => setUsername(target.value)} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password"><b>Password: </b></label>
                            <div className="input-wrapper">
                                <input
                                    id='Pass'
                                    className='input-field'
                                    placeholder='Password'
                                    type="password"
                                    value={password}
                                    name="Password"
                                    onChange={({ target }) => setPassword(target.value)} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="email"><b>Email: </b></label>
                            <div className="input-wrapper">
                                <input
                                    id='Email'
                                    className='input-field'
                                    placeholder='example@email.com'
                                    type="email"
                                    value={email}
                                    name="email"
                                    onChange={({ target }) => setEmail(target.value)} />
                            </div>
                        </div>
                        <div className='form-group'>
                            <input className="create"
                                type="submit" value="Create" id='sign' />
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
      
          .signup {
            width: 600px;
            overflow: hidden;
            padding: 20px;
            border-radius: 15px;
            background-color: white;
          }
      
          .form-group {
              margin-bottom: 20px;
              padding-left: 130px;              
          }
      
          .error-container {
              height: 30px;
          }
            
          .error-message {
              color: red;
          }
      
          .centered {
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

          .input-wrapper {
            
          }
      
          h1 {
            text-align: center;
            padding: 20px;
          }
      
          label {
            font-size: 17px;
          }
          
          #Name
          #Email
          #Uname,
          #Pass,
          #sign {
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
