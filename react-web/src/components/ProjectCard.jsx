import React, { useState, useContext } from "react";
import {
    MdKeyboardArrowDown,
    MdKeyboardArrowUp,
    MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import GlobalContext from "../GlobalContext";
import TicketList from '../components/ticketlist';
import ViewListIcon from '@mui/icons-material/ViewList';

const ICONS = {
    high: <MdKeyboardDoubleArrowUp />,
    medium: <MdKeyboardArrowUp />,
    low: <MdKeyboardArrowDown />,
};

const ProjectCard = ({ project, tickets }) => {
    const { user } = useContext(GlobalContext); 
    const [isVisible, setIsVisible] = useState(false);
    const toggleComponent = () => {
        setIsVisible(!isVisible);
    };
    return (
        <>
            <div style={{ width: "100%" }} className="bg-white shadow p-4 rounded">
                <h2 className="text-left"><ViewListIcon/> Ticket List</h2>
                <div style={{ width: "100%", marginTop: "0.5rem" }} />
                <div style={{ padding: "0.75rem 0", borderTop: "1px solid #e5e7eb" }}>
                    <TicketList tickets={tickets} project={project}/>
                </div>
                <div style={{ width: "100%", paddingBottom: "0.5rem" }}>
                    <button className="btn btn-primary" onClick={toggleComponent}>Create Ticket</button>
                </div>
            </div>
        </>
    );
};

export default ProjectCard;
