import React, { Fragment, useContext, useState, useEffect } from "react";
import { Modal, TextField, CircularProgress, TextareaAutosize, IconButton, Tooltip, Fab } from "@mui/material";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import useEmailTemplateService from '../../hooks/useEmailTemplateService';
import { v4 as uuidv4 } from 'uuid';
import { ReactComponent as CancelIcon } from '../../assets/svgIcons/cancel.svg';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import Dropzone from 'react-dropzone';

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

    // // Update formData with parent ID from context when modal is opened
    // useEffect(() => {
    //     if (data.createCategoryModal && data.createCategoryModal.cParentId !== "") {
    //         setFormData((prevData) => ({
    //             ...prevData,
    //             cParentId: data.createCategoryModal.cParentId,
    //         }));
    //     }
    // }, [data.createCategoryModal]);

    // need to remove start here

    const [attachments, setAttachments] = useState([]);

    const handleDrop = (acceptedFiles) => {
        setAttachments([...attachments, ...acceptedFiles]);
    };

    const removeAttachment = (file) => {
        setAttachments(attachments.filter((f) => f !== file));
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

    const textareaStyle = {
        overflow: 'hidden',
        minHeight: '50px',
        width: '100%',
        padding: '8px',
        border: '1px solid #888',
        borderRadius: '4px',
        marginTop: '20px',
        resize: 'none'
    };

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

    // const fetchData = async () => {
    //     const responseData = await getAllCategory();
    //     if (responseData.Categories) {
    //         dispatch({
    //             type: "fetchCategoryAndChangeState",
    //             payload: responseData.Categories,
    //         });
    //     }
    // };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
            success: false,
            error: "",
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const createMessage = "Email Template added successfully"
            const updateMessage = "Email Template updated successfully"
            const responseData = modalType === "add" ? await createEmailTemplate(formData) : modalType === "edit" ? await updateEmailTemplate(formData.id, formData) : await deleteEmailTemplate(emailTemplate.id);
            console.log(responseData)
            console.log(typeof responseData)
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
                error: "Something went wrong!",
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
                open={modalType}
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
                                <Container className="mt-5">
                                    <Row className="justify-content-md-center">
                                        <Col md={8}>
                                            <Form>
                                                <Form.Group controlId="formEmailTo">
                                                    <TextField fullWidth label="To" variant="outlined" margin="normal" />
                                                </Form.Group>
                                                <Form.Group controlId="formEmailSubject">
                                                    <TextField fullWidth label="Subject" variant="outlined" margin="normal" />
                                                </Form.Group>
                                                <Form.Group controlId="formEmailBody">
                                                    <TextField
                                                        fullWidth
                                                        label="Message"
                                                        variant="outlined"
                                                        margin="normal"
                                                        multiline
                                                        rows={10}
                                                    />
                                                </Form.Group>
                                                
                                                <Button variant="primary" type="submit" className="mt-3">
                                                    <SendOutlinedIcon /> Send
                                                </Button>
                                            </Form>
                                        </Col>
                                    </Row>
                                </Container>
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

