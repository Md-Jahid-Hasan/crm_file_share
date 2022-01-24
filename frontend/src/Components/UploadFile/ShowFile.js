import React, {useContext, useEffect, useState} from "react";
import ReactDOM from "react-dom";
import FileViewer from "react-file-viewer";
import {useParams} from "react-router-dom";
import axios from "axios";
import {getHeader} from "../../context/action/auth";
import {GlobalContext} from "../../context/Provider";
import {useNavigate} from 'react-router-dom';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";


const onError = e => {
    console.log(e, "error in file-viewer");
};


function ShowFile() {
    const {fileId} = useParams();
    const {notificationDispatch} = useContext(GlobalContext)
    const history = useNavigate();
    const [file, setFile] = useState()
    const [fileType, setFileType] = useState()
    const [isError, setError] = useState()
    const [show,setShow] = useState(false)

    useEffect(() => {
        axios
            .get(`/api/file/user_file/${fileId}/check_availability/`, getHeader())
            .then(res => {
                console.log(res, "re")
                if (res.status === 200) {
                    console.log(res, "re")
                    if(res.data.other_link !== "null"){
                        setError(`This is a external link. We will redirecting you to this link. If not please follow this link - ${res.data.other_link}` )
                        setTimeout(() => {
                            window.location.href = res.data.other_link
                        }, 3000)
                    } else{
                        setFile(res.data)
                        setFileType(res.data.content.split(".").at(-1))
                    }
                }
            })
            .catch(error => {
                console.log(error, "er")
                if (error.response.status === 404){
                    setError("File not found")
                }
               else if(error.response.status === 403){
                   setError("You don't by this file")
                   notificationDispatch({
                        type: "ADD_ALERT",
                        payload: {message:"You need to buy this file to see.", code: "info"}
                    })
                   history(`/payment/${fileId}/`)
               }
               else if(error.response.status === 401){
                    setShow(true)
               }
            })
    }, [])


    const verify_file = (password) => {
        const body = JSON.stringify(password)
        axios
            .post(`/api/file/user_file/${fileId}/check/`, body, getHeader())
            .then(res => {
                console.log(res.data.Success)
                if(res.status === 200){
                    if(res.data.Success.other_link !== "null"){
                        console.log("enter link")
                        setError(`This is a external link. We will redirecting you to this link. If not please follow this link - ${res.data.other_link}` )
                        // setTimeout(() => {
                        //     window.location.href = res.data.other_link
                        // }, 3000)
                    } else{
                        console.log(res.data.Success.content.split(".").at(-1))
                        setFile(res.data.Success)
                        setFileType(res.data.Success.content.split(".").at(-1))
                    }
                }
            })
            .catch(err => {
                console.log(err.response.data)
                notificationDispatch({
                    type: "ADD_ALERT",
                    payload: {message:"Please login to buy this product.", code: "info"}
                })
                history(`/login?next=/payment/${fileId}`)
            })
    }

    const change_password = (password) => {
         const body = JSON.stringify(password)
         axios
            .post(`/api/file/user_file/${fileId}/change/`, body, getHeader())
            .then(res => {
                if(res.status === 200){
                    notificationDispatch({
                    type: "ADD_ALERT",
                    payload: {message:"Password Successfully Change", code: "success"}
                })
                }
            })
            .catch(err => {
                notificationDispatch({
                    type: "ADD_ALERT",
                    payload: {message:err.response.data.Error, code: "danger"}
                })
                history(`/login?next=/payment/${fileId}`)
            })
    }

    const passCheckHandleClose = () => setShow(false);

    const showError = () => (
        <p>{isError}</p>
    )
    // "PKK96p"

    const download_file = () => {
           fetch(file.content, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/pdf',
                },
              })
              .then((response) => response.blob())
              .then((blob) => {
                // Create blob link to download
                const url = window.URL.createObjectURL(
                  new Blob([blob]),
                );
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute(
                  'download',
                  file.name,
                );

                // Append to html link element page
                document.body.appendChild(link);

                // Start download
                link.click();

                // Clean up and remove the link
                link.parentNode.removeChild(link);
              });
    }

    return (
        <div style={{textAlign: "center", height: '100%'}}>
            {file && <Button className="m-2" variant="secondary" onClick={() => download_file()}> Download </Button>}
            {isError && showError()}
            {file &&
                <FileViewer fileType={fileType}
                            filePath={file.content}
                            onError={onError}

                />
            }

            <Modal show={show} onHide={passCheckHandleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{file ? "Change" : "Check"} Password</Modal.Title>
                </Modal.Header>
                <input className="folder-input" type="text" id="pass" name="pass"/>
                <Modal.Footer>
                    <Button variant="secondary" onClick={passCheckHandleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={() => {
                        !file ? verify_file(document.getElementById("pass").value) :
                         change_password(document.getElementById("pass").value)
                        passCheckHandleClose()
                    }}>
                        {file ? "Change" : "Check"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ShowFile
