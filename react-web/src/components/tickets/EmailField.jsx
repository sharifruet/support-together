import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, Chip, Box } from '@mui/material';
import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp';
import AvatarIcon from '../../assets/imgIcons/avatar.png';
import Avatar from '../common/Avatar';

const EmailField = ({ setSelectedCcEmails }) => {
    const [searchInput, setSearchInput] = useState('');
    const [ccList, setCcList] = useState([]);
    const [showSelectedOnly, setShowSelectedOnly] = useState(false);

    const handleInputChange = (_, value) => {
        setSearchInput(value);
    };

    useEffect(() => {
        if (ccList.length > 0) {
            setSelectedCcEmails(ccList);
        }
    }, [ccList]);

    const handleCcChange = (_, values) => {
        setCcList(values);
    };

    const handleShowSelectedOnly = () => {
        setShowSelectedOnly(!showSelectedOnly);
    };

    // Filter out selected options from options array
    const optionsWithoutSelected = [searchInput, ...ccList].filter(option => !ccList.includes(option));

    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

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
                            avatar={
                                <Avatar
                                    src={AvatarIcon}
                                    alt="avatarImg"
                                    size="tiny"
                                    shape="round"
                                    border={false}
                                    borderColor=""
                                    bgColor=""
                                    textColor="#fff"
                                    initials=""
                                    name=""
                                    className="mr-2"
                                />
                            }

                        />
                    ))
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Fyi To"
                        variant="outlined"
                    />
                )}
                renderOption={(props, option, { selected }) => (
                    <Box component="li" sx={{ '& > img': { mr: 1, flexShrink: 0 } }} {...props}>
                        <Avatar
                            src={AvatarIcon}
                            alt="avatarImg"
                            size="tiny"
                            shape="round"
                            border={false}
                            borderColor=""
                            bgColor=""
                            textColor="#fff"
                            initials=""
                            name=""
                            className="mr-2"
                        />
                        {option}
                    </Box>
                )}
            />
        </Box>
    );
};

export default EmailField;
