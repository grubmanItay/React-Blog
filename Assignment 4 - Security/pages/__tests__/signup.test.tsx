import { AxiosError } from "axios";
import { error } from "console";
import prisma from "../../lib/prisma";
export {}

const axios = require('axios');
const url = 'http://localhost:3000/api/auth/signup';


describe("Signup possitive tests", () => {
    test('Successful signup', async () => {
        const userData = {
            fullName: "John Doe",
            username: "JohnDoe",
            email: "jane.doe@johndoehub.com",
            password: "123456"
        };

        const response = await axios.post(url, userData);
        expect(response.status).toBe(201);
        expect(response.data.name).toBe("John Doe");
        expect(response.data.username).toBe("JohnDoe");
        expect(response.data).toHaveProperty("token");
        expect(typeof response.data.token).toBe('string');
    });
    afterEach(async () => {
        const username = "JohnDoe";
        await prisma.user.delete({
            where: { userName: username },
          });
        console.log(`${username} deleted successfully from Prisma`);
    });
});

describe("Signup negative tests", () => {
    test('should return error for empty fullName', async () => {
        const userData = {
            fullName: "",
            username: "username",
            email: "email@gmail.com",
            password: "12345"
        };

        await axios.post(url, userData)
        .catch((res: AxiosError) => {
            CheckError(res, 400, "All field are required");
        });
    });

    test('should return error for empty username', async () => {
        const userData = {
            fullName: "full Name",
            username: "",
            email: "email@gmail.com",
            password: "12345"
        };

        await axios.post(url, userData)
        .catch((res: AxiosError) => {
            CheckError(res, 400, "All field are required");
        });
    });

    test('should return error for empty email', async () => {
        const userData = {
            fullName: "full Name",
            username: "username",
            email: "",
            password: "12345"
        };

        await axios.post(url, userData)
        .catch((res: AxiosError) => {
            CheckError(res, 400, "All field are required");
        });
    });

    test('should return error for empty password', async () => {
        const userData = {
            fullName: "full Name",
            username: "username",
            email: "email@gmail.com",
            password: ""
        };

        await axios.post(url, userData)
        .catch((res: AxiosError) => {
            CheckError(res, 400, "All field are required");
        });
    });

    test('should return error for empty fields', async () => {
        const userData = {
            fullName: "",
            username: "",
            email: "",
            password: ""
        };

        await axios.post(url, userData)
        .catch((res: AxiosError) => {
            CheckError(res, 400, "All field are required");
        });
    });

    test('should return error for exist username', async () => {
        const userData = {
            fullName: "full name",
            username: "alice1",
            email: "email@gmail.com",
            password: "123456"
        };

        await axios.post(url, userData)
        .catch((res: AxiosError) => {
            CheckError(res, 409, "Username already exists");
        });
    });

    test('should return error for exist email', async () => {
        const userData = {
            fullName: "full name",
            username: "username123",
            email: "alice@prisma.io",
            password: "12345"
        };

        await axios.post(url, userData)
        .catch((res: AxiosError) => {
            CheckError(res, 409, "Email already exists");
        });
    });
});


const CheckError:(error:AxiosError,status:number, msg: string) => void = (error,status, msg) => {
    expect(error).toHaveProperty("response");
    expect(error.response?.status).toBe(status);
    expect(error.response?.data).toHaveProperty("error");
    expect(error.response?.data).toStrictEqual({error: msg});
}