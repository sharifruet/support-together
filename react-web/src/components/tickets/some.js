import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, Chip, Box, IconButton } from '@mui/material';
import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp';

const EmailField = ({ onEmailsChange }) => {
    const [searchInput, setSearchInput] = useState('');
    const [ccList, setCcList] = useState([]);
    const [showSelectedOnly, setShowSelectedOnly] = useState(false);

    const handleInputChange = (_, value) => {
        setSearchInput(value);
    };

    useEffect(() => {
        // Update parent component with the current selection
        onEmailsChange(ccList);
    }, [ccList, onEmailsChange]);

    const handleCcChange = (_, values) => {
        setCcList(values);
    };

    const handleShowSelectedOnly = () => {
        setShowSelectedOnly(!showSelectedOnly);
    };

    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // Filter out selected options from options array
    const optionsWithoutSelected = [searchInput, ...ccList].filter(option => !ccList.includes(option));

    const showOptionsTray = isValidEmail(searchInput) && !showSelectedOnly;

    return (
        <Box>
            <Autocomplete
                multiple
                freeSolo
                id="tags-filled"
                options={showOptionsTray ? optionsWithoutSelected : []}
                value={ccList}
                inputValue={searchInput}
                onInputChange={handleInputChange}
                onChange={handleCcChange}
                renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                        <Chip
                            key={option}
                            label={option}
                            onDelete={() => {
                                const filteredList = ccList.filter((email) => email !== option);
                                setCcList(filteredList);
                            }}
                            {...getTagProps({ index })}
                            avatar={<AccountCircleSharpIcon />} // Add AccountCircleSharpIcon as avatar
                        />
                    ))
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="CC"
                        variant="outlined"
                    />
                )}
                renderOption={(props, option) => (
                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                        <img
                            loading="lazy"
                            width="20"
                            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                            alt=""
                        />
                        {option.label} ({option.code}) +{option.phone}
                    </Box>
                )}
            />
            {/* <IconButton onClick={handleShowSelectedOnly}>
                {showSelectedOnly ? 'Show All' : 'Show Selected Only'}
            </IconButton> */}
        </Box>
    );
};

export default EmailField;
