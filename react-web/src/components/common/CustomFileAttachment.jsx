import React, { useRef, useState, useEffect } from "react";
import { AttachFile, CheckCircle } from "@mui/icons-material";
import CloudUploadSharpIcon from '@mui/icons-material/CloudUploadSharp';
import { LiaTrashSolid } from "react-icons/lia";
import useCrud from "../../hooks/useCrud";
import Avatar from "./Avatar";
import PdfIcon from '../../assets/imgIcons/pdf.png';
import WordIcon from '../../assets/imgIcons/word.png';
import ExcelIcon from '../../assets/imgIcons/excel.png';
import PPtIcon from '../../assets/imgIcons/ppt.png';
import TxtIcon from '../../assets/imgIcons/txt.png';


const CustomFileAttachment = ({ setSelectedAttachments, clear }) => {
    const inputRef = useRef();
    const { uploadFile } = useCrud();

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState({});
    const [uploadStatus, setUploadStatus] = useState("select");
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFiles((prevFiles) => [...prevFiles, ...Array.from(event.target.files)]);
            setUploadStatus("select");
        }
    };

    useEffect(() => {
        if (uploadedFiles.length > 0 && clear === false) {
            setSelectedAttachments(uploadedFiles);
        } else if (clear === true) {
            setSelectedAttachments([]);
            setSelectedFiles([]);
            setUploadStatus("select");
        }
    }, [uploadedFiles, clear]);

    const onChooseFile = () => {
        inputRef.current.click();
    };

    const clearFileInput = () => {
        inputRef.current.value = "";
        setSelectedFiles([]);
        setUploadProgress({});
        setUploadStatus("select");
    };

    const handleUpload = async () => {
        if (uploadStatus === "done") {
            clearFileInput();
            return;
        }

        setUploadStatus("uploading");
        setLoading(true);
        const uploadedFilePaths = [];

        await Promise.all(selectedFiles.map(async (file) => {
            try {
                const response = await uploadFile("/uploads", file, (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress((prevProgress) => ({
                        ...prevProgress,
                        [file.name]: percentCompleted,
                    }));
                }
                );
                uploadedFilePaths.push(response.filePath);  // Assuming response contains filePath
                setUploadProgress((prevProgress) => ({
                    ...prevProgress,
                    [file.name]: 100,
                }));
            } catch (error) {
                setUploadProgress((prevProgress) => ({
                    ...prevProgress,
                    [file.name]: 0,
                }));
            }
        }));

        setUploadedFiles(uploadedFilePaths);
        setUploadStatus("done");
        setLoading(false);
    };

    const getFileIcon = (file) => {
        const extension = file.name.split('.').pop().toLowerCase();
        switch (extension) {
            case 'pdf':
                return <Avatar
                    src={PdfIcon}
                    alt={file.name}
                    size="medium"
                    shape="squareRounded"
                    border={false}
                    borderColor="#000"
                    bgColor="#fff"
                    textColor="#fff"
                    initials={""}
                    name=""
                    className=""
                />;
            case 'txt':
                return <Avatar
                    src={TxtIcon}
                    alt={file.name}
                    size="medium"
                    shape="squareRounded"
                    border={false}
                    borderColor="#000"
                    bgColor="#fff"
                    textColor="#fff"
                    initials={""}
                    name=""
                    className=""
                />;
            case 'ppt':
            case 'pptx':
                return <Avatar
                    src={PPtIcon}
                    alt={file.name}
                    size="medium"
                    shape="squareRounded"
                    border={false}
                    borderColor="#000"
                    bgColor="#fff"
                    textColor="#fff"
                    initials={""}
                    name=""
                    className=""
                />;
            case 'doc':
            case 'docx':
                return <Avatar
                    src={WordIcon}
                    alt={file.name}
                    size="medium"
                    shape="squareRounded"
                    border={false}
                    borderColor="#000"
                    bgColor="#fff"
                    textColor="#fff"
                    initials={""}
                    name=""
                    className=""
                />
            case 'xls':
            case 'xlsx':
                return <Avatar
                    src={ExcelIcon}
                    alt={file.name}
                    size="medium"
                    shape="squareRounded"
                    border={false}
                    borderColor="#000"
                    bgColor="#fff"
                    textColor="#fff"
                    initials={""}
                    name=""
                    className=""
                />
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'gif':
                return <Avatar
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    size="medium"
                    shape="squareRounded"
                    border={false}
                    borderColor="#000"
                    bgColor=""
                    textColor="#fff"
                    initials={""}
                    name=""
                    className=""
                />
            default:
                return <AttachFile />;
        }
    };

    return (
        <>
            <input
                ref={inputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                style={{ display: "none" }}
            />

            <button type="button" className="file-btn mb-3" onClick={onChooseFile} disabled={uploadStatus === "uploading"} style={{ display: "block", cursor: uploadStatus === "uploading" ? 'not-allowed' : 'pointer' }}>
                <div><CloudUploadSharpIcon /></div>
                <div>
                    {uploadStatus === "uploading" ? "Uploading..." : "Upload Files"}
                </div>
            </button>

            {selectedFiles.length > 0 && (
                <>
                    {selectedFiles.map((file) => (
                        <div key={file.name} className="file-card mb-3">
                            <span className="icon">{getFileIcon(file)}</span>

                            <div className="file-info">
                                <div style={{ flex: 1 }}>
                                    <h6>{file.name}</h6>

                                    <div className="progress-bg-upload">
                                        <div className="progress-rate-upload" style={{ width: `${uploadProgress[file.name] || 0}%` }} />
                                    </div>
                                </div>

                                {uploadStatus === "select" ? (
                                    <button onClick={() => {
                                        setSelectedFiles((prevFiles) => prevFiles.filter(f => f.name !== file.name));
                                        setUploadProgress((prevProgress) => {
                                            const { [file.name]: _, ...rest } = prevProgress;
                                            return rest;
                                        });
                                    }}>
                                        <LiaTrashSolid className="close-icon" />
                                    </button>
                                ) : (
                                    <div className="check-circle">
                                        {uploadStatus === "uploading" ? (
                                            `${uploadProgress[file.name] || 0}%`
                                        ) : uploadStatus === "done" && uploadProgress[file.name] === 100 ? (
                                            <CheckCircle style={{ fontSize: "20px", color: "green" }} />
                                        ) : null}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    <button type="button" className="upload-btn" onClick={handleUpload} disabled={loading} style={{ cursor: loading ? 'not-allowed' : 'pointer' }}>
                        {uploadStatus === "select" ? "Upload" : (uploadStatus === 'uploading' ? "Uploading..." : "Done")}
                    </button>
                </>
            )}
        </>
    );
};

export default CustomFileAttachment;
