import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiTwotoneFolderOpen } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { HiDuplicate } from "react-icons/hi";
import { MdAdd, MdOutlineEdit } from "react-icons/md";
import { LiaEdit } from "react-icons/lia";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Dropdown } from "react-bootstrap";
import TicketModal from "./tickets/TicketModal";


const ProjectDialog = ({ project }) => {
    const [openEdit, setOpenEdit] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [selectedTicket, setSelectedTicket] = useState(null);


    const navigate = useNavigate();

    const handleOpenModal = (ticket, modalType) => {
        setSelectedTicket(ticket);
        setModalType(modalType);
    };

    const handleCloseModal = () => {
        setModalType(null);
        setSelectedTicket(null);
    };

    const items = [
        {
            label: "Open Ticket",
            icon: <AiTwotoneFolderOpen className="mr-2 h-5 w-5" aria-hidden="true" />,
            onClick: () => navigate(`/project/${project.id}`),
        },
        {
            label: "Add Ticket",
            icon: <MdAdd className="mr-2 h-5 w-5" aria-hidden="true" />,
            onClick: () => handleOpenModal(null, "add"),
        },
        {
            label: "Edit Ticket",
            icon: <LiaEdit className="mr-2 h-5 w-5" aria-hidden="true" />,
            onClick: () => handleOpenModal(null, "edit"),
        }
    ];

    return (
        <>
            <Dropdown align={{ lg: 'end' }}>
                <Dropdown.Toggle
                    id="dropdown-basic"
                    className="border-0 bg-transparent p-0 m-0"
                >
                    <BsThreeDots style={{ fill: "#000" }} />
                </Dropdown.Toggle>
                <Dropdown.Menu className="animated-dropdown-menu p-4" style={{ fontSize: "16px", lineHeight: "24px" }}>
                    {items.map((item) => (
                        <Dropdown.Item key={item.label} className="p-2 rounded-2">
                            <div onClick={item?.onClick}>
                                {item.icon}
                                <span>{item.label}</span>
                            </div>
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>

            <TicketModal
                modalType={modalType}
                ticket={selectedTicket}
                closeModal={handleCloseModal}
                fetchTickets={null}
                topic={null}
            />
        </>
    );
};

export default ProjectDialog;
