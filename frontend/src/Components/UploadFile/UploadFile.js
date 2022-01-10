import React, {useEffect, useState, useContext} from "react";
import "./UploadFile.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import RegisterFromModal from "../User/RegisterFromModal";
import {getHeader, getUser} from "../../context/action/auth";
import {ContextMenu, MenuItem, ContextMenuTrigger, SubMenu} from "react-contextmenu";
import {useFileUpload} from "use-file-upload";
import {
    createNewFolder,
    deleteUserContent,
    getFolder,
    shareUserFile, update_file,
    updateFolder,
    uploadFile, userSharedFile
} from "../../context/action/file";
import {useNavigate, useLocation, Redirect, Link} from 'react-router-dom';
import {GlobalContext} from "../../context/Provider";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/ListGroup";
import axios from "axios";


const UploadFile = () => {
    // New Folder Function
    const {notificationDispatch, authDispatch} = useContext(GlobalContext)
    const [show, setShow] = useState(false);
    const [showFile, setShowFile] = useState(false);
    const [shareFile, setShareFile] = useState(false);
    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);
    const [editFolderData, setEditFolderData] = useState({id: '', name: ''})
    const [deleteData, setDeleteData] = useState({})
    const [userDetails, setUserDetails] = useState({})
    const [fileDetails, setFileDetails] = useState({})
    const [errorPlaceholder, setErrorPlaceholder] = useState("Enter price of document")
    const [reShow, setReShow] = useState(false)
    const [passChangeModal, setPassChangeModal] = useState(false)

    const location = useLocation();
    const history = useNavigate();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const reHandleClose = () => setReShow(false);

    // Rename Function
    const [changePriceShow, setChangePriceShow] = useState(false);
    const [fileUploadShow, setFileUploadShow] = useState(false);

    const priceChangeHandleClose = () => setChangePriceShow(false);
    const priceChangeHandleShow = () => setChangePriceShow(true);


    //File Folder Details
    const [detailsShow, setDetailsShow] = useState(false);


    const detailsHandleClose = () => setDetailsShow(false);
    const detailsHandleShow = () => setDetailsShow(true);

    const onError = e => {
        console.log(e, "error in file-viewer");
    };

    const [values, setValues] = useState({
        password: "",
        showPassword: false,
    });
    const handleClickShowPassword = () => {
        setValues({...values, showPassword: !values.showPassword});
    };

    const user_details = ()=> {
        getUser()
            .then(res => {
                if (res.status === 200) {
                    console.log(res.result)
                    setUserDetails(res.result)
                    setReShow(true)
                } else if (res.status === 400) {
                    notificationDispatch({
                        type: "ADD_ALERT",
                        payload: res.message
                    })
                }
            })
    }

    useEffect(() => {
        getFolder(location.search)
            .then(res => {
                if (res.status === 400) {
                    notificationDispatch({
                        type: "ADD_ALERT",
                        payload: res.message
                    })
                } else if (res.status === 200) {
                    setFiles(res.result)
                }
            })
    }, [])

    // File Upload
    const [file, selectFile] = useFileUpload();
    const fileUpload = () => {
        const price = document.getElementById('price-upload').value
        console.log(price)
        selectFile({}, ({source, name, size, file}) => {
           if(price !== ""){
                uploadFile(file, name, size, price, null)
                    .then(res => {
                        let data
                        if (res.status === 400) {
                            data = res.message
                        } else if (res.status === 200) {
                            data = res.message
                            setFiles(prevState => [...prevState, res.result])
                        }
                        setFileUploadShow(false)
                        notificationDispatch({
                            type: "ADD_ALERT",
                            payload: data
                        })
                    })
                    } else{
//                        notificationDispatch({
//                            type: "ADD_ALERT",
//                            payload: "Please provide a valid price"
//                         })
                            setErrorPlaceholder("Please, Provide a valid price")
                        }
                  }
            );
}


    const copyCoupon = (e, data) => {
        var coupon = data.copy;
        navigator.clipboard.writeText(coupon);
        alert(`Coupon code ${coupon} copied to your clipboard`);
    };

    const createFolder = () => {
        handleClose()
        const name = document.getElementById("name").value
        const price = document.getElementById("price").value
        const link = document.getElementById("link").value

        uploadFile(null, name, 0, price, link)
                .then(res => {
                    let data
                    if (res.status === 400) {
                        data = res.message
                    } else if (res.status === 200) {
                        data = res.message
                        setFiles(prevState => [...prevState, res.result])
                    }
                    setFileUploadShow(false)
                    notificationDispatch({
                        type: "ADD_ALERT",
                        payload: data
                    })
                })
    }

    const renameFolder = () => {
        priceChangeHandleClose()
        //let new_user = users.map(u => u.pk === user.pk ? user : u)
        updateFolder(editFolderData)
            .then(res => {
                let data;
                if (res.status === 400) {
                    data = res.message
                } else if (res.status === 200) {
                    data = res.message
                    let new_folders = folders.map(f => f.pk === res.result.pk ? res.result : f)
                    setFolders(new_folders)
                }
                notificationDispatch({
                    type: "ADD_ALERT",
                    payload: data
                })
            })
    }
     const UpdateFile = (id, data) => {
        //let new_user = users.map(u => u.pk === user.pk ? user : u)
         console.log("Working")
        update_file(id, data)
            .then(res => {
                let data;
                if (res.status === 400) {
                    data = res.message
                } else if (res.status === 200) {
                    data = {message: "Update Successfully", code: "success"}
                    let new_files = file.map(f => f.pk === res.result.pk ? res.result : f)
                    setFiles(new_files)
                }
                notificationDispatch({
                    type: "ADD_ALERT",
                    payload: data
                })
            })
    }

    const deleteContent = () => {
        deleteUserContent(deleteData.id)
            .then(res => {
                let data;
                if (res.status === 400) {
                    data = res.message
                } else if (res.status === 200) {
                    data = res.message
                    if (deleteData.fType === "folder") {
                        let test = folders.filter(f => f.id !== deleteData.id)
                        setFolders(test)
                    } else {
                        let test = files.filter(f => f.id !== deleteData.id)
                        setFiles(test)
                    }
                }
                notificationDispatch({
                    type: "ADD_ALERT",
                    payload: data
                })
            })
    }

    const changePassword = (password) => {
         const body = JSON.stringify(password)
         axios
            .post(`/api/file/user_file/${fileDetails.slug}/change/`, body, getHeader())
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
            })
    }

    return (
        <>
            <section className="upload-section">
                <div>

                    <div className="upload-div">

                        <label className="dropdown">
                            <div className="dd-button">
                                <i className="fas fa-plus"></i> New
                            </div>

                            <input type="checkbox" className="dd-input" id="test"/>

                            <ul className="dd-menu">
                                <li onClick={handleShow}>
                                    <i className="fas fa-folder-plus"></i> Add Link
                                </li>
                                <li onClick={() => setFileUploadShow(true)}>
                                    <i className="fas fa-file-upload"></i> File Upload
                                </li>
                            </ul>
                        </label>

                         <div>
                            <Button onClick={user_details}>User Details</Button>
                         </div>

                        <div>
                            <Button variant="secondary" onClick={() => {
                                authDispatch({
                                    type: "LOG_OUT"
                                })
                                history('/login')
                            }}>Logout</Button>
                        </div>
                    </div>


                    <div className="upload-folder">
                        <h5 className="upload-text">Files</h5>

                        <div className="upload-folder-btn">

                           {files.map(file =>
                                <Link to={file.other_link === "null" && {pathname:`/show/${file.slug}/`}} target="_blank" rel="noopener noreferrer">
                                    <a href={file.other_link !== "null" && file.other_link} target="_blank">
                                    <ContextMenuTrigger id="contextmenu" collect={() => {
                                          setFileDetails(file)
                                          setDeleteData({id: file.slug})
                                    }}>
                                        <button>
                                            <i className="fas fa-file-alt"></i>{" "}
                                            <div className="content-name">
                                                <span className="content-name"> {file.name} </span>
                                            </div>
                                        </button>
                                    </ContextMenuTrigger>     </a>
                                </Link>
                           )}

                        </div>

                    </div>

                </div>
            </section>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>New Folder</Modal.Title>
                </Modal.Header>
                <label htmlFor="name">Name</label>
                <input className="folder-input" type="text" id="name" name="name" placeholder="Name"/>
                <input className="folder-input" type="text" id="price" name="price"  placeholder="Price"/>
                <input className="folder-input" type="text" id="link" name="link" placeholder="Link"/>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={() => createFolder()}>
                        Create
                    </Button>
                </Modal.Footer>
            </Modal>

            <ContextMenu id="contextmenu" className="right-btn">
                <MenuItem onClick={priceChangeHandleShow} className="right-btn-sub">
                    <i className="fas fa-file-signature"></i>
                    <span>Change Price</span>
                </MenuItem>
                <MenuItem className="right-btn-sub"
                          onClick={() => UpdateFile(fileDetails.slug, {"is_public": !fileDetails.is_public})}>
                    <i className="fas fa-share-square"></i>
                    <span>{fileDetails.is_public ? "Make Private" : "Make Public"}</span>
                </MenuItem>
                <MenuItem className="right-btn-sub" onClick={detailsHandleShow}>
                    <i className="fas fa-feather-alt"></i>
                    <span>Details</span>
                </MenuItem>
                <MenuItem className="right-btn-sub" onClick={deleteContent}>
                    <i className="fas fa-trash-alt"></i>
                    <span>Delete</span>
                </MenuItem>
                <MenuItem className="right-btn-sub" onClick={() => setPassChangeModal(true)}>
                    <i className="fas fa-trash-alt"></i>
                    <span>Change Password</span>
                </MenuItem>
            </ContextMenu>



            <Modal show={fileUploadShow} onHide={() => setFileUploadShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Upload File</Modal.Title>
            </Modal.Header>
            <input className="folder-input" type="text" id="price-upload" name="price" placeholder={errorPlaceholder}/>
                <button onClick={() => {
                    fileUpload()
                }}>Insert File</button>
            <Modal.Footer>
                <Button variant="secondary" onClick={priceChangeHandleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={renameFolder}>
                    Update
                </Button>
            </Modal.Footer>
        </Modal>

            <Modal show={detailsShow} onHide={detailsHandleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Details</Modal.Title>
                </Modal.Header>
                {fileDetails && <ListGroup as="ol" numbered>
                    <ListGroup.Item
                        as="li"
                        className="d-flex justify-content-between align-items-start"
                    >
                        <div className="ms-2 me-auto">
                            <div className="fw-bold">File Name</div>
                        </div>
                        <Badge variant="primary" pill>
                            {fileDetails.name}
                        </Badge>
                    </ListGroup.Item>

                    <ListGroup.Item
                        as="li"
                        className="d-flex justify-content-between align-items-start"
                    >
                        <div className="ms-2 me-auto">
                            <div className="fw-bold">Availability</div>
                        </div>
                        <Badge variant="primary" pill>
                            {fileDetails.is_public ? "Public" : "Private"}
                        </Badge>
                    </ListGroup.Item>

                    <ListGroup.Item
                        as="li"
                        className="d-flex justify-content-between align-items-start"
                    >
                        <div className="ms-2 me-auto">
                            <div className="fw-bold">File Size</div>
                        </div>
                        <Badge variant="primary" pill>
                            {fileDetails.size}
                        </Badge>
                    </ListGroup.Item>

                    <ListGroup.Item
                        as="li"
                        className="d-flex justify-content-between align-items-start"
                    >
                        <div className="ms-2 me-auto">
                            <div className="fw-bold">Price</div>
                        </div>
                        <Badge variant="primary" pill>
                            {fileDetails.price}
                        </Badge>
                    </ListGroup.Item>

                    <ListGroup.Item
                        as="li"
                        className="d-flex justify-content-between align-items-start"
                    >
                        <div className="ms-2 me-auto">
                            <div className="fw-bold">Creating Date</div>
                        </div>
                        <Badge variant="primary" pill>
                            {new Date(fileDetails.created_at).toString()}
                        </Badge>
                    </ListGroup.Item>
                </ListGroup>}
                <Modal.Footer>
                    <Button variant="secondary" onClick={detailsHandleClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={changePriceShow} onHide={priceChangeHandleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Price</Modal.Title>
                </Modal.Header>
                <input className="folder-input" type="text" id="changePrice" name="changePrice" onChange={
                    (e) => setEditFolderData({...editFolderData, name: e.target.value})
                }/>
                <Modal.Footer>
                    <Button variant="secondary" onClick={priceChangeHandleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={() => {
                        UpdateFile(fileDetails.slug, {"price": document.getElementById("changePrice").value})
                        priceChangeHandleClose()
                    }}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={passChangeModal} onHide={() => setPassChangeModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Password</Modal.Title>
                </Modal.Header>
                <input className="folder-input" type="text" id="pass" name="pass"/>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setPassChangeModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={() => {
                         changePassword(document.getElementById("pass").value)
                        setPassChangeModal(false)
                    }}>
                        Change
                    </Button>
                </Modal.Footer>
            </Modal>

            <div>
                <Modal show={reShow} onHide={reHandleClose}>
                    <RegisterFromModal
                        reHandleClose={reHandleClose}
                        clickPassword={handleClickShowPassword}
                        valueShow={values.showPassword}
                        user={userDetails}
                        //userUpdate={userUpdate}
                    />
                </Modal>
            </div>
        </>
    );
};

export default UploadFile;
