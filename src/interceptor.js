import LocalStorageService from './LocalStorageService'
import axios from 'axios'

export const intercept = axios.interceptors.request.use(
    config => {
        // const token = LocalStorageService.getAccessToken();
        // if (token) {
           
        //     config.headers['Authorization'] = 'Bearer ' + token.payload.token;
        // }
        // config.headers['Content-Type'] = 'application/json';
        return config;
    },
    error => {
        Promise.reject(error)
    });

   