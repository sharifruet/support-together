import React, { useState, useEffect, useContext } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { RiLockPasswordFill } from "react-icons/ri";
import { toast } from 'react-toastify';
import useCrud from '../hooks/useCrud';
import CustomButton from "../components/common/CustomButton";
import GlobalContext from '../GlobalContext';

const defaultTheme = createTheme();

export default function ChangePassword() {
    const { user } = useContext(GlobalContext);
    const { changePassword } = useCrud();
    const changePasswordUrl = "/change-password";

    // State to manage form data
    const [formData, setFormData] = useState({
        // userId: user.user.id,
        currentPassword: "",
        newPassword: "",
        success: "",
        error: ""
    });

    // State to manage individual field errors
    const [fieldErrors, setFieldErrors] = useState({
        currentPassword: "",
        newPassword: ""
    });

    // State to manage loading status
    const [loading, setLoading] = useState(false);

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
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
            success: false,
            error: "",
        }));

        // Clear error message for the field when it receives a value
        if (value.trim()) {
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                [name]: "", // Clear error message if field has a value
            }));
        } else {
            // If field value becomes empty, show error message
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                [name]: `${name.charAt(0).toUpperCase() + name.slice(1)} is required`,
            }));
        }
    };

    // Function to handle empty input or select field
    const validateForm = (fields) => {
        const errors = {};
        fields.forEach(({ name, value }) => {
            if (!value || !value.trim()) {
                const formattedName = name.split(/(?=[A-Z])/).join(" "); // Splits camelCase to separate words
                errors[name] = `${formattedName.charAt(0).toUpperCase() + formattedName.slice(1)} is required`;
            }
        });
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Define fields to validate
        const fieldsToValidate = [
            { name: "currentPassword", value: formData.currentPassword },
            { name: "newPassword", value: formData.newPassword }
        ];

        // Validate all fields before submission
        const errors = validateForm(fieldsToValidate);

        // Update field errors
        setFieldErrors(errors);

        // Define success messages for different modal types
        const successMessages = {
            invite: "Password Changed successfully",
            edit: "Email Template updated successfully",
            delete: "Email Template deleted successfully"
        };



        try {
            setLoading(true);
            const responseData = Object.keys(errors).length === 0 && await changePassword(changePasswordUrl, formData);
            console.log(responseData)

            // Check the response and update the form data with success or error message
            if (responseData.message === successMessages["invite"] || typeof responseData === 'object') {
                setFormData({
                    currentPassword: "",
                    newPassword: "",
                    success: responseData.message ? responseData.message : successMessages["invite"],
                    error: "",
                });
                toast.success('🎉 Password changed successfully!', { className: 'toast-success' });
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
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Change Password
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, mb: 1 }}>
                        <TextField
                            id="currentPassword"
                            variant="outlined"
                            name="currentPassword"
                            label="Current Password"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            sx={{ mb: 4 }}
                            fullWidth
                            autoFocus
                            error={Boolean(fieldErrors.currentPassword)} // Set error prop based on field error
                            helperText={fieldErrors.currentPassword} // Provide the error message
                        />
                        <TextField
                            id="newPassword"
                            variant="outlined"
                            name="newPassword"
                            label="New Password"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            fullWidth
                            error={Boolean(fieldErrors.newPassword)} // Set error prop based on field error
                            helperText={fieldErrors.newPassword} // Provide the error message
                        />
                        <div className="flex flex-col space-y-1 w-full pb-4 md:pb-6 mt-4">
                            <CustomButton
                                isLoading={loading}
                                type="submit"
                                icon={<RiLockPasswordFill />}
                                label={"Change Password"}
                                disabled={loading}
                            />
                        </div>
                    </Box>
                </Box>
                <h1><br /><br /><br /></h1>
            </Container>
        </ThemeProvider>
    );
}