import React from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { getInitials } from "../utils";

const UserInfo = ({ user }) => {
    const popover = (
        <Popover id="popover-basic">
            <Popover.Body className="d-flex align-items-center gap-4 p-3">
                <div className="w-16 h-16 bg-primary rounded-circle text-white d-flex align-items-center justify-center text-2xl">
                    <span className="text-center font-bold">
                        {getInitials(user?.name)}
                    </span>
                </div>
                <div className="d-flex flex-column gap-1">
                    <p className="text-black text-xl font-bold mb-0">{user?.name}</p>
                    <span className="text-base text-muted">{user?.title}</span>
                    <span className="text-primary">
                        {user?.email ?? "email@example.com"}
                    </span>
                </div>
            </Popover.Body>
        </Popover>
    );

    return (
        <div className="px-4">
            <OverlayTrigger
                trigger="click"
                placement="bottom"
                overlay={popover}
                rootClose
            >
                <button className="btn btn-link p-0 m-0">
                    <span>{getInitials(user?.name)}</span>
                </button>
            </OverlayTrigger>
        </div>
    );
};

export default UserInfo;
