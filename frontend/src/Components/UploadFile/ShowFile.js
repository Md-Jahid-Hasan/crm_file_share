import React, {useContext, useEffect, useState} from "react";
import ReactDOM from "react-dom";
import FileViewer from "react-file-viewer";
import {useParams} from "react-router-dom";
import axios from "axios";
import {getHeader} from "../../context/action/auth";
import {GlobalContext} from "../../context/Provider";


const onError = e => {
    console.log(e, "error in file-viewer");
};


function ShowFile() {
    const {fileId} = useParams();
    const {notificationDispatch} = useContext(GlobalContext)

    const [file, setFile] = useState()
    const [fileType, setFileType] = useState()
    const [isError, setError] = useState()

    useEffect(() => {
        axios
            .get(`/api/file/user_file/${fileId}/`, getHeader())
            .then(res => {
                console.log(res)
                if (res.status === 200) {
                    setFile(res.data)
                    setFileType(res.data.content.split(".").at(-1))
                }
            })
            .catch(error => {
               if(error.response.status === 403)
                   setError("You dont by this file")
            })
    }, [])

    const showError = () => (
        <p>{isError}</p>
    )

    return (
        <div style={{textAlign: "center", height: '100%'}}>
            {isError && showError()}
            {file &&
                <FileViewer fileType={fileType}
                            filePath={file.content}
                            onError={onError}

                />
            }
        </div>
    );
}

export default ShowFile
