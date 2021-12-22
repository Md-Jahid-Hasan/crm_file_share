import React, {useContext} from "react";
import axios from "axios";
import Cookies from 'js-cookie'

export const getHeader = () => {
    const csrftoken = Cookies.get('csrftoken');
    const token = localStorage.getItem('token')
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        }
    }
    if (token) {
        config.headers['Authorization'] = `JWT ${token}`
    }
    return config
}


export const login = (email, password) => {

    const body = JSON.stringify({email, password})
    return axios
        .post("api/auth/login/", body, getHeader())
        .then(res => {
            let data = {message: {message: "Successfully Login", code: "success"}, status: 200, result: res.data}
            return data
        })
        .catch(error => {
            let data = {message: {message: error.response.data.detail, code: "danger"}, status: 400}
            return data
        })
}

export const getUser = () => {

    return axios
        .get("api/auth/user/", getHeader())
        .then(res => {
            let data = {status: 200, result: res.data}
            return data
        })
        .catch(error => {
            let data = {message: {message: error.response.data.detail, code: "danger"}, status: 400}
            return data
        })
}

export const updateUser = (data) => {
    const id = data.pk
    delete data.pk
    const body = JSON.stringify({...data})

    return axios
        .patch(`api/auth/user/${id}/`, body, getHeader())
        .then(res => {
            console.log(res.data)
            let data = {message: {message: "Successfully Update", code: "success"}, status: 200, result: res.data}
            return data
        })
        .catch(error => {
            console.log(error.response.data)
            let data = {message: {message: error.response.data.detail, code: "danger"}, status: 400}
            return data
        })
}

export const createUser = (data) => {
    const body = JSON.stringify({...data})
    return axios
        .post(`api/auth/user/`, body, getHeader())
        .then(res => {
            console.log(res.data)
            let data = {message: {message: "Successfully Create User", code: "success"}, status: 200, result: res.data}
            return data
        })
        .catch(error => {
            let data = {message: {message: error.response.data.detail, code: "danger"}, status: 400}
            return data
        })
}

export const deleteUser = (id) => {
    return axios
        .delete(`api/auth/user/${id}/`, getHeader())
        .then(res => {
            console.log(res.data)
            let data = {message: {message: "Successfully Deleted User", code: "success"}, status: 200}
            return data
        })
        .catch(error => {
            let data = {message: {message: error.response.data.detail, code: "danger"}, status: 400}
            return data
        })
}

