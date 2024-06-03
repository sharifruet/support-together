import React, { useRef, useState, useEffect } from "react";
import { Description, PictureAsPdf, InsertDriveFile, AttachFile, Close, CheckCircle } from "@mui/icons-material";
import CloudUploadSharpIcon from '@mui/icons-material/CloudUploadSharp';
import useCrud from "../../hooks/useCrud";

const CustomFileAttachment = ({ setSelectedAttachments, clear }) => {
    const inputRef = useRef();
    const { uploadFile } = useCrud();

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState({});
    const [uploadStatus, setUploadStatus] = useState("select");

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFiles((prevFiles) => [...prevFiles, ...Array.from(event.target.files)]);
            setUploadStatus("select");
        }
    };

    useEffect(() => {
        if (uploadedFiles.length > 0 && !clear) {
            setSelectedAttachments(uploadedFiles);
        } else {
            setSelectedAttachments([]);
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

        try {
            const uploadedFiles = await Promise.all(selectedFiles.map(async (file) => {
                const response = await uploadFile("/uploads", file); // Use uploadFile function
                return response.filePath; // Assuming response contains the file path URL
            }));

            // Set the attachments with the file paths
            setUploadedFiles(prevAttachments => [...prevAttachments, ...uploadedFiles]);

            // Update upload progress for each file
            selectedFiles.forEach(file => {
                setUploadProgress((prevProgress) => ({
                    ...prevProgress,
                    [file.name]: 100,
                }));
            });

            setUploadStatus("done");
        } catch (error) {
            console.error("Upload failed", error);
            setUploadStatus("select");
        }
    };



    const getFileIcon = (file) => {
        const extension = file.name.split('.').pop().toLowerCase();
        switch (extension) {
            case 'pdf':
                return <PictureAsPdf />;
            case 'doc':
            case 'docx':
                return <Description />;
            case 'xls':
            case 'xlsx':
                return <InsertDriveFile />;
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'gif':
                return <img src={URL.createObjectURL(file)} alt={file.name} style={{ width: 50, height: 50 }} />;
            default:
                return <AttachFile />;
        }
    };

    return (
        <div>
            <input
                ref={inputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                style={{ display: "none" }}
            />

            <button className="file-btn mb-3" onClick={onChooseFile} style={{ display: uploadStatus === "uploading" ? "none" : "block" }}>
                <div className="material-symbols-outlined"><CloudUploadSharpIcon /></div>
                <div>
                    {uploadStatus === "done" ? "Upload More Files" : "Upload Files"}
                </div>
            </button>

            {selectedFiles.length > 0 && (
                <>
                    <div className="file-list">
                        {selectedFiles.map((file) => (
                            <div key={file.name} className="file-card mb-3">
                                {getFileIcon(file)}

                                <div className="file-info">
                                    <div style={{ flex: 1 }}>
                                        <h6>{file.name}</h6>

                                        <div className="progress-bg">
                                            <div className="progress" style={{ width: `${uploadProgress[file.name] || 0}%` }} />
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
                                            <Close className="close-icon" />
                                        </button>
                                    ) : (
                                        <div className="check-circle">
                                            {uploadStatus === "uploading" ? (
                                                `${uploadProgress[file.name] || 0}%`
                                            ) : uploadStatus === "done" && uploadProgress[file.name] === 100 ? (
                                                <CheckCircle style={{ fontSize: "20px" }} />
                                            ) : null}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    {uploadStatus !== "uploading" && (
                        <button className="upload-btn" onClick={handleUpload}>
                            {uploadStatus === "select" || uploadStatus === 'uploading' ? "Upload" : "Done"}
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default CustomFileAttachment;
