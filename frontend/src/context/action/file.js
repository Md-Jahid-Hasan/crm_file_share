import axios from "axios";
import Cookies from 'js-cookie'
import {getHeader, login} from "./auth";

export const getFolder = (sub_folder = "") => {
    return axios
        .get(`api/file/user_file/`, getHeader())
        .then(res => {
            let data = {status: 200, result: res.data}
            return data
        })
        .catch(error => {
            let data = {message: {message: error.response.data.detail, code: "danger"}, status: 400}
            return data
        })
}

export const createNewFolder = (folder) => {
    const body = JSON.stringify({...folder})
    return axios
        .post(`api/directory/folder/`,body, getHeader())
        .then(res => {
            let data = {message: {message: "Folder Create", code: "success"}, status: 200, result: res.data}
            return data
        })
        .catch(error => {
            let data = {message: {message: error.response.data.detail, code: "danger"}, status: 400}
            return data
        })
}

export const updateFolder = (folder) => {
    console.log(folder)
    const id = folder.id
    delete folder.id
    const body = JSON.stringify({...folder})
    return axios
        .patch(`api/file/user_file/${id}/`,body, getHeader())
        .then(res => {
            let data = {message: {message: "Folder Updated", code: "success"}, status: 200, result: res.data}
            return data
        })
        .catch(error => {
            let data = {message: {message: error.response.data.detail, code: "danger"}, status: 400}
            return data
        })
}

export const uploadFile = (source=null, name, size=0, price, link=null) => {
    //const body = JSON.stringify({...folder})
    console.log(source, name, size, price, link)
    let config = getHeader()
    let body;

        if(size !== 0) {
            size = size / 1000
            size = size.toFixed(2)
        }
        // Size measured in KB
        config['Content-Type'] = 'multipart/form-data'
        body = new FormData()
        source && body.append("content", source)
        body.append("name", name)
        body.append("size", size)
        body.append("price", parseInt(price))
        body.append("other_link", link)

    console.log(source, name, size, body, price)
    return axios
        .post("/api/file/user_file/", body, config)
        .then(res => {
             let data = {message: {message: "Confirm", code: "success"}, status: 200, result: res.data}
            return data
        })
        .catch(error => {
            console.log(error.response.data)
            let data = {message: {message: error.response.data.detail, code: "danger"}, status: 400}
            return data
        })
}

export const shareUserFile = ({id, email}) => {
    const body = JSON.stringify(email)
    console.log(email, body)
    return axios
        .post(`/api/directory/file/${id}/share/`, body, getHeader())
        .then(res => {
             let data = {message: {message: "Confirm", code: "success"}, status: 200, result: res.data}
            return data
        })
        .catch(error => {
            let data = {message: {message: error.response.data.detail, code: "danger"}, status: 400}
            return data
        })
}

export const deleteUserContent = (id) => {
    return axios
        .delete(`/api/file/user_file/${id}/`, getHeader())
        .then(res => {
            let data = {message: {message: "Successfully Delete", code: "success"}, status: 200, result: res.data}
            return data
        })
        .catch(error => {
            let data = {message: {message: error.response.data.detail, code: "danger"}, status: 400}
            return data
        })
}

export const userSharedFile = () => {
    return axios
        .get("/api/directory/shared/files/", getHeader())
        .then(res => {
            let data = {status: 200, result: res.data}
            return data
        })
        .catch(error => {
            let data = {message: {message: error.response.data.detail, code: "danger"}, status: 400}
            return data
        })
}

export const share_file = (id, file_id) => {
    const body = JSON.stringify(id)
    return axios
        .post(`/api/file/user_file/${file_id}/share/`,body, getHeader())
        .then(res => {
            console.log(res)
        })
        .catch(error => {
            console.log(error)
        })
}

export const update_file = (id, data) => {
    const body = JSON.stringify(data)
    console.log(body)
    return axios
        .patch(`/api/file/user_file/${id}/`,body, getHeader())
        .then(res => {
            let data = {status: 200, result: res.data}
            return data
        })
        .catch(error => {
            let data = {message: {message: error.response.data.detail, code: "danger"}, status: 400}
            return data
        })
}