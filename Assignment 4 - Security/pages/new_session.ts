import { AxiosRequestConfig } from "axios";
import { useState } from "react"
import Cookies from "js-cookie";
// import { ClientUserData } from "./api/userLogics";
import Router, { useRouter } from "next/router";
import { redirect } from 'next/navigation'
const { default: axios } = require('axios');

axios.interceptors.request.use(function (config: AxiosRequestConfig) {
    if (!config.headers) {
        config.headers = {};
    }
    config.headers.Authorization = Cookies.get(`BlogAppUserToken`) || "";
    return config;
});

export interface Session {
    username: string | null;
    name: string | null;
    email: string | null;
    token: string | null;
}


export const getUserSessionFromCookies: () => Session | null = () => {
    if (typeof window !== "undefined") {
        const userToken = Cookies.get(`BlogAppUserToken`);
        const session = userToken ? JSON.parse(userToken) : null;
        return session;
    } else {
        return null;
    }
}

export const signOut = async () => {
    Cookies.remove(`BlogAppUserToken`);
    await Router.push('/')
}
