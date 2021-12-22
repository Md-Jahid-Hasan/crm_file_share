import React, {useContext, useEffect} from "react";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import "./App.css";
import Dashboard from "./Components/Dashboaard/Dashboard";
import UploadFile from "./Components/UploadFile/UploadFile";
import LoginPage from "./Components/User/LoginPage";
import {GlobalContext} from "./context/Provider";
import Notification from "./Components/Notification";
import LoginPrivateRoute from "./private route/LoginPrivateRoute";
import axios from "axios";
import {getHeader} from "./context/action/auth";
import ShowFile from "./Components/UploadFile/ShowFile";
import LogOutPrivateRoute from "./private route/LogoutPrivateRoute";
import Payment from "./Components/Payment/Payment";

function App() {
    const {authState, authDispatch} = useContext(GlobalContext)

    return (<>
            <Notification/>
             {authState.is_loading ? <p>Loading....</p> :
            <Router>
                <Routes>
                        <Route exact path="" element={
                            <LoginPrivateRoute>
                                <Dashboard/>
                            </LoginPrivateRoute>}/>
                            <Route exact path="/file" element={
                                <LoginPrivateRoute>
                                    <UploadFile/>
                                </LoginPrivateRoute>}/>
                            <Route exact path="/show/:fileId" element={<ShowFile/>}/>
                            <Route exact path="/payment/:fileId" element={
                                <LoginPrivateRoute>
                                    <Payment/>
                                </LoginPrivateRoute>}/>

                            <Route exact path="/login" element={<LoginPage/>}/>

                </Routes>
            </Router> }
        </>

    );
}

export default App;
