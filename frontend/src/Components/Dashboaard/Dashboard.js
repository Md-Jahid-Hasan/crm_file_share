import React, {useState, useEffect, useContext} from "react";
import "./Dashboard.css";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import RegisterFromModal from "../User/RegisterFromModal";
import {getUser, deleteUser} from "../../context/action/auth";
import {GlobalContext} from "../../context/Provider";
import {useNavigate} from "react-router-dom";
import Button from "react-bootstrap/Button";

const Dashboard = () => {
    //   Register Modal Function
    const {notificationDispatch, authDispatch} = useContext(GlobalContext)
    const [reShow, setReShow] = useState(false);
    const [users, setUsers] = useState([])
    const [userDetails, setUserDetails] = useState({})
    const history = useNavigate();

    useEffect(() => {
        getUser()
            .then(res => {
                if (res.status === 200) {
                    setUsers([])
                } else if (res.status === 400) {
                    notificationDispatch({
                        type: "ADD_ALERT",
                        payload: res.message
                    })
                }
            })
    }, [])

    const userUpdate = (user, create = false) => {
        if (create) {
            setUsers(prevState => [...prevState, user])
        } else {
            let new_user = users.map(u => u.pk === user.pk ? user : u)
            setUsers(new_user)
        }
    }

    const userDelete = (id) => {
        deleteUser(id)
            .then(res => {
                if (res.status === 200) {
                    let test = users.filter(user => user.pk !== id)
                    setUsers(test)
                    notificationDispatch({
                        type: "ADD_ALERT",
                        payload: res.message
                    })
                } else if (res.status === 400) {
                    notificationDispatch({
                        type: "ADD_ALERT",
                        payload: res.message
                    })
                }
            })
    }

    const reHandleClose = () => setReShow(false);
    const reHandleShow = (user = {}) => {
        setReShow(true)
        setUserDetails(user)
    };

    //   Password Eye Function
    const [values, setValues] = useState({
        password: "",
        showPassword: false,
    });
    const handleClickShowPassword = () => {
        setValues({...values, showPassword: !values.showPassword});
    };

    return (
        <>
            <section className="dashboard-section">
                <div className="dashboard-div">
                    <h3>Dashboard</h3>
                    <button className="btn-login" onClick={() => reHandleShow()}>
                        Create User
                    </button>
                    <button className="btn-login" onClick={() => history("/file")}>
                        File
                    </button>
                    <Button variant="secondary" onClick={() => {
                        authDispatch({
                            type: "LOG_OUT"
                        })
                        history('/login')
                    }}>Logout</Button>
                </div>

                <div className="dashboard-table">
                    <table className="table">
                        <thead>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Email</th>
                        <th>User Details</th>
                        <th>Delete</th>
                        </thead>
                        <tbody>
                        {users && users.map((user, key) =>
                            <tr key={key}>
                                <td data-label="Name" className="td">
                                    {user.name}
                                </td>
                                <td data-label="Type">{user.is_staff ? "Admin" : "User"}</td>
                                <td data-label="Email">{user.email}</td>
                                <td data-label="User">
                                    <button className="btn-login" onClick={() => reHandleShow(user)}>
                                        Details
                                    </button>
                                </td>
                                <td data-label="Delete">
                                    <button className="btn-login" onClick={() => userDelete(user.pk)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </section>

            <div>
                <Modal show={reShow} onHide={reHandleClose}>
                    <RegisterFromModal
                        reHandleClose={reHandleClose}
                        clickPassword={handleClickShowPassword}
                        valueShow={values.showPassword}
                        user={userDetails || false}
                        userUpdate={userUpdate}
                    />
                </Modal>
            </div>
        </>
    );
};

export default Dashboard;
