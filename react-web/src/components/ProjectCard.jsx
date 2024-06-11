import React, { useEffect, useState } from "react";
import TicketList from '../components/TicketList';
import ViewListIcon from '@mui/icons-material/ViewList';
import SupportForm from "./SupportForm";
import OpenModalButton from "./common/OpenModalButton";
import { ReactComponent as AddIcon } from '../assets/svgIcons/add.svg';
import TicketModal from "./tickets/TicketModal";

const ProjectCard = ({ project, tickets }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [ticketData, setTicketData] = useState([]);

    const toggleComponent = () => {
        setIsVisible(!isVisible);
    };

    const handleOpenModal = (ticket, modalType) => {
        setSelectedTicket(ticket);
        setModalType(modalType);
    };

    const handleCloseModal = () => {
        setModalType(null);
        setSelectedTicket(null);
    };

    useEffect(() => {
        if (tickets.length > 0) {
            setTicketData(tickets);
        }
    }, [tickets]);

    const addData = (newData) => {
        setTicketData(prevData => [...prevData, newData]);
    };
    
    return (
        <>
            <div style={{ width: "100%" }} className="bg-white shadow p-4 rounded mt-4">
                <div className="d-flex justify-content-between align-item-center">
                    <div className="d-flex align-item-center">
                        <span><ViewListIcon className="fs-1 pt-1" /></span>
                        <span className="fs-4 pt-1 ms-1" style={{ fontWeight: "600" }}>Ticket List</span>
                    </div>
                    {/* <div onClick={() => handleOpenModal(null, 'add')}>
                        <OpenModalButton label="Create Ticket" icon={<AddIcon />} />
                    </div> */}
                    <button className="btn btn-primary" onClick={toggleComponent}>Create Ticket</button>
                </div>
                {isVisible && <SupportForm project={project} />}
                <TicketModal
                    modalType={modalType}
                    ticket={selectedTicket}
                    closeModal={handleCloseModal}
                    fetchTickets={addData}
                    topic={null}
                    userProject={project}
                />
                <div className="mt-2" style={{ padding: "0.75rem 0", borderTop: "1px solid #e5e7eb" }}>
                    <TicketList tickets={ticketData} project={project} />
                </div>
            </div>
        </>
    );
};

export default ProjectCard;
