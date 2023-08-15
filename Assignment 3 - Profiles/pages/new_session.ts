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
    config.headers.Authorization = window.localStorage.getItem(`BlogAppUserToken`) || "";
    return config;
});

export const getUserSessionFromStorage = () => {
    // const router = useRouter()
    if (typeof window !== "undefined") {
        const userToken = window.localStorage.getItem(`BlogAppUserToken`);
        const session = userToken ? JSON.parse(userToken) : null;
        return session;
    } else {
        // router.push("/login");
        return null;
    }



}

export const signOut = async () => {
    window.localStorage.removeItem(`BlogAppUserToken`);
    await Router.push('/')
}
