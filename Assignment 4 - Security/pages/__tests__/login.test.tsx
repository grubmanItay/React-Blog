import { AxiosError } from "axios";
export {}

const axios = require('axios');
const url = 'http://localhost:3000/api/auth/login';
describe("Login possitive tests", () => {
    test('Successful Login', async () => {
        const userData = {
            username: 'alice1',
            password: '12345'
        };

        const response = await axios.post(url, userData);
        expect(response.status).toBe(200);
        expect(response.data.name).toBe("Alice");
        expect(response.data.username).toBe("alice1");
        expect(response.data).toHaveProperty("token");
        expect(typeof response.data.token).toBe('string');
    });
});

describe("Login negative tests", () => {
    test('should return error for empty username', async () => {
        const userData = {
        username: '',
        password: 'password'
        };
        await axios.post(url, userData)
        .catch((res: AxiosError) => {
            CheckError(res,400,"All field are required");
        });
    });

    test('should return error for empty password', async () => {
        const userData = {
        username: 'username',
        password: ''
        };
        await axios.post(url, userData)
        .catch((res: AxiosError) => {
            CheckError(res,400,"All field are required");
        });
    });

    test('should return error for empty username and password', async () => {
        const userData = {
        username: '',
        password: ''
        };
        await axios.post(url, userData)
        .catch((res: AxiosError) => {
            CheckError(res,400,"All field are required");
        });
    });

    test('should return error for invalid username', async () => {
        const userData = {
        username: 'wrong-username',
        password: '12345'
        };
        await axios.post(url, userData)
        .catch((res: AxiosError) => {
            CheckError(res,401,"Invalid username or password");
        });
    });

    test('should return error for invalid password', async () => {
        const userData = {
        username: 'alice1',
        password: 'wrong-password'
        };
        await axios.post(url, userData)
        .catch((res: AxiosError) => {
            CheckError(res,401,"Invalid username or password");
        });
    });

    test('should return error for invalid username and password', async () => {
        const userData = {
        username: 'wrong-username',
        password: 'wrong-password'
        };
        await axios.post(url, userData)
        .catch((res: AxiosError) => {
            CheckError(res,401,"Invalid username or password");
        });
    });
});

const CheckError:(error:AxiosError,status:number, msg: string) => void = (error,status, msg) => {
    expect(error).toHaveProperty("response");
    expect(error.response?.status).toBe(status);
    expect(error.response?.data).toHaveProperty("error");
    expect(error.response?.data).toStrictEqual({error: msg});
}