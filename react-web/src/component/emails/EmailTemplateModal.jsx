import React, { useState, useEffect, useRef } from "react";
import { Modal, TextField, CircularProgress } from "@mui/material";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import useEmailTemplateService from '../../hooks/useEmailTemplateService';
import { v4 as uuidv4 } from 'uuid';
import { ReactComponent as CancelIcon } from '../../assets/svgIcons/cancel.svg';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import Dropzone from 'react-dropzone';
import { ArrowDropDown, FormatBold, FormatItalic, FormatUnderlined, Link, Image, Lock, EmojiEmotions, MoreVert } from '@mui/icons-material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EmailTemplateModal = ({ modalType, emailTemplate, closeModal, fetchEmailTemplates }) => {
    const { createEmailTemplate, updateEmailTemplate, deleteEmailTemplate } = useEmailTemplateService();

    const [formData, setFormData] = useState({
        code: uuidv4(),
        name: "",
        body: "",
        subject: "",
        success: "",
        error: "",
        id: ""
    });
    const [loading, setLoading] = useState(false);

    // need to remove start here
    const [attachments, setAttachments] = useState([]);
    const [message, setMessage] = useState('');
    const [showCc, setShowCc] = useState(false);
    const [showBcc, setShowBcc] = useState(false);

    // Ref to track if "Dear [name]" has already been added
    const dearAdded = useRef(false);

    // Ref to track if "Dear [name]" or "Hello [name]" has already been added
    const greetingAdded = useRef(false);

    const handleDrop = (acceptedFiles) => {
        setAttachments([...attachments, ...acceptedFiles]);
    };

    const removeAttachment = (file) => {
        setAttachments(attachments.filter((f) => f !== file));
    };

    const handleSend = (event) => {
        event.preventDefault();
        // Handle the send action here
        console.log('Sending email with message:', message);
        console.log('Attachments:', attachments);
    };

    // need to remove end here

    useEffect(() => {
        if (modalType === 'edit') {
            const { name, code, body, id, subject } = emailTemplate;
            setFormData({
                ...formData,
                name: name || "",
                body: body || "",
                subject: subject || "",
                id: id || "",
                success: false,
                error: false,
            });
        } else {
            setFormData({
                ...formData,
                name: "",
                body: "",
                subject: "",
                id: ""
            });
        }
    }, [emailTemplate]);

    // Reset error and success messages after 2 seconds
    useEffect(() => {
        if (formData.error || formData.success) {
            const timer = setTimeout(() => {
                setFormData((prevData) => ({
                    ...prevData,
                    success: false,
                    error: "",
                }));
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [formData.error, formData.success]);

    // const handleInputChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData((prevData) => ({
    //         ...prevData,
    //         [name]: value,
    //         success: false,
    //         error: "",
    //     }));
    // };

    // const handleInputChange = (e) => {
    //     const { name, value } = e.target;

    //     if (name === 'body') {
    //         let updatedValue = value;
    //         const greetingRegex = /\b(Dear|Hello)\b/i;
    //         const greetingWithNameRegex = new RegExp(`\\b(Dear|Hello)\\b\\s*${formData.name}`, 'i');

    //         if (greetingRegex.test(value) && !greetingWithNameRegex.test(value)) {
    //             updatedValue = value.replace(greetingRegex, (match) => {
    //                 return `${match} ${formData.name}`;
    //             });
    //         }

    //         setFormData((prevData) => ({
    //             ...prevData,
    //             [name]: updatedValue,
    //             success: false,
    //             error: "",
    //         }));
    //     } else {
    //         setFormData((prevData) => ({
    //             ...prevData,
    //             [name]: value,
    //             success: false,
    //             error: "",
    //         }));
    //     }
    // };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'body') {
            let updatedValue = value;
            const greetingRegex = /\b(Dear|Hello)\b/i;
            const greetingWithNameRegex = new RegExp(`\\b(Dear|Hello)\\b\\s*${formData.name}`, 'i');

            if (greetingRegex.test(value) && !greetingWithNameRegex.test(value)) {
                const lines = value.split('\n');
                updatedValue = lines.map(line => {
                    if (greetingRegex.test(line) && !greetingWithNameRegex.test(line)) {
                        return line.replace(greetingRegex, (match) => `${match} ${formData.name}`);
                    }
                    return line;
                }).join('\n');
            }

            setFormData((prevData) => ({
                ...prevData,
                [name]: updatedValue,
                success: false,
                error: "",
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
                success: false,
                error: "",
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const createMessage = "Email Template added successfully"
            const updateMessage = "Email Template updated successfully"
            const responseData = modalType === "add" ? await createEmailTemplate(formData) : modalType === "edit" ? await updateEmailTemplate(formData.id, formData) : await deleteEmailTemplate(emailTemplate.id);
            console.log(responseData)

            if (responseData.message === updateMessage || typeof responseData === 'object') {
                fetchEmailTemplates();
                setFormData({
                    name: "",
                    code: "",
                    body: "",
                    subject: "",
                    success: responseData.message ? responseData.message : createMessage,
                    error: "",
                });
            } else {
                setFormData((prevData) => ({
                    ...prevData,
                    error: responseData.message,
                }));
            }
        } catch (error) {
            console.error(error);
            setFormData((prevData) => ({
                ...prevData,
                error: error,
            }));
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            {/* Black Overlay */}
            <div
                onClick={closeModal}
                className={`${modalType ? "" : "hidden"
                    } fixed top-0 left-0 z-30 w-full h-full bg-black opacity-50`}
            />
            {/* Modal */}
            <Modal
                open={!!modalType}
                onClose={closeModal}
                aria-labelledby="add-category-modal-title"
                aria-describedby="add-category-modal-description"
            >
                <div className="fixed inset-0 m-4 flex items-center justify-center">
                    <div className="bg-white w-1/3 md:w-3/6 shadow-lg flex flex-col items-center space-y-4 overflow-y-auto px-4 py-4 md:px-8">
                        <div className="flex items-center justify-between w-full">
                            <span className="text-left font-semibold text-2xl tracking-wider">
                                {modalType === "add" ? "Add Email Template" : modalType === "edit" ? "Edit Email Template" : "Delete Email Template"}
                            </span>
                            <span
                                style={{ background: "#303031" }}
                                onClick={closeModal}
                                className="cursor-pointer text-gray-100 c-py-1 c-px-2 rounded-full cancelIcon"
                            >
                                <CancelIcon className="w-6 h-6 font-bold cancelSvg" />
                            </span>
                        </div>
                        {formData.error && (
                            <div className="bg-red-200 py-2 px-4 w-full">{formData.error}</div>
                        )}
                        {formData.success && (
                            <div className="bg-green-200 py-2 px-4 w-full">{formData.success}</div>
                        )}

                        <form className="w-full" onSubmit={handleSubmit}>
                            {modalType === 'delete' ? (
                                <>
                                    <h4> Are you sure you want to delete this Email Template?</h4>
                                </>
                            ) : (


                                <div>
                                    <div className="flex flex-col space-y-1 w-full mb-4">
                                        <TextField
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            variant="outlined"
                                            id="name"
                                            label="Name"
                                            fullWidth
                                            required
                                            autoFocus
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-1 w-full mb-4">
                                        <TextField
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            label="Subject"
                                            variant="outlined"
                                            fullWidth
                                            id="subject"
                                            required
                                            autoFocus
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-1 w-full mb-4">
                                        <TextField
                                            name="body"
                                            value={formData.body}
                                            onChange={handleInputChange}
                                            label="Body"
                                            variant="outlined"
                                            fullWidth
                                            id="body"
                                            required
                                            autoFocus
                                            multiline
                                            rows={10}
                                        />
                                    </div>
                                    {/* <ReactQuill
                                        value={message}
                                        onChange={setMessage}
                                        theme="snow"
                                        placeholder="Write your message here..."
                                        modules={{
                                            toolbar: [
                                                [{ 'font': [] }, { 'size': [] }],
                                                ['bold', 'italic', 'underline'],
                                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                ['link', 'image'],
                                                [{ 'align': [] }],
                                            ]
                                        }}
                                    /> */}
                                </div>
                            )}
                            <div className="flex flex-col space-y-1 w-full pb-4 md:pb-6 mt-4">
                                <button
                                    style={{ background: "#303031" }}
                                    type="submit"
                                    className={`bg-gray-800 text-gray-100 rounded-full text-lg font-medium py-2 ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <CircularProgress color="inherit" size={24} />
                                    ) : (
                                        modalType === "add" ? "Add Email Template" : modalType === "edit" ? "Edit Email Template" : "Delete Email Template"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default EmailTemplateModal;

