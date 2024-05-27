import React, { useState, useEffect } from "react";
import { Modal, TextField, CircularProgress } from "@mui/material";
import { v4 as uuidv4 } from 'uuid';
import { ReactComponent as CancelIcon } from '../../assets/svgIcons/cancel.svg';
import useEmailTemplateService from '../../hooks/useEmailTemplateService';

const EmailTemplateModal = ({ modalType, emailTemplate, closeModal, fetchEmailTemplates }) => {
    const { createEmailTemplate, updateEmailTemplate, deleteEmailTemplate } = useEmailTemplateService();

    // State to manage form data
    const [formData, setFormData] = useState({
        code: uuidv4(),
        name: "",
        body: "",
        subject: "",
        success: "",
        error: "",
        id: ""
    });

    // State to manage loading status
    const [loading, setLoading] = useState(false);

    // Effect to initialize form data based on modal type and email template
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
    }, [emailTemplate, modalType]);

    // Effect to reset error and success messages after 2 seconds
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

    // Function to handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Special handling for the body field to automatically add the name after "Dear" or "Hello"
        if (name === 'body') {
            let updatedValue = value;
            const greetingRegex = /\b(Dear|Hello)\b/i;
            const greetingWithNameRegex = new RegExp(`\\b(Dear|Hello)\\b\\s*${formData.name}`, 'i');

            // Check if the body contains "Dear" or "Hello" without the name
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

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Define success messages for different modal types
        const successMessages = {
            add: "Email Template added successfully",
            edit: "Email Template updated successfully",
            delete: "Email Template deleted successfully"
        };

        // Define actions for different modal types
        const actions = {
            add: () => createEmailTemplate(formData),
            edit: () => updateEmailTemplate(formData.id, formData),
            delete: () => deleteEmailTemplate(emailTemplate.id)
        };

        try {
            setLoading(true);
            const responseData = await actions[modalType]();

            // Check the response and update the form data with success or error message
            if (responseData.message === successMessages[modalType] || typeof responseData === 'object') {
                fetchEmailTemplates();
                setFormData({
                    name: "",
                    code: "",
                    body: "",
                    subject: "",
                    success: responseData.message ? responseData.message : successMessages[modalType],
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
                error: error.message,
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
                className={`${modalType ? "" : "hidden"} fixed top-0 left-0 z-30 w-full h-full bg-black opacity-50`}
            />
            {/* Modal */}
            <Modal
                open={!!modalType}
                onClose={closeModal}
                aria-labelledby="email-template-modal-title"
                aria-describedby="email-template-modal-description"
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
                                className="cursor-pointer text-gray-100 py-1 px-2 rounded-full"
                            >
                                <CancelIcon className="w-6 h-6 font-bold" />
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
                                <h4>Are you sure you want to delete this Email Template?</h4>
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
                                            multiline
                                            rows={10}
                                        />
                                    </div>
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
