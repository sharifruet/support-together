import React, { useState, useContext } from "react";
import { Dropdown } from "react-bootstrap";
import { FaUser, FaUserLock } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { getInitials } from "../../utils";
import GlobalContext from '../../GlobalContext';
import Avatar from "./Avatar";

const UserAvatar = () => {
    const { user, onLogout } = useContext(GlobalContext); // Get user data from context
    const [open, setOpen] = useState(false);
    const [openPassword, setOpenPassword] = useState(false);
    const navigate = useNavigate();

    const logoutHandler = () => {
        onLogout();
    };

    return (
        <>
            <Dropdown>
                <Dropdown.Toggle
                    id="dropdown-basic"
                    className="border-0 bg-transparent p-0 m-0"
                >
                    <span className="text-white font-semibold">
                        <Avatar
                            src={""}
                            alt="Alternate text"
                            size="medium"
                            shape="round"
                            border={false}
                            borderColor="#000"
                            bgColor="blue"
                            textColor="#fff"
                            initials={user?.user?.name}
                            name=""
                            className=""
                        />
                    </span>
                </Dropdown.Toggle>

                <Dropdown.Menu className="dropdown-menu-end p-4 animated-dropdown-menu" style={{fontSize: "16px", lineHeight: "24px"}}>
                    <Dropdown.Item className="p-2 rounded-2" onClick={() => setOpen(true)}>
                        <FaUser className="me-2" aria-hidden="true" />
                        Profile
                    </Dropdown.Item>

                    <Dropdown.Item className="p-2 rounded-2" onClick={() => setOpenPassword(true)}>
                        <FaUserLock className="me-2" style={{fontSize: "18px"}} aria-hidden="true" />
                        Change Password
                    </Dropdown.Item>

                    <Dropdown.Item onClick={logoutHandler} className="text-danger p-2 rounded-2">
                        <IoLogOutOutline className="me-2" style={{fontSize: "22px"}} aria-hidden="true" />
                        Logout
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
};

export default UserAvatar;
