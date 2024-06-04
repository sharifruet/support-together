import React, { useRef, useState } from "react";
import useCrud from "../../hooks/useCrud";
import { Description, PictureAsPdf, InsertDriveFile, AttachFile, Close, CheckCircle } from "@mui/icons-material";

const CustomFileAttachment = () => {
    const inputRef = useRef();
    const { uploadFile } = useCrud();

    const [selectedFile, setSelectedFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState("select");

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const onChooseFile = () => {
        inputRef.current.click();
    };

    const clearFileInput = () => {
        inputRef.current.value = "";
        setSelectedFile(null);
        setProgress(0);
        setUploadStatus("select");
    };

    const handleUpload = async () => {
        if (uploadStatus === "done") {
            clearFileInput();
            return;
        }

        try {
            setUploadStatus("uploading");

            const formData = new FormData();
            formData.append("file", selectedFile);

            const response = await uploadFile("/uploads",
            selectedFile,
                {
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setProgress(percentCompleted);
                    },
                }
            );

            setUploadStatus("done");
        } catch (error) {
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
                onChange={handleFileChange}
                style={{ display: "none" }}
            />

            {/* Button to trigger the file input dialog */}
            {!selectedFile && (
                <button type="button" className="file-btn" onClick={onChooseFile}>
                    <span className="material-symbols-outlined">upload</span> Upload File
                </button>
            )}

            {selectedFile && (
                <>
                    <div className="file-card">
                        <span className="material-symbols-outlined icon">{getFileIcon(selectedFile)}</span>

                        <div className="file-info">
                            <div style={{ flex: 1 }}>
                                <h6>{selectedFile?.name}</h6>

                                <div className="progress-bg">
                                    <div className="progress" style={{ width: `${progress}%` }} />
                                </div>
                            </div>

                            {uploadStatus === "select" ? (
                                <button type="button" onClick={clearFileInput}>
                                    <span className="material-symbols-outlined close-icon">
                                        <Close className="close-icon" />
                                    </span>
                                </button>
                            ) : (
                                <div className="check-circle">
                                    {uploadStatus === "uploading" ? (
                                        console.log(progress),
                                        `${progress}%`
                                    ) : uploadStatus === "done" ? (
                                        <span
                                            className="material-symbols-outlined"
                                            style={{ fontSize: "20px" }}
                                        >
                                            <CheckCircle />
                                        </span>
                                    ) : null}
                                </div>
                            )}
                        </div>
                    </div>
                    <button type="button" className="upload-btn" onClick={handleUpload}>
                        {uploadStatus === "select" || uploadStatus === 'uploading' ? "Upload" : "Done"}
                    </button>
                </>
            )}
        </div>
    );
};

export default CustomFileAttachment;



// const handleUpload = async () => {
//     if (uploadStatus === "done") {
//         clearFileInput();
//         return;
//     }

//     setUploadStatus("uploading");

//     const uploadedFilePaths = [];

//     await Promise.all(selectedFiles.map(async (file) => {
//         try {
//             const response = await uploadFile("/uploads", file, (progressEvent) => {
//                 const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//                 setUploadProgress((prevProgress) => ({
//                     ...prevProgress,
//                     [file.name]: percentCompleted,
//                 }));
//             });

//             uploadedFilePaths.push(response.filePath);  // Assuming response contains filePath
//             setUploadProgress((prevProgress) => ({
//                 ...prevProgress,
//                 [file.name]: 100,
//             }));
//         } catch (error) {
//             setUploadProgress((prevProgress) => ({
//                 ...prevProgress,
//                 [file.name]: 0,
//             }));
//         }
//     }));

//     setAttachments(uploadedFilePaths);
//     setUploadStatus("done");
// };